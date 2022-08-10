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
  name: '__breache__',
  existing: true,
  prototype: NULL_PROTOTYPE
}


type BreacheCollection = {
  _id?: string,
  name: string,
  existing: boolean,
  prototype: object
}

export class Breache {
  private _breache: Promise<DataAbstraction>;

  constructor(
    private _abstraction: BreacherAbstraction
  ) {
    this._breache = this._init();
  }

  public async register(collectionName: string): Promise<DataAbstraction> {
    const breache: DataAbstraction = await this._breache;
    const brick: BreacheCollection[] = await breache.find('name', collectionName);
    const collections: string[] = await breache.collections();
    const existing: boolean = collections.indexOf(collectionName) !== -1;
    if (!brick.length) {
      await breache.insert({
        name: collectionName,
        existing,
        prototype: NULL_PROTOTYPE
      });
    } else if (brick[0]._id && brick[0].existing !== existing) {
      brick[0].existing = existing;
      await breache.replace(brick[0]._id, brick[0]);
    }
    return this._abstraction.breache(collectionName);
  }
  
  private async _init(): Promise<DataAbstraction> {
    const breache: DataAbstraction = this._abstraction.breache('__breache__');
    const collections = await breache.collections();
    if (collections.length > 0 && collections.indexOf('__breache__') !== -1) {
      await breache.insert(BREACH);
    }
    return breache;
  }
}
