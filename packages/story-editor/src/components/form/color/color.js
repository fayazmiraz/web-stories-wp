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
import { forwardRef, useCallback } from '@web-stories-wp/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, sprintf } from '@web-stories-wp/i18n';
import { getPreviewText, PatternPropType } from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../constants';
import applyOpacityChange from './applyOpacityChange';
import OpacityInput from './opacityInput';
import ColorInput from './colorInput';

const Container = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Space = styled.div`
  width: 8px;
  height: 1px;
  margin: 6px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;

// 10px comes from divider
const InputWrapper = styled.div`
  width: calc(50% - 10px);
`;

const Color = forwardRef(function Color(
  {
    onChange,
    allowsGradient = false,
    allowsOpacity = true,
    allowsSavedColors = false,
    value = null,
    label = null,
    changedStyle = null,
  },
  ref
) {
  const handleOpacityChange = useCallback(
    (newOpacity) => onChange(applyOpacityChange(value, newOpacity)),
    [value, onChange]
  );

  const containerLabel = sprintf(
    /* translators: %s: color input label name. */
    __('Color input: %s', 'web-stories'),
    label
  );

  const displayOpacity =
    value !== MULTIPLE_VALUE && Boolean(getPreviewText(value));

  return (
    <Container aria-label={containerLabel}>
      <InputWrapper>
        <ColorInput
          ref={ref}
          onChange={onChange}
          allowsGradient={allowsGradient}
          allowsOpacity={allowsOpacity}
          value={value}
          label={label}
          allowsSavedColors={allowsSavedColors}
          changedStyle={changedStyle}
        />
      </InputWrapper>
      {allowsOpacity && displayOpacity && (
        <>
          <Space />
          <InputWrapper>
            <OpacityInput value={value} onChange={handleOpacityChange} />
          </InputWrapper>
        </>
      )}
    </Container>
  );
});

Color.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  allowsGradient: PropTypes.bool,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  changedStyle: PropTypes.string,
};

export default Color;
