/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction 2022-08-03
 */
import Abstraction from './Abstraction';
import DataAbstraction from './DataAbstraction';

export class BreacherAbstraction {
  // _abstraction is database facade providing access to each collection
  // methods. It will be not defined if abstraction is not running.
  private _abstraction: Abstraction | undefined;

  public constructor(uri?: string, dbName?: string, options?: any) {
    if (uri && dbName) {
      this.start(uri, dbName, options);
    }
  }

  // starts abstraction for database described in config
  // not allows to start if already starting or running
  public start(uri: string, dbName: string, options: any): Promise<void> {
    if (this._abstraction != null) {
      throw(`Abstraction:start process is not finished yet!`);
    }
    this._abstraction = new Abstraction();
    return this._abstraction.startDb(uri, dbName, options);
  }

  // Stops running abstraction, can be used to clean instance so it can be
  // started again with another or the same configuration with no creation of
  // a new BreacherAbstraction instance
  public stop(): Promise<void> {
    if (this._abstraction == null) {
      throw(`Abstraction:stop is not possible. Nothing running`);
    }
    return this._abstraction.stopDb();
  }

  // Returns DataAbstraction interface to access specific collection
  public breache(collectionName: string): DataAbstraction {
    if (!this._abstraction) {
      throw(`Abstraction:breach is not possible, Nothing running`);
    }
    return this._abstraction.register(collectionName);
  }
}
