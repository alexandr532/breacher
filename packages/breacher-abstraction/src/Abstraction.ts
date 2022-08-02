/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import { BreacherDBConfig } from '../../shared/BreacherTypes';
import AbstractionFactory from './AbstractionFactory';
import MongoDbImplementor from './MongoDbImplementor';
export default class Abstraction {
  private _implementor: MongoDbImplementor | undefined;

  //Starts Database
  public async startDB(config: BreacherDBConfig, dbName: string, options?: any) {
    const uri = !config.user ?
      `mongodb://${config.host}:${config.port}` :
      `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}`;
    this._implementor = new MongoDbImplementor(uri, dbName, options);
  }
}

