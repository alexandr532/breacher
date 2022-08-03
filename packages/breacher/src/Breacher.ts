/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-03
 */
import http from 'http';
import io from 'socket.io';
import { BreacherAbstraction } from '../../breacher-abstraction';
import { Breach } from './Breach';

export default class Breacher {
  private static _instance: Breacher;
  private _abstraction: Map<string, Map<string, BreacherAbstraction>> = new Map();
  private _breach: Breach = {
    connect: this._register,
    launch: this._startServer
  };
  private _io!: io.Server;
  private _server!: http.Server;

  protected constructor(noServer: boolean = false) {
    if (noServer) {
      return;
    }
    this._startServer();
  }

  public static breach(uri: string, dbName: string, noServer: boolean = false): Breach {
    if (!Breacher._instance) {
      Breacher._instance = new Breacher(noServer);
    }
    Breacher._instance._breach.connect(uri, dbName);
    return Breacher._instance._breach;
  }

  private _addListeners(): void {
    this._io.on('connection', (socket: io.Socket) => {
      console.log('User connected');
      socket.on('disconnect', (reason: string) => {
        console.log(`User disconnected beacause of ${reason}`);
      });
      socket.on('auth', (msg: string) => {
        console.log(`User requests auth: `, msg);
      });
    });
  }

  private _startServer(): void {
    if (this._server) {
      return;
    }
    this._startSocketServer();
    this._addListeners();
  }

  private _startSocketServer(): void {
    this._server = http.createServer();
    this._io = new io.Server(this._server);
    this._server.listen(3003, () => {
      console.log('Server is running');
    });
  }

  private _register(uri: string, dbName: string): BreacherAbstraction {
    const fromUri: Map<string, BreacherAbstraction> | undefined = this._abstraction.get(uri);
    if (fromUri != null) {
      const fromDb: BreacherAbstraction | undefined = fromUri.get(dbName);
      if (fromDb != null) {
        return fromDb;
      }
      const abstraction = new BreacherAbstraction(uri, dbName);
      fromUri.set(dbName, abstraction);
      return abstraction;
    }
    const abstraction = new BreacherAbstraction(uri, dbName);
    this._abstraction.set(uri, new Map([[dbName, abstraction]]));
    return abstraction
  }
}
