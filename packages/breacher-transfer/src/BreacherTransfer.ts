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
import { Connections } from './Connections';

// TODO Should be moved to shared config.
const BREACHER_SERVER_PORT = 3003;

export type BreacherTransferEvent = 'connection' | 'request';

export class BreacherTransfer {
  private _auth: Auth;

  private _connetions: Connections;

  // Socket server is not defined if server is not running.
  private _io!: io.Server;

  // Http server to run socket server and web application client.
  private _server!: http.Server;

  // Used by event-subscriber to store subscriptions mapped to event name
  private _subjects: Map<BreacherTransferEvent, Set<Function>> = new Map();

  public constructor() {
    this._auth = new Auth();
    this._startSocketServer();
    this._connetions = new Connections(this._io);
  }

  // TODO JSDoc here
  public subscribe(event: BreacherTransferEvent, subscription: Function): () => void {
    if (subscription == null) {
      throw('BreacherTransfer: Cant subscribe with nothing');
    }
    if (event !== 'connection' && event !== 'request') {
      throw(`BreacherTransfer: Cant subscribe to not existing event ${event}`);
    }
    let subject: Set<Function> | undefined = this._subjects.get(event);
    if (!subject) {
      subject = new Set<Function>();
      this._subjects.set(event, subject);
    }
    subject.add(subscription);
    return this._unsubscribe(event, subscription);
  }

  // Adds basic socket listeners to handle connects and disconnects.
  // Any connection is allowed at this point, but further auth call needed,
  // to get access to the other streams.
  private _addListeners(): void {
    this._io.on('connection', this._handleConnection)
  }
  
  private _addProtectedListeners(socket: io.Socket): void {
    // TODO add listeners to request data
  }

  private _handleConnection = (socket: io.Socket): void => {
    socket.on('disconnect', this._handleDisconnect);

    socket.on('auth', async (token?: string): Promise<void> => {
      console.log('Auth requested by socket', socket.id);
      // Revoke token is set here if new auth requested
      let revokeToken: string | undefined = token == null ? this._auth.token(socket.id) : undefined;
      // Token as newly created revoke token, or the one that we got from client
      token = token == null ? revokeToken : token;
      let connectionId: string;
      try {
        // If token is valid will wait for connection id and catch will not happen
        connectionId = await this._auth.verify(token!);
        // Revoke token will be updated if not just created for new auth
        revokeToken = revokeToken == null ? await this._auth.revoke(token!) : revokeToken;
      } catch (e) {
        // Provided token is invalid
        socket.emit('auth-error', e);
        // Creates new token and saves it as revoke token
        revokeToken = this._auth.token(socket.id);
        // This can not fail as just created token is always valid
        connectionId = await this._auth.verify(revokeToken);
      } finally {
        // At this point connection id, revoke token and socket are always defined
        this._connetions.register(connectionId!, socket);
        this._addProtectedListeners(socket);
        this._notify('connection', connectionId!);
        socket.emit('token', revokeToken);
      }
    });
  }

  private _handleDisconnect = (reason: string): void => {
    console.log(`User disconnected because of ${reason}`);
  }

  private _notify(event: BreacherTransferEvent, ...args: any[]): void {
    const subject = this._subjects.get(event);
    if (!subject) {
      return;
    }
    subject.forEach((subscription: Function) => {
      subscription(...args);
    })
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

  private _unsubscribe(event: BreacherTransferEvent, subscription: Function) {
    return () => {
      const subject: Set<Function> | undefined = this._subjects.get(event);
      if (subject == null) {
        return;
      }
      subject.delete(subscription);
    }
  }
}
