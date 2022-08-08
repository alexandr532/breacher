/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-03
 */
import http from 'http';
import * as io from 'socket.io';
import { BreacherAbstraction } from '../../breacher-abstraction';

export class Breacher {
  // Stores the only one allowed instance of Breacher.
  private static _instance: Breacher;

  // Used by _register function to ensure only unique interfaces created.
  // Maps uri strings to the Map of database names to corresponding interface.
  private _abstraction: Map<string, Map<string, BreacherAbstraction>> = new Map();
  
  // Socket server is not defined if server is not running.
  private _io!: io.Server;

  // Http server to run socket server and web application client.
  private _server!: http.Server;

  // It is not allowed to create Breacher instance using "new" keyword.
  // Should use statics breach or server depending on user needs.
  protected constructor() {}

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
    // Start server if not already started
    if (!this._instance._server) {
      this._instance._startSocketServer();
      this._instance._addListeners();
    }
  }

  // Adds socket listeners
  // TODO Should be described in separate file
  private _addListeners(): void {
    this._io.on('connection', (socket: io.Socket) => {
      socket.on('disconnect', (reason: string) => {
        console.log(`User disconnected because of ${reason}`);
      });
      socket.on('auth', (msg: string) => {
        console.log(`User requests auth: `, msg);
      });
    });
  }

  /**
   * Creates new BreacherAbstraction or return exiting if already created.
   *
   * @param uri MongoDb connection string.
   * @param dbName MongoDb database name.
   * @returns Breacher Abstraction database interface.
   */
  private _register = (uri: string, dbName: string): BreacherAbstraction => {
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

  // Creates http server
  // TODO Should not use hardcoded port number.
  private _startSocketServer(): void {
    this._server = http.createServer({}, function (req, res) {
      res.writeHead(200, { 'Access-Control-Allow-Origin': 'http://localhost:3000'});
    });
    this._io = new io.Server(this._server);
    this._server.listen(3003, () => {
      console.log('Server is running');
    });
  }
}
