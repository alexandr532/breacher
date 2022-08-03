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

  // Create a copy of the object and assign type to it
  public clone(obj: any): T {
    // First object that is cloned becomes the prototype
    if (!this._keys) {
      this._init(obj);
      return this.clone(obj);
    }
    const result: any = {}
    for (let key of this._keys) {
      // This _id check normalizes id if it came from MongoDb.
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
