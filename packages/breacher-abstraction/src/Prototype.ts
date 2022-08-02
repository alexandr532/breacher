/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
export default class Prototype<T> {
  private _keys: string[] | undefined;

  // Input prototype object
  public constructor(prototype: T) {
    this._init(prototype);
  }

  // Create a copy of the object and assign type to it
  public clone(obj: any): T {
    if (!this._keys) {
      throw("Prototype: Missing prototype object, unable to clone");
    }
    const result: any = {}
    for (let key of this._keys) {
      // This _id check normalizes id if it came from mongodb.
      result[key] = key === '_id' ? obj[key].toString : obj[key];
    }
    return result as T;
  }

  private _init(proto: T) {
    if (!proto) {
      return;
    }
    this._keys = Object.keys(proto);
  }
}
