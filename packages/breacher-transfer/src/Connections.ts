/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @transfer 2022-08-12
 */
import { Socket, Server} from 'socket.io';

export class Connections {
  private _sockets: Map<string, Socket> = new Map();

  private _rooms: Map<string, Set<string>> = new Map();

  public constructor(private _io: Server) {}

  public register(authId: string, socket: Socket): Socket {
    if (!this._sockets.has(authId)) {
      console.log('Creating new connection for', authId);
      this._sockets.set(authId, socket);
      this._rooms.set(authId, new Set<string>())
      return socket;
    }
    if (this._sockets.get(authId)!.id !== socket.id) {
      console.log('Reusing existing connection for', authId);
      this._sockets.set(authId, socket);
      socket.join(Array.from(this._rooms.get(authId)!));
    }
    return socket;
  }

  public emit(room: string, ev: string, ...args: any[]): void {
    this._io.to(room).emit(ev, ...args);
  }
  
  public tell(authId: string, ev: string, ...args: any[]): void {
    const socket = this._sockets.get(authId);
    if (!socket || !socket.connected) {
      return;
    }
    socket.emit(ev, ...args);
  } 

  public subscribe(authId: string, room: string): void {
    this._rooms.get(authId)?.add(room);
    this._sockets.get(authId)?.join(room);
  }

  public unsubscribe(authId: string, room: string): void {
    this._rooms.get(authId)?.delete(room);
    this._sockets.get(authId)?.leave(room);
  }
}
