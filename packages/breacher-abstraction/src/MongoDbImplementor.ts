/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction 2022-08-02
 */
import * as mongodb from 'mongodb';
import {IImplementor} from "./Implementor";

export default class MongoDbImplementor implements IImplementor {
  private _client: Promise<mongodb.MongoClient>;
  private _db: mongodb.Db | undefined;

  public constructor(
    private _uri: string,
    private _dbName: string,
    private _options?: mongodb.MongoClientOptions
  ) {
    const client = new mongodb.MongoClient(this._uri, this._options);
    this._client = client.connect();
  }

  public async addItemImplementation(collectionName: string, item: any): Promise<any> {
    const collection = await this._getCollection(collectionName);
    const result: mongodb.InsertOneResult = await collection.insertOne(item);
    item._id = result.insertedId;
    return item;
  }
  
  public async findItemsImplementation(collectionName: string, searchQuery: any): Promise<any[]> {
    if (searchQuery.hasOwnProperty('_id')) {
      const item = this.findItemByIdImplementation(collectionName, searchQuery._id);
      return [item];
    }
    const collection: mongodb.Collection = await this._getCollection(collectionName);
    const cursor: mongodb.FindCursor = collection.find(searchQuery);
    return cursor.toArray();
  }
  
  public async findItemByIdImplementation(collectionName: string, id: string): Promise<any> {
    const collection: mongodb.Collection = await this._getCollection(collectionName);
    return collection.findOne({_id: new mongodb.ObjectId(id)});
  }

  public async getCollectionsImplementation(): Promise<string[]> {
    const db: mongodb.Db = await this._getDb();
    const cursor: mongodb.ListCollectionsCursor = db.listCollections({nameOnly: true});
    return (await cursor.toArray()).map((value) => {
        return value.toString();
    });
  }
  
  public async getItemsImplementation(collectionName: string): Promise<any[]> {
    const collection: mongodb.Collection = await this._getCollection(collectionName);
    const cursor: mongodb.FindCursor = collection.find();
    return cursor.toArray();
  }
  
  public async removeItemByIdImplementation(collectionName: string, id: string): Promise<void> {
    const collection: mongodb.Collection = await this._getCollection(collectionName);
    await collection.findOneAndDelete({_id: new mongodb.ObjectId(id)});
  }
  
  public async replaceItemByIdImplementation(collectionName: string, id: string, item: any): Promise<any> {
    const collection: mongodb.Collection = await this._getCollection(collectionName);
    const result: mongodb.ModifyResult = await collection.findOneAndReplace({_id: new mongodb.ObjectId(id)}, item);
    return result.value;
  }

  // Async start to use _getDb function with not giving Db instance back
  // If _db is already started will be instantly resolved
  public async start(): Promise<void> {
    await this._getDb();
  }

  // TODO check if there a way to stop client before it is connected
  public async stop(): Promise<void> {
    return await (await this._client).close();
  }

  private async _getCollection(collectionName: string): Promise<mongodb.Collection> {
    const db: mongodb.Db = await this._getDb();
    return db.collection(collectionName);
  }

  private async _getDb(): Promise<mongodb.Db> {
    // If already connected the _client promise will be already resolved
    // If the process of connect is not finished yet, the _client promise
    // is already exists and we can await on it here
    const client: mongodb.MongoClient = await this._client;
    // Reusing same _db connection
    if (this._db == null) {
      this._db = client.db(this._dbName);
    }
    return this._db;
  }
}
