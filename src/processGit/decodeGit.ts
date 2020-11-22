import * as zlib from "zlib";

const inflateZlib = (zlibEncoded: Buffer): Buffer =>
  zlib.inflateSync(zlibEncoded);

const unpackHash = (packedHash: number[]): string => {
  const hashTempBuf = [];
  for (const byte of packedHash) {
    // Convert packed hex to character codes for letters
    const secondCharCode = byte % 16;
    const firstCharCode = (byte - secondCharCode) / 16;
    // Need to correct for character code
    hashTempBuf.push(
      firstCharCode < 10 ? firstCharCode + 48 : firstCharCode - 10 + 97
    );
    hashTempBuf.push(
      secondCharCode < 10 ? secondCharCode + 48 : secondCharCode - 10 + 97
    );
  }
  return String.fromCharCode(...hashTempBuf);
};

export { inflateZlib, unpackHash };
