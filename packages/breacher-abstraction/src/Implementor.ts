/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
export interface IImplementor {
  addItemImplementation(collectionName: string, item: any): Promise<any>;
  findItemsImplementation(collectionName: string, searchQuery: any): Promise<any[]>;
  findItemByIdImplementation(collectionName: string, id: string): Promise<any | void>;
  getCollectionsImplementation(): Promise<string[]>
  getItemsImplementation(collectionName: string): Promise<any[]>;
  removeItemByIdImplementation(collectionName: string, id: string): Promise<void>;
  replaceItemByIdImplementation(collectionName: string, id: string, item: any): Promise<any>;
  start(): Promise<void>;
  stop(): Promise<void>;
}
