/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction 2022-08-03
 */
import Abstraction from './Abstraction';
import { BreacherDBConfig } from '../../shared/BreacherTypes';

const DEFAULT_CONFIG = {
  host: 'localhost',
  name: 'database1',
  port: 12750
}

export class BreacherAbstraction {
  // _abstraction is database facade providing access to each collection
  // methods. It will be not defined if abstraction is not running.
  private _abstraction: Abstraction | undefined;

  public constructor(config?: BreacherDBConfig) {
    if (config) {
      this.start(config);
    }
  }

  // starts abstraction for database described in config
  // not allows to start if already starting or running
  public async start(config?: BreacherDBConfig): Promise<void> {
    if (this._abstraction != null) {
      throw(`Abstraction:start process is not finished yet!`);
    }
    config = config ? config : DEFAULT_CONFIG;
    return this._createAbstraction(config);
  }

  // Stops running abstraction, can be used to clean instance so it can be
  // started again with another or the same configuration with no creation of
  // a new BreacherAbstraction instance
  public async stop(): Promise<void> {
    if (this._abstraction == null) {
      throw(`Abstraction:stop is not possible. Nothing running`);
    }
    if (this._abstraction) {
      return this._abstraction.stopDb();
    }
  }

  // Creates abstraction instance this will be used to access collection
  // methods
  private async _createAbstraction(config: BreacherDBConfig): Promise<void> {
    this._abstraction = new Abstraction();
    await this._abstraction.startDb(config);
  }
}
