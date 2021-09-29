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
function getMediaWithScaleCss({ width, height, offsetX, offsetY }) {
  // todo@: This is a complete duplication of `mediaWithScale` above. But
  // no other apparent way to execute interpolate `mediaWithScale` dynamically.
  return `width:${width}px; height:${height}px; left:${-offsetX}px; top:${-offsetY}px;`;
}
export default getMediaWithScaleCss;
