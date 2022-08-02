/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import DataAbstraction from './DataAbstraction';
import {IImplementor} from './Implementor';
import Prototype from './Prototype';

export default class AbstractionFactory<T> extends DataAbstraction {
  // Implementation of collection interaction methods bound to current bridge.
  // Factory gets collection name to make the interface, and a Prototype
  // exemplar, that has a clone function to pretend another object ejecting
  // the copy.
  // Each item will be checked and changed to the prototype object structure.
  public constructor(
    protected implementor: IImplementor,
    private _collectionName: string,
    private _prototype: Prototype<T>
  ) {
    super();
  }

  // Every implementation here has error wrapping, so the final consumer will get
  // not only what was not working, but the exact reason coming from current
  // database implementor.
  public async fetch(): Promise<T[]> {
    try {
      const items: any[] = await this.getItems(this._collectionName);
      return items.map(this._prototype.clone);
    } catch (e) {
      throw(`Error fetching items from ${this._collectionName} collection : ${e}`);
    }
  }

  // Can take one object as parameter, to search for all matching key: value pairs,
  // or can take two parameters, where firs is key name (string) and second is a
  // primitive value
  // TODO Add some checks on find parameters not allowing breaking values
  public async find(query: string | any, value?: any): Promise<T[]> {
    const searchQuery = typeof query === 'object' ? query : {
      [query]: value
    };
    try {
      const items: any[] = await this.findItems(this._collectionName, searchQuery);
      return items.map(this._prototype.clone)
    } catch (e) {
      throw(`Error finding items in ${this._collectionName} collection : ${e}`);
    }
  }

  // TODO Add Prototype clone and strict clone functions.
  // Strict clone should check if object matches expected structure to show
  // warning if not
  public async insert(item: any): Promise<T> {
    try {
      const insertable: T = this._prototype.clone(item);
      const insertedItem: any = this.addItem(this._collectionName, insertable);
      return this._prototype.clone(insertedItem);
    } catch (e) {
      throw(`Error inserting item in ${this._collectionName} collection : ${e}`);
    }
  }

  // Object id is not allowed outside, so parameter is string only
  public async item(_id: string): Promise<T | void> {
    try {
      const item: any | void = this.findItemById(this._collectionName, _id);
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

  // TODO Can be executed faster by skipping the findItemById call after replacement
  // just returning the cloned item, so no need in replaced item coming from
  // replace item by id
  public async replace(_id: string, item: any): Promise<T> {
    try {
      const insertable: T = this._prototype.clone(item);
      const replacedItem: any = await this.replaceItemById(this._collectionName, _id, insertable);
      return this._prototype.clone(replacedItem);
    } catch (e) {
      throw(`Error replacing item in ${this._collectionName} collection : ${e}`);
    }
  }
}
