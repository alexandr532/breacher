/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @abstraction
 */
export interface IImplementor {
  addItemImplementation: (collectionName: string, item: Object) => Promise<Object>;
  findItemsImplementation: (collectionName: string, searchQuery: Object) => Promise<Object[]>;
  findItemByIdImplementation: (collectionName: string, id: string) => Promise<Object | void>;
  getItemsImplementation: (collectionName: string) => Promise<Object[]>;
  removeItemByIdImplementation: (collectionName: string, id: string) => Promise<void>;
  replaceItemByIdImplementation: (collectionName: string, id: string, item: Object) => Promise<Object>;
}
