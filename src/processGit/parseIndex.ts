import { unpackHash } from "./decodeGit";

export interface GitIndex {
  headers: IndexHeaders;
  entries: IndexEntry[];
  extensions: GitExtension[];
  checksum: string;
}

interface IndexHeaders {
  signature: string;
  version: number;
  numEntries: number;
}

interface IndexEntry {
  headers: EntryHeaders;
  hash: string;
  flags: number;
  filenameLength: number;
  filename: string;
}

interface EntryHeaders {
  ctimeSeconds: number;
  ctimeNanoSeconds: number;
  mtimeSeconds: number;
  mtimeNanoSeconds: number;
  dev: number;
  ino: number;
  mode: number;
  uid: number;
  gid: number;
  file: number;
}

interface GitExtension {
  signature: string;
  bytes: number[];
}

const getBytes = (bytes: IterableIterator<number>, num: number): number[] => {
  const tempBuf = [];
  for (let i = 0; i < num; i++) {
    tempBuf.push(bytes.next().value);
  }
  return tempBuf;
};

const get32bitNum = (byteArr: number[]): number =>
  (byteArr[0] << 24) + (byteArr[1] << 16) + (byteArr[2] << 8) + byteArr[3];

const parseGitIndex = (indexBuffer: Buffer): GitIndex => {
  const bytes = indexBuffer.values();

  const signature = getBytes(bytes, 4);
  const version = get32bitNum(getBytes(bytes, 4));
  const numEntries = get32bitNum(getBytes(bytes, 4));

  const indexHeaders: IndexHeaders = {
    signature: String.fromCharCode(...signature),
    version,
    numEntries,
  };

  const entries: IndexEntry[] = [];
  for (let i = 0; i < numEntries; i++) {
    let nextByte = bytes.next().value;
    while (nextByte === 0) {
      nextByte = bytes.next().value;
    }
    const entryHeader = {
      ctimeSeconds: get32bitNum([nextByte, ...getBytes(bytes, 3)]),
      ctimeNanoSeconds: get32bitNum(getBytes(bytes, 4)),
      mtimeSeconds: get32bitNum(getBytes(bytes, 4)),
      mtimeNanoSeconds: get32bitNum(getBytes(bytes, 4)),
      dev: get32bitNum(getBytes(bytes, 4)),
      ino: get32bitNum(getBytes(bytes, 4)),
      mode: get32bitNum(getBytes(bytes, 4)),
      uid: get32bitNum(getBytes(bytes, 4)),
      gid: get32bitNum(getBytes(bytes, 4)),
      file: get32bitNum(getBytes(bytes, 4)),
    };

    const hash = unpackHash(getBytes(bytes, 20));

    const flagsAndFilenameLength = getBytes(bytes, 2);
    const flags = (flagsAndFilenameLength[0] & 0xf0) >> 4;
    const filenameLength =
      ((flagsAndFilenameLength[0] & 0x0f) << 8) + flagsAndFilenameLength[1];

    const filenameBuf = [];
    nextByte = bytes.next().value;
    while (nextByte !== 0) {
      filenameBuf.push(nextByte);
      nextByte = bytes.next().value;
    }

    entries.push({
      headers: entryHeader,
      hash,
      flags,
      filenameLength,
      filename: String.fromCharCode(...filenameBuf),
    });
  }

  let nextByte = bytes.next().value;
  while (nextByte === 0) {
    nextByte = bytes.next().value;
  }

  // TODO: Parse extensions
  let hasExtension = true;
  let tryExtension = [nextByte, ...getBytes(bytes, 3)];
  let extensionsBuf: GitExtension[] = [];
  while (hasExtension) {
    const extensionStr = String.fromCharCode(...tryExtension);
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(extensionStr[0])) {
      const extensionSize = get32bitNum(getBytes(bytes, 4));
      const extensionBytes = getBytes(bytes, extensionSize);
      extensionsBuf.push({ signature: extensionStr, bytes: extensionBytes });
      tryExtension = getBytes(bytes, 4);
    } else {
      hasExtension = false;
    }
  }

  const checksum = [...tryExtension, ...getBytes(bytes, 16)];
  if (!bytes.next().done) {
    throw new Error("Failed to parse index");
  }

  return {
    headers: indexHeaders,
    entries,
    extensions: extensionsBuf,
    checksum: unpackHash(checksum),
  };
};

export { parseGitIndex };
