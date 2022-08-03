/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-03
 */
import {BreacherAbstraction} from '../../breacher-abstraction';

export type Breach = {
  connect(uri: string, dbName: string): BreacherAbstraction;
  launch(): void;
}