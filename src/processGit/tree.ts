import { unpackHash } from "./decodeGit";

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
      const hashBytes = [];
      for (let i = 0; i < 20; i++) {
        hashBytes.push(bytes.next().value);
      }
      const hash = unpackHash(hashBytes);
      const [type, name] = String.fromCharCode(...tempBuf).split(" ");
      gitTree.files.push({
        type,
        name,
        hash,
      });
      tempBuf = [];
    }
    nextChar = bytes.next();
    value = nextChar.value;
  }

  return gitTree;
};

export { parseGitTree };
