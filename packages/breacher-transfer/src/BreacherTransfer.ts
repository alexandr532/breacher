/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @transfer 2022-08-12
 */
import http from 'http';
import jwt from 'jsonwebtoken';
import * as io from 'socket.io';
import { cyrb53 } from '../../shared/BreacherUtils';

// TODO Should be moved to shared config.
const BREACHER_SERVER_PORT = 3003;

export class BreacherTransfer {
  // Socket server is not defined if server is not running.
  private _io!: io.Server;

  // Http server to run socket server and web application client.
  private _server!: http.Server;

  public constructor() {
    this._startSocketServer();
  }

  // Adds basic socket listeners to handle connects and disconnects.
  // Any connection is allowed at this point, but further auth call needed,
  // to get access to the other streams.
  // TODO json-web-tokens could be used to maintain existing connection state
  // through client reconnects
  private _addListeners(): void {
    this._io.on('connection', (socket: io.Socket) => {
      socket.on('disconnect', (reason: string) => {
        console.log(`User disconnected because of ${reason}`);
      });
      // TODO refactor this
      socket.on('auth', (auth: string) => {
        let hashId: string;
        let refreshToken: string;
        jwt.verify(auth, 'shhhhh', (err, decoded: any) => {
          if (!err && decoded.data) {
            hashId = decoded.data;
            refreshToken = jwt.sign({
              data: hashId
            }, 'shhhhh', { expiresIn: '2d' });
          } else {
            refreshToken = jwt.sign({
              data: cyrb53(socket.id)
            }, 'shhhhh', { expiresIn: '2d' });
          }
          const token = jwt.sign({
            data: socket.id
          }, 'breacher secret', { expiresIn: '15m' });
          socket.emit('auth', {
            refreshToken, token
          });
        });
      });
    });
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
