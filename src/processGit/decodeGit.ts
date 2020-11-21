import * as zlib from "zlib";

const inflateZlib = (zlibEncoded: Buffer): Buffer =>
  zlib.inflateSync(zlibEncoded);

export interface GitTree {
  name: string;
  length: string;
  files: Entry[];
}

interface Entry {
  type: string;
  name: string;
  hash: string;
}

const parseGitTree = (treeBuffer: Buffer): GitTree => {
  const bytes = treeBuffer.values();
  let tempBuf = [];
  // Get description and length
  let nextChar = bytes.next();
  let value = nextChar.value;
  while (!nextChar.done && value !== 0) {
    tempBuf.push(value);
    nextChar = bytes.next();
    value = nextChar.value;
  }
  const [name, length] = String.fromCharCode(...tempBuf).split(" ");
  const gitTree: GitTree = {
    name,
    length,
    files: [],
  };
  tempBuf = [];

  nextChar = bytes.next();
  value = nextChar.value;
  while (!nextChar.done) {
    if (value !== 0) {
      tempBuf.push(value);
    } else {
      const hashTempBuf = [];
      for (let i = 0; i < 20; i++) {
        const packedNum = bytes.next().value;
        // Convert packed hex to character codes for letters
        const secondCharCode = packedNum % 16;
        const firstCharCode = (packedNum - secondCharCode) / 16;
        // Need to correct for character code
        hashTempBuf.push(
          firstCharCode < 10 ? firstCharCode + 48 : firstCharCode - 10 + 97
        );
        hashTempBuf.push(
          secondCharCode < 10 ? secondCharCode + 48 : secondCharCode - 10 + 97
        );
      }
      const [type, name] = String.fromCharCode(...tempBuf).split(" ");
      gitTree.files.push({
        type,
        name,
        hash: String.fromCharCode(...hashTempBuf),
      });
      tempBuf = [];
    }
    nextChar = bytes.next();
    value = nextChar.value;
  }

  return gitTree;
};

export { inflateZlib, parseGitTree };
