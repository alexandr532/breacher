/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @breacher 2022-08-11
 */

/**
 * cyrb53 (c) 2018 bryc (github.com/bryc)
 * A fast and simple hash function with decent collision resistance.
 * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
 * Public domain. Attribution appreciated.
 */
export function cyrb53(str: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
}
// String.hashCode taken from Java dates back to 1981 from Gosling Emacs is
// extremely weak, and makes zero sense performance-wise in modern JavaScript.
// Implementations could be significantly faster by using ES6 Math.imul.
//
// A simple but high quality 53-bit hash. It's quite fast, provides good hash
// description, and because it outputs 53 bits, has significantly lower collision
// rates compared to any 32-bit hash.
//
// "501c2ba782c97901" = cyrb53("a")
// "459eda5bc254d2bf" = cyrb53("b")
// "fbce64cc3b748385" = cyrb53("revenge")
// "fb1d85148d13f93a" = cyrb53("revenue")
//
// "76fee5e6598ccd5c" = cyrb53("revenue", 1)
// "1f672e2831253862" = cyrb53("revenue", 2)
// "2b10de31708e6ab7" = cyrb53("revenue", 3)
