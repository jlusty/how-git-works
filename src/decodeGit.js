import * as zlib from "zlib";

const inflateZlib = (zlibEncoded) =>
  zlib.inflateSync(Buffer.from(zlibEncoded, "base64"));

const parseGitTree = (treeBuffer) => {
  const splitArr = [];
  let tempBuf = [];
  let zeroByteCount = 0;
  const bytes = treeBuffer.values();

  let nextChar = bytes.next();
  while (!nextChar.done) {
    const value = nextChar.value;
    if (value !== 0) {
      tempBuf.push(value);
    } else {
      zeroByteCount++;
      tempBuf.push(9); // tab
      if (zeroByteCount > 1) {
        for (let i = 0; i < 20; i++) {
          const packedNum = bytes.next().value;
          // Convert packed hex to character codes for letters
          const secondCharCode = packedNum % 16;
          const firstCharCode = (packedNum - secondCharCode) / 16;
          // Need to correct for character code
          tempBuf.push(
            firstCharCode < 10 ? firstCharCode + 48 : firstCharCode - 10 + 97
          );
          tempBuf.push(
            secondCharCode < 10 ? secondCharCode + 48 : secondCharCode - 10 + 97
          );
        }
      }
      console.log(tempBuf);
      splitArr.push(String.fromCharCode(...tempBuf));
      tempBuf = [];
    }
    nextChar = bytes.next();
  }
  splitArr.push(String.fromCharCode(...tempBuf));
  tempBuf = [];

  const toReturn = splitArr.join("\n");
  return toReturn;
};

export { inflateZlib, parseGitTree };
