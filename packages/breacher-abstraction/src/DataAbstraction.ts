/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import { IImplementor } from './Implementor';

export abstract class DataAbstraction {
  // Interface abstract methods that should be described for each collection
  // fetch returns an array of objects from collection.
  // Returns empty array if nothing found
  // TODO memory menagement and cursor handling as it can be a lot of items
  public abstract fetch: () => Promise<Object[]>;

  // Finds intems in collection and returns them as Promise of Array.
  // This Array can be empty if nothing found
  // TODO memory management and cursor handling as it can be a lot of items
  public abstract find: (key: string, value: string) => Promise<Object[]>;

  // Inserts item in to coillection, returns a Promise of the item that was inserted
  // item can have an _id field, should check if it is already exists and
  // throw error if so.
  public abstract insert: (item: Object) => Promise<Object>;

  // Finds item by provided _id. Returns Promise of the item that can be resolved
  // with void if no item found
  public abstract item: (_id: string) => Promise<Object | void>;

  // Removes an item by its _id from collection.
  // Resolved with nothing if not error thrown.
  public abstract remove: (_id: string) => Promise<void>;

  // Replaces item in collection by id with a new item, item should be
  // cloned with removing _id, as already existing item can be used as replacer
  // Returns a Promise of the item after replace was finished
  public abstract replace: (id: string, item: Object) => Promise<Object>;

  // Bridge to MongoDb, can be any other database implementor if
  // implements IImplementor interface
  private _implementor: IImplementor = MongodbImplementor.instance();

  // From here all protected functions connecting methods
  // that will be used to describe interface methods from above
  // to current database implementator
  protected addItem(collectionName: string, item: Object): Promise<Object> {
    return this._implementor.addItemImplementation(collectionName, item);
  }

  protected findItems(collectionName: string, searchQuery: string): Promise<Object[]> {
    return this._implementor.findItemsImplementation(collectionName, searchQuery);
  }

  protected findItemById(collectionName: string, id: string): Promise<Object | void> {
    return this._implementor.findItemByIdImplementation(collectionName, id);
  }

  protected getItems(collectionName: string): Promise<Object[]> {
    return this._implementor.getItemsImplementation(collectionName);
  }

  protected removeItemById(collectionName: string, id: string): Promise<void> {
    return this._implementor.removeItemByIdImplementation(collectionName, id);
  }

  protected replaceItemById(collectionName: string, id: string, item: Object): Promise<Object> {
    return this._implementor.replaceItemByIdImplementation(collectionName, id, item);
  }
}
