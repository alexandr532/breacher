/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @transfer 2022-08-14
 */
import jwt from 'jsonwebtoken';
import { cyrb53 } from '../../shared/BreacherUtils';

export class Auth {
  private _tokens: Map<string, string> = new Map<string, string>();

  public token(forId: string, isHashed: boolean = false): string {
    const hashId: string = isHashed ? forId : cyrb53(forId);
    const token: string = jwt.sign(hashId, 'shhhhh', { expiresIn: '1d' });
    this._tokens.set(hashId, token);
    return token;
  }
  
  public async verify(token: string): Promise<string> {
    return new Promise<string>((
      resolve: (value: string | PromiseLike<string>) => void,
      reject: (reason?: any) => void
    ): void => {
      jwt.verify(token, 'shhhhh', (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ): void => {
        if (err !== null) {
          reject(`Token validation error : ${err}`);
        }
        const hashId: string | undefined = typeof decoded === 'string' ? decoded : undefined;
        if (!hashId) {
          reject('Token validation error : Corrupted Token');
        }
        if (this._tokens.get(hashId as string) !== token) {
          reject('Security violation : Unknown Token Origin');
        }
        resolve(hashId as string);
      });
    });
  }
  
  public async revoke(token: string): Promise<string> {
    const hashId: string = await this.verify(token);
    const isHashed: boolean = true;
    const newToken: string = this.token(hashId, isHashed);
    this._tokens.set(hashId, newToken);
    return newToken;
  }
}
