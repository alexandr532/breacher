/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
import Abstraction from './Abstraction';
import { BreacherDBConfig } from '../../shared/BreacherTypes';

export class BreacherAbstraction {
  // _abstraction is database facade providing access to each collection
  // methods. It will be not defined if abstraction is not running.
  private _abstraction: Abstraction | undefined;

  // _config saves configuration with which abstraction was started
  // it will be not defined if abstraction is not starting or running
  private _config: BreacherDBConfig | undefined;

  public constructor(config?: BreacherDBConfig) {
    if (config) {
      this.start(config);
    }
  }

  // starts abstraction for database described in config
  // not allows to start if already starting or running
  public async start(config: BreacherDBConfig): Promise<void> {
    if (this._config) {
      throw(`Abstraction:start process is not finished yet!`);
    }
    this._config = config;
    return this._createAbstraction(config);
  }

  // Stops running abstraction, can be used to clean instance so it can be
  // started again with another or the same configuration with no creation of
  // a new BreacherAbstraction instance
  public async stop(): Promise<void> {
    if (!this._abstraction && !this._config) {
      throw(`Abstraction:stop is not possible. Nothing running`);
    }
    if (this._config) {
      return this._terminateStart();
    }
  }

  // Creates abstraction instance this will be used to access collection
  // methods
  private async _createAbstraction(config: BreacherDBConfig): Promise<void> {
    this._abstraction = new Abstraction();
    await this._abstraction.startDB(config);
  }

  // Should be used to stop abstraction that is not running yet.
  // Could be retrying to connect or in awaiting of database
  private async _terminateStart(): Promise<void> {

  }
}
