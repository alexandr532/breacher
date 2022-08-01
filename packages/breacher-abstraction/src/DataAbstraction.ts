/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import { IImplementor } from './Implementor';

export default abstract class DataAbstraction {
  // Interface abstract methods that should be described for each collection
  // fetch returns an array of objects from collection.
  // Returns empty array if nothing found
  // TODO memory menagement and cursor handling as it can be a lot of items
  public abstract fetch(): Promise<Object[]>;

  // Finds intems in collection and returns them as Promise of Array.
  // This Array can be empty if nothing found
  // Can be used with searchQuery object or key: value pair
  // TODO memory management and cursor handling as it can be a lot of items
  // TODO Create Primitive type for value
  public abstract find(query: string | Object, value?: any): Promise<Object[]>;

  // Inserts item in to coillection, returns a Promise of the item that was inserted
  // item can have an _id field, should check if it is already exists and
  // throw error if so.
  public abstract insert(item: Object): Promise<Object>;

  // Finds item by provided _id. Returns Promise of the item that can be resolved
  // with void if no item found
  public abstract item(_id: string): Promise<Object | void>;

  // Removes an item by its _id from collection.
  // Resolved with nothing if not error thrown.
  public abstract remove(_id: string): Promise<void>;

  // Replaces item in collection by id with a new item, item should be
  // cloned with removing _id, as already existing item can be used as replacer
  // Returns a Promise of the item after replace was finished
  public abstract replace(_id: string, item: Object): Promise<Object>;

  // Bridge to MongoDb, can be any other database implementor if
  // implements IImplementor interface
  private _implementor: IImplementor = MongodbImplementor.instance();

  // From here all protected functions connecting methods
  // that will be used to describe interface methods from above
  // to current database implementator
  protected addItem(collectionName: string, item: Object): Promise<Object> {
    return this._implementor.addItemImplementation(collectionName, item);
  }

  protected findItems(collectionName: string, searchQuery: Object): Promise<Object[]> {
    return this._implementor.findItemsImplementation(collectionName, searchQuery);
  }

  // Do not be confused with _id parameter name, it is not objectId as mongodb
  // uses, objectId is not allowed here, it is used in mongodb implementor only.
  // underscore before the name means that this parameter is database _id not
  // to mix it with user provided id inside one item.
  protected findItemById(collectionName: string, _id: string): Promise<Object | void> {
    return this._implementor.findItemByIdImplementation(collectionName, _id);
  }

  protected getItems(collectionName: string): Promise<Object[]> {
    return this._implementor.getItemsImplementation(collectionName);
  }

  protected removeItemById(collectionName: string, _id: string): Promise<void> {
    return this._implementor.removeItemByIdImplementation(collectionName, _id);
  }

  protected replaceItemById(collectionName: string, _id: string, item: Object): Promise<Object> {
    return this._implementor.replaceItemByIdImplementation(collectionName, _id, item);
  }
}