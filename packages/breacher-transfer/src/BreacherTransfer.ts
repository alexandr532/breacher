/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @transfer 2022-08-12
 */
import http from 'http';
import * as io from 'socket.io';
import { Auth } from './Auth';

// TODO Should be moved to shared config.
const BREACHER_SERVER_PORT = 3003;

export class BreacherTransfer {
  private _auth: Auth;
  // Socket server is not defined if server is not running.
  private _io!: io.Server;

  // Http server to run socket server and web application client.
  private _server!: http.Server;

  public constructor() {
    this._auth = new Auth();
    this._startSocketServer();
  }

  // Adds basic socket listeners to handle connects and disconnects.
  // Any connection is allowed at this point, but further auth call needed,
  // to get access to the other streams.
  private _addListeners(): void {
    this._io.on('connection', this._handleConnection)
  }
  
  private _addMoreListeners(socket: io.Socket): void {
    // TODO add listeners to request data
  }

  private _handleConnection = (socket: io.Socket): void => {
    socket.on('disconnect', this._handleDisconnect);
    socket.on('auth', async (token: string): Promise<void> => {
      // TODO create new connection if token is not provided
      try {
        const hashId: string = await this._auth.verify(token);
        const revoke: string = await this._auth.revoke(token);
        // TODO Connection revoke for hashId with new socket
        this._addMoreListeners(socket);
        socket.emit('token', revoke);
      } catch (e) {
        socket.emit('auth-error', e);
        // TODO create new connection
      }
    });
  }
  
  private _handleDisconnect = (reason: string): void => {
    console.log(`User disconnected because of ${reason}`);
  }

  // Creates http server
  private _startSocketServer(): void {
    this._server = http.createServer();
    this._io = new io.Server(this._server, {
      cors: {
        origin: '*'
      }
    });
    this._server.listen(BREACHER_SERVER_PORT, () => {
      console.log('Server is running');
      this._addListeners();
    });
  }
}
