import * as zlib from "zlib";

const inflateZlib = (zlibEncoded: Buffer): Buffer =>
  zlib.inflateSync(zlibEncoded);

export { inflateZlib };
