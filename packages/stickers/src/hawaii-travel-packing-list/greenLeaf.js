/*
 * Copyright 2021 Google LLC
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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Green Leaf', 'sticker name', 'web-stories');

function GreenLeaf({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 28 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M2.20444 47.4851C2.246 48.4718 2.36837 49.5956 2.47611 49.9824C2.77764 51.0647 3.49895 51.1332 4.02676 50.1296C4.1611 49.8741 4.51855 49.4695 4.82106 49.2304C5.12358 48.9913 5.4032 48.7347 5.44245 48.66C5.538 48.4783 7.22562 47.3276 9.28055 46.043C10.9907 44.9739 11.3058 44.7108 13.4251 42.5825C15.6134 40.385 19.6439 33.804 20.6967 30.7095C21.7183 27.7066 21.7171 27.7116 21.8572 25.7546C22.0013 23.741 21.0913 20.4832 20.2633 20.0478C20.0925 19.958 19.9619 19.5213 20.0537 19.3467C20.1367 19.189 20.844 19.5757 21.2309 19.9901C21.4045 20.1761 21.7581 20.5451 22.0166 20.8101C22.275 21.0751 22.6187 21.5681 22.7804 21.9057C23.7123 23.8524 25.6696 18.5304 25.0409 15.7592C25.0062 15.6061 24.9843 15.3426 24.9925 15.1736C25.0006 15.0047 24.7672 14.4216 24.4736 13.8779C23.6748 12.3984 23.7951 11.4981 24.6535 12.5319C24.8332 12.7484 25.0775 12.9767 25.1966 13.0393C25.3156 13.1019 25.5696 13.4048 25.7609 13.7124C26.2818 14.5496 26.746 14.1907 27.0357 12.7269C27.5488 10.1352 26.5963 8.01553 24.3119 6.66462L22.9019 5.83085L23.7122 4.3179C24.1578 3.48578 24.7556 2.52039 25.0408 2.1727C25.61 1.47849 25.6713 1.10074 25.2506 0.879525C24.766 0.624675 23.8964 1.61153 22.6123 3.87377L21.706 5.47044L20.5594 5.5382C17.9079 5.6949 15.5267 7.41923 12.5207 11.3595C12.0897 11.9245 11.6334 12.4823 10.6722 13.6191C10.1725 14.2099 9.47927 15.1087 8.64537 16.2467C7.20285 18.2153 3.35792 24.8882 3.13303 25.8131C3.05647 26.1283 2.90082 26.7425 2.78707 27.178C2.53245 28.1539 2.63109 28.2882 3.6191 28.3098C4.04958 28.3192 4.74703 28.3348 5.16914 28.3442C6.86242 28.3824 6.82354 29.0997 5.11063 29.424C2.98651 29.8261 2.71522 30.0051 1.9144 31.5332C0.983667 33.3089 0.602202 35.5369 0.963716 37.0843C1.05269 37.465 1.14476 38.0775 1.16842 38.4455C1.19208 38.8134 1.31546 39.5431 1.44259 40.067C1.56971 40.5909 1.69133 41.3197 1.71272 41.6864C1.73425 42.0532 1.76842 42.4036 1.7888 42.4651C1.80918 42.5266 1.84223 42.8764 1.86224 43.2424C1.88225 43.6084 1.9153 43.9582 1.93567 44.0197C1.95605 44.0812 1.9891 44.431 2.00911 44.797C2.02912 45.163 2.06417 45.5138 2.08706 45.5766C2.10996 45.6395 2.16275 46.4982 2.20444 47.4851Z"
        fill="#4B8C74"
      />
    </svg>
  );
}

GreenLeaf.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 51,
  svg: GreenLeaf,
  title,
};
