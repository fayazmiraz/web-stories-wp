/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useCallback, useEffect, useMemo } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useSnackbar } from '@web-stories-wp/design-system';
import { useConfig, useAPI } from '@web-stories-wp/story-editor';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  calculateImageSelectOptions,
  mustBeCropped,
  getResourceFromMediaPicker,
} from './utils';
import WordPressImageCropper from './WordPressImageCropper';

const defaultCropParams = {
  height: 0,
  width: 0,
  flex_width: false,
  flex_height: false,
};

/**
 * Custom hook to open the WordPress media modal.
 *
 * @param {Object} props Props.
 * @param {string} [props.title] Media modal title.
 * @param {string} [props.buttonInsertText] Text to use for the "Insert" button.
 * @param {Function} props.onSelect Selection callback. Used to process the inserted image.
 * @param {string} props.onSelectErrorMessage Text displayed when incorrect file type is selected.
 * @param {Function?} props.onClose Close Callback.
 * @param {Function?} props.onPermissionError Callback for when user does not have upload permissions.
 * @param {string|string[]} props.type Media type(s).
 * @param {boolean} props.multiple Whether multi-selection should be allowed.
 * @param {Object} props.cropParams Object params for cropped images.
 * @return {Function} Callback to open the media picker.
 */
function useMediaPicker({
  title = __('Upload to Story', 'web-stories'),
  buttonInsertText = __('Insert into page', 'web-stories'),
  onSelect,
  onSelectErrorMessage = __('Unable to use this file type.', 'web-stories'),
  onClose,
  onPermissionError,
  type = '',
  multiple = false,
  cropParams,
}) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    try {
      // The Uploader.success callback is invoked when a user uploads a file.
      // This is used to mark files as "uploaded to the story editor"
      // in case we eventually want to allow filtering such files.
      // Note: at this point the video has not yet been inserted into the canvas,
      // it's just in the WP media modal.
      // Video poster generation for newly added videos is done in <MediaPane>.
      wp.Uploader.prototype.success = ({ attributes }) => {
        updateMedia(attributes.id, {
          web_stories_media_source: 'editor',
          alt_text: attributes.alt || attributes.title,
        });
      };
    } catch (e) {
      // Silence.
    }
  }, [updateMedia]);

  const openMediaDialog = useCallback(
    (evt) => {
      trackEvent('open_media_modal');

      // If a user does not have the rights to upload to the media library, do not show the media picker.
      if (!hasUploadMediaAction) {
        if (onPermissionError) {
          onPermissionError();
        }
        evt.preventDefault();
        return;
      }

      // Create the media frame.
      const fileFrame = global.wp.media({
        title,
        library: {
          type,
        },
        button: {
          text: buttonInsertText,
        },
        multiple,
      });

      // When an image is selected, run a callback.
      fileFrame.once('select', () => {
        const mediaPickerEl = fileFrame
          .state()
          .get('selection')
          .first()
          .toJSON();

        // Only allow user to select a mime type from allowed list.
        if (Array.isArray(type) && !type.includes(mediaPickerEl.mime)) {
          showSnackbar({ message: onSelectErrorMessage });

          return;
        }
        mediaPickerEl.alt = mediaPickerEl.alt || mediaPickerEl.title;
        onSelect(getResourceFromMediaPicker(mediaPickerEl));
      });

      if (onClose) {
        fileFrame.once('close', onClose);
      }

      fileFrame.once('content:activate:browse', () => {
        // Force-refresh media modal contents every time it's opened
        // to avoid stale data due to media items being upload & updated
        // through the editor in the meantime.
        fileFrame.content?.get()?.collection?._requery(true);
        fileFrame.content?.get()?.options?.selection?.reset();
      });

      // Finally, open the modal
      fileFrame.open();

      evt.preventDefault();
    },
    [
      hasUploadMediaAction,
      showSnackbar,
      onPermissionError,
      onClose,
      onSelect,
      buttonInsertText,
      onSelectErrorMessage,
      multiple,
      type,
      title,
    ]
  );

  const openCropper = useCallback(
    (evt) => {
      trackEvent('open_media_crop_modal');
      // If a user does not have the rights to upload to the media library, do not show the media picker.
      if (!hasUploadMediaAction) {
        if (onPermissionError) {
          onPermissionError();
        }
        evt.preventDefault();
        return;
      }

      const params = {
        ...defaultCropParams,
        ...cropParams,
      };

      const control = {
        id: 'control-id',
        params,
        mustBeCropped,
      };

      const button = {
        text: buttonInsertText,
        close: false,
      };

      // Create the media frame.
      const fileFrame = global.wp.media({
        button,
        states: [
          new wp.media.controller.Library({
            title,
            library: wp.media.query({ type }),
            button,
            multiple,
            suggestedWidth: params.width,
            suggestedHeight: params.height,
          }),
          // In a Karma context `wp.media.controller.Cropper.extend` will not exist yet
          // during time of import, despite mocking, so WordPressImageCropper won't be
          // a class with a proper constructor.
          // This safeguard below prevents errors in tests while retaining full functionality
          // in the actual app at runtime.
          WordPressImageCropper &&
            new WordPressImageCropper({
              imgSelectOptions: calculateImageSelectOptions,
              control,
            }),
        ],
      });

      fileFrame.once('cropped', (attachment) => {
        if (attachment?.id) {
          const alt_text = attachment.alt || attachment.title;
          updateMedia(attachment.id, {
            web_stories_media_source: 'editor',
            alt_text,
          });
          attachment.alt = alt_text;
        }
        onSelect(getResourceFromMediaPicker(attachment));
      });

      fileFrame.once('skippedcrop', () => {
        const mediaPickerEl = fileFrame
          .state()
          .get('selection')
          .first()
          .toJSON();
        mediaPickerEl.alt = mediaPickerEl.alt || mediaPickerEl.title;
        onSelect(getResourceFromMediaPicker(mediaPickerEl));
      });

      fileFrame.once('select', () => {
        const mediaPickerEl = fileFrame
          .state()
          .get('selection')
          .first()
          .toJSON();

        // Only allow user to select a mime type from allowed list.
        if (Array.isArray(type) && !type.includes(mediaPickerEl.mime)) {
          fileFrame.close();
          showSnackbar({ message: onSelectErrorMessage });

          return;
        }

        if (
          control.params.width === mediaPickerEl.width &&
          control.params.height === mediaPickerEl.height &&
          !control.params.flex_width &&
          !control.params.flex_height
        ) {
          mediaPickerEl.alt = mediaPickerEl.alt || mediaPickerEl.title;
          onSelect(getResourceFromMediaPicker(mediaPickerEl));
          fileFrame.close();
        } else {
          fileFrame.setState('cropper');
        }
      });

      if (onClose) {
        fileFrame.once('close', onClose);
      }

      fileFrame.once('content:activate:browse', () => {
        // Force-refresh media modal contents every time
        // to avoid stale data.
        fileFrame.content?.get()?.collection?._requery(true);
        fileFrame.content?.get()?.options?.selection?.reset();
      });

      // Finally, open the modal
      fileFrame.open();

      evt.preventDefault();
    },
    [
      hasUploadMediaAction,
      cropParams,
      buttonInsertText,
      title,
      type,
      multiple,
      onSelect,
      onClose,
      onPermissionError,
      updateMedia,
      showSnackbar,
      onSelectErrorMessage,
    ]
  );

  return useMemo(() => {
    return cropParams ? openCropper : openMediaDialog;
  }, [cropParams, openCropper, openMediaDialog]);
}

useMediaPicker.propTypes = {
  title: PropTypes.string,
  buttonInsertText: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSelectErrorMessage: PropTypes.string,
  onClose: PropTypes.func,
  onPermissionError: PropTypes.func,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  cropParams: PropTypes.object,
  multiple: PropTypes.bool,
};

export default useMediaPicker;
