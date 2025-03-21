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

/**
 * Children class
 */
export default class Children extends Array {
  constructor(node) {
    super();
    this._parent = node;
  }

  get selected() {
    return this[this._parent.selected || 0];
  }

  get firstChild() {
    return this[0];
  }

  get previousSibling() {
    if (this._parent) {
      let children = this._parent.children;
      let index = children.indexOf(this) - 1;
      if (index >= 0) {
        return children[index];
      }
    }

    return null;
  }

  get nextSibling() {
    if (this._parent) {
      let children = this._parent.children;
      let index = children.indexOf(this) + 1;
      if (index < children.length) {
        return children[index];
      }
    }
    return null;
  }

  insert(node, beforeNode) {
    if (beforeNode) {
      let index = this.indexOf(beforeNode);
      this.splice(index, 0, node);
    } else {
      this.push(node);
    }

    node.parent = this._parent;
    this._parent._isDirty = true;
  }

  remove(node) {
    const nodeIndexToRemove = this.indexOf(node);
    if (nodeIndexToRemove >= 0) {
      this.splice(nodeIndexToRemove, 1);
    }
  }
}
