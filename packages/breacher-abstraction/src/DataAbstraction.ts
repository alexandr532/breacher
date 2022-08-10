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
  
  // Returns an array of collection names
  public abstract collections(): Promise<string[]>

  // fetch returns an array of objects from collection.
  // Returns empty array if nothing found
  // TODO memory management and cursor handling as it can be a lot of items
  public abstract fetch(): Promise<any[]>;

  // Finds items in collection and returns them as Promise of Array.
  // This Array can be empty if nothing found
  // Can be used with searchQuery object or key: value pair
  // TODO memory management and cursor handling as it can be a lot of items
  // TODO Create Primitive type for value
  public abstract find(query: string | any, value?: any): Promise<any[]>;

  // Inserts item in to collection, returns a Promise of the item that was inserted
  // item can have an _id field, should check if it is already exists and
  // throw error if so.
  public abstract insert(item: any): Promise<any>;

  // Finds item by provided _id. Returns Promise of the item that can be resolved
  // with void if no item found
  public abstract item(_id: string): Promise<any | void>;

  // Removes an item by its _id from collection.
  // Resolved with nothing if not error thrown.
  public abstract remove(_id: string): Promise<void>;

  // Replaces item in collection by id with a new item, item should be
  // cloned with removing _id, as already existing item can be used as replace
  // Returns a Promise of the item after replace was finished
  public abstract replace(_id: string, item: any): Promise<any>;

  // Bridge to MongoDb, can be any other database implementor if
  // implements IImplementor interface
  protected abstract implementor: IImplementor;

  // From here all protected functions connecting methods
  // that will be used to describe interface methods from above
  // to current database implementor
  protected addItem(collectionName: string, item: any): Promise<any> {
    return this.implementor.addItemImplementation(collectionName, item);
  }

  protected findItems(collectionName: string, searchQuery: any): Promise<any[]> {
    return this.implementor.findItemsImplementation(collectionName, searchQuery);
  }

  // Do not be confused with _id parameter name, it is not ObjectId as MongoDb
  // uses, ObjectId is not allowed here, it is used in MongoDb implementor only.
  // underscore before the name means that this parameter is database _id not
  // to mix it with user provided id inside one item.
  protected findItemById(collectionName: string, _id: string): Promise<any | void> {
    return this.implementor.findItemByIdImplementation(collectionName, _id);
  }

  protected getCollections(): Promise<string[]> {
    return this.implementor.getCollectionsImplementation();
  }

  protected getItems(collectionName: string): Promise<any[]> {
    return this.implementor.getItemsImplementation(collectionName);
  }

  protected removeItemById(collectionName: string, _id: string): Promise<void> {
    return this.implementor.removeItemByIdImplementation(collectionName, _id);
  }

  protected replaceItemById(collectionName: string, _id: string, item: any): Promise<any> {
    return this.implementor.replaceItemByIdImplementation(collectionName, _id, item);
  }
}
