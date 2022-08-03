/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction 2022-08-03
 */
import AbstractionFactory from './AbstractionFactory';
import MongoDbImplementor from './MongoDbImplementor';

export default class Abstraction {
  private _implementor: MongoDbImplementor | undefined;
  private _register: Map<string, AbstractionFactory<any>> = new Map();

  //Starts Database
  public startDb(uri: string, dbName: string, options?: any): Promise<void> {
    this._implementor = new MongoDbImplementor(uri, dbName, options);
    return this._implementor.start();
  }

  public stopDb(): Promise<void> {
    if (!this._implementor) {
      return new Promise(function(resolve) { resolve(); });
    }
    return this._implementor.stop();
  }

  public register(collectionName: string): AbstractionFactory<any> {
    if (this._implementor == null) {
      throw("Abstraction: cant register collection, database is not running.")
    }
    let abstraction = this._register.get(collectionName);
    if (abstraction != null) {
      return abstraction;
    }
    abstraction = new AbstractionFactory<any>(this._implementor, collectionName);
    this._register.set(collectionName, abstraction);
    return abstraction;
  }
}
