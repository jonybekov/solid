/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export default function (node) {
  let children = node.children;
  let direction = node.flexDirection || 'row';
  let dimension = direction === 'row' ? 'width' : 'height';
  let marginOne = direction === 'row' ? 'marginLeft' : 'marginTop';
  let marginTwo = direction === 'row' ? 'marginRight' : 'marginBottom';
  let prop = direction === 'row' ? 'x' : 'y';
  let containerSize = node[dimension];
  let itemSize = children.reduce((prev, c) => prev + c[dimension], 0);
  let gap = node.gap || 0;
  let numChildren = children.length;
  let justify = node.justifyContent || 'flexStart';

  if (justify === 'flexStart') {
    let start = 0;
    children.forEach((c) => {
      c[prop] = start + (c[marginOne] || 0);
      start += c[dimension] + gap + (c[marginOne] || 0) + (c[marginTwo] || 0);
    });
  }
  if (justify === 'flexEnd') {
    let start = containerSize;
    for (var i = numChildren - 1; i >= 0; i--) {
      let c = children[i];
      c[prop] = start - c[dimension] - (c[marginTwo] || 0);
      start -= c[dimension] + gap + (c[marginOne] || 0) + (c[marginTwo] || 0);
    }
  }
  if (justify === 'center') {
    let start = (containerSize - (itemSize + gap * (numChildren - 1))) / 2;
    children.forEach((c) => {
      c[prop] = start;
      start += c[dimension] + gap;
    });
  }
  if (justify === 'spaceBetween') {
    let toPad = (containerSize - itemSize) / (numChildren - 1);
    let start = 0;
    children.forEach((c) => {
      c[prop] = start;
      start += c[dimension] + toPad;
    });
  }
  if (justify === 'spaceEvenly') {
    let toPad = (containerSize - itemSize) / (numChildren + 1);
    let start = toPad;
    children.forEach((c) => {
      c[prop] = start;
      start += c[dimension] + toPad;
    });
  }
}
