/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import * as mongodb from 'mongodb';
import {BreacherDBConfig} from '../../shared/BreacherTypes';
import {IImplementor} from "./Implementor";

export default class MongoDbImplementor implements IImplementor {
  private _client: mongodb.MongoClient;

  public constructor(
    private _uri: string,
    private _options: mongodb.MongoClientOptions
  ) {
    this._client = new mongodb.MongoClient(this._uri, this._options);
  }

  public addItemImplementation(collectionName: string, item: any): Promise<any> {
    
  }
  
  public findItemsImplementation(collectionName: string, searchQuery: any): Promise<any[]> {
    
  }
  
  public findItemByIdImplementation(collectionName: string, id: string): Promise<any> {
    
  }
  
  public getItemsImplementation(collectionName: string): Promise<any[]> {
    
  }
  
  public removeItemByIdImplementation(collectionName: string, id: string): Promise<void> {
    
  }
  
  public replaceItemByIdImplementation(collectionName: string, id: string, item: any): Promise<any> {
    
  }

  private async _getCollection(collectionName: string): Promise<mongodb.Collection> {
    const db: mongodb.Db = await this._getDb();
    return db.collection(collectionName);
  }

  private async _getDb(): Promise<mongodb.Db> {
  
  }
}
