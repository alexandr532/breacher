/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import DataAbstraction from './DataAbstraction';

export default class AbstractionFactory extends DataAbstraction {
  // Implementation of collection interactionmethods bound to current bridge.
  // Factory gets _collectionName to make the interface, and a Prototype
  // exemplar, that has a clone function to pretend another object edjecting
  // the copy.
  // Each item will be checked and changed to the prototype object structure.
  public constructor(
    private _collectionName: string,
    private _prototype: Prototype
  ) {
    super();
  }

  // Every implemention here has arror wrapping, so the final consumer will get
  // not only what was not working, but the exet reason comming from current
  // database implementor.
  public async fetch(): Promise<Object[]> {
    try {
      const items: Object[] = await this.getItems(this._collectionName);
      return items.map(this._prototype.clone);
    } catch (e) {
      throw(`Error fetching items from ${this._collectionName} collection : ${e}`);
    }
  }

  // Can take one object as parameter, to search for all matching key: value pairs,
  // or can take two parameters, where firs is key name (string) and second is a
  // primitive value
  // TODO Add some checks on find parameters not allowing breaking walues
  public async find(query: string | Object, value?: any): Promise<Object[]> {
    const searchQuery = typeof query === 'object' ? query : {
      [query]: value
    };
    try {
      const items: Object[] = await this.findItems(this._collectionName, searchQuery);
      return items.map(this._prototype.clone)
    } catch (e) {
      throw(`Error finding items in ${this._collectionName} collection : ${e}`);
    }
  }

  // TODO Add Prototype clone and strict clone functions.
  // Strict clone should check if object matches expected structure to show
  // warning if not
  // TODO Return only inserted item _id from addItem implemention
  // so we can change it in prototype to edject new copy, same as it would be
  // returned from addItem. Mongodb returns inserted _id by default
  public async insert(item: Object): Promise<Object> {
    try {
      const insertable: Object = this._prototype.clone(item);
      const insertedItem: Object = this.addItem(this._collectionName, insertable);
      return this._prototype.clone(insertedItem);
    } catch (e) {
      throw(`Error inserting item in ${this._collectionName} collection : ${e}`);
    }
  }

  // objectId is not allowed outside, so parameter is string only
  public async item(_id: string): Promise<Object | void> {
    try {
      const item: Object | void = this.findItemById(this._collectionName, _id);
      return item ? this._prototype.clone(item) : undefined;
    } catch (e) {
      throw(`Error searching item in ${this._collectionName} collection : ${e}`);
    }
  }

  public async remove(_id: string): Promise<void> {
    try {
      return this.removeItemById(this._collectionName, _id);
    } catch (e) {
      throw(`Error removing item in ${this._collectionName} collection : ${e}`);
    }
  }

  // TODO Can be more performant skipping the findItemById call after replacement
  // just returning the cloned item, so no need in replacedItem comming from
  // replaceItemById
  public async replace(_id: string, item: Object): Promise<Object> {
    try {
      const insertable: Object = this._prototype.clone(item);
      const replacedItem = await this.replaceItemById(this._collectionName, _id, insertable);
      return this._prototype.clone(replacedItem);
    } catch (e) {
      throw(`Error replacing item in ${this._collectionName} collection : ${e}`);
    }
  }
}
