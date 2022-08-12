/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-03
 */
import { BreacherAbstraction } from '../../breacher-abstraction';
import { BreacherTransfer } from '../../breacher-transfer';
import { Breach } from './Breach';
import { cyrb53 } from '../../shared/BreacherUtils';

export class Breacher {
  // Stores the only one allowed instance of Breacher.
  private static _instance: Breacher;

  // Used by _register function to ensure only unique interfaces created.
  // Using cyrb53 hash to encode uri and database name and map it to corresponding
  // BreacherAbstraction
  private _abstraction: Map<string, BreacherAbstraction> = new Map();

  private _breach: Map<BreacherAbstraction, Breach> = new Map();
  
  private _transfer: BreacherTransfer | undefined;

  // It is not allowed to create Breacher instance using "new" keyword.
  // Should use statics breach or server depending on user needs.
  protected constructor() {
  }

  /**
   * Starts breach in service mode with no web application running.
   * 
   * @param uri MongoDb connection string.
   * @param dbName MongoDb database name.
   * @returns Breacher Abstraction database interface.
   */
  public static breach(uri: string, dbName: string): BreacherAbstraction {
    if (!Breacher._instance) {
      Breacher._instance = new Breacher();
    }
    return Breacher._instance._register(uri, dbName);
  }

  /**
  *  Starts breacher server as standalone web application with no connection
  *  to database. User will not be connected to already existing services.
  *  But he can reuse exiting connections by providing same uri and database
  *  name in create connection dialog using breacher web application.
  */
  public static server(): void {
    if (!Breacher._instance) {
      Breacher._instance = new Breacher();
    }
    // Start server by creating transfer layer instance if not already running
    if (!this._instance._transfer) {
      this._instance._transfer = new BreacherTransfer();
    }
  }

  /**
   * Creates new BreacherAbstraction or return exiting if already created.
   *
   * @param uri MongoDb connection string.
   * @param dbName MongoDb database name.
   * @returns Breacher Abstraction database interface.
   */
  private _register = (uri: string, dbName: string): BreacherAbstraction => {
    const hash: string = cyrb53(`${dbName}@${uri}`);
    // TODO uri parser for Standalone, Replica set, Shared cluster and Atlas deploument
    // Each option can have auth or not. as well as AuthSource db with options
    // Special characters in passwords such as ':', '/', '?', '#', '[', ']' and '@'
    // must be converted using percent encoding
    // See: https://www.mongodb.com/docs/manual/reference/connection-string/
    // Before this, hashString is not so safe to use as uri can be different while
    // Before this, hashString is not so safe to use as uri can be different while
    let abstraction: BreacherAbstraction | undefined = this._abstraction.get(hash);
    if (abstraction != null) {
        return abstraction;
    }
    // Creates abstraction interface to access and manipulate collection data.
    // Abstraction created as new instance for each unique database, but bound
    // to use same implementor that is singleton, shared between abstractions
    abstraction = new BreacherAbstraction(uri, dbName);
    this._abstraction.set(hash, abstraction);
    // Creates collection management __breache__ collection
    // As well as providing interface methods for it
    this._breach.set(abstraction, new Breach(abstraction));
    return abstraction;
  }

}
