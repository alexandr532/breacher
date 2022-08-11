/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-10
 */
import DataAbstraction from '../../breacher-abstraction/src/DataAbstraction';
import { BreacherAbstraction } from '../../breacher-abstraction';

const NULL_PROTOTYPE = {
  _id: null,
  name: null,
  existing: null,
  prototype: null
}
const BREACH = {
  name: '__breach__',
  existing: true,
  prototype: NULL_PROTOTYPE
}

type BreachInfo = {
  _id?: string,
  name: string,
  existing: boolean,
  prototype: object
}

export class Breach {
  private _breach: Promise<DataAbstraction>;

  constructor(
    private _abstraction: BreacherAbstraction
  ) {
    this._breach = this._init();
  }

  public async register(collectionName: string): Promise<DataAbstraction> {
    const breache: DataAbstraction = await this._breach;
    const info: BreachInfo | undefined = (await breache.find('name', collectionName))[0];
    const collections: string[] = await breache.collections();
    const existing: boolean = collections.indexOf(collectionName) !== -1;
    if (info == null) {
      await breache.insert({
        name: collectionName,
        existing,
        prototype: NULL_PROTOTYPE
      });
    } else if (info._id && info.existing !== existing) {
      info.existing = existing;
      await breache.replace(info._id, info);
    }
    return this._abstraction.for(collectionName);
  }
  
  private async _init(): Promise<DataAbstraction> {
    const breach: DataAbstraction = this._abstraction.for('__breach__');
    const collections = await breach.collections();
    if (collections.length > 0 && collections.indexOf('__breach__') !== -1) {
      await breach.insert(BREACH);
    }
    return breach;
  }
}
