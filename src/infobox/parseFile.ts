import { inflateZlib } from "../processGit/decodeGit";

interface FileData {
  buf: Buffer;
  str: string;
}
export interface GitFile {
  contents: FileData;
  zlibParsed: FileData | null;
  type: string | null;
}

const parseFile = (fileBuf: Buffer): GitFile => {
  const zlibBuf = parseZlib(fileBuf);
  let zlibStr: string;
  let type = null;
  if (zlibBuf) {
    zlibStr = zlibBuf.toString();
    type = zlibStr.split(" ")[0];
  }
  return {
    contents: { buf: fileBuf, str: fileBuf.toString() },
    zlibParsed: zlibBuf ? { buf: zlibBuf, str: zlibStr } : null,
    type,
  };
};

const parseZlib = (fileBuf: Buffer) => {
  try {
    return inflateZlib(fileBuf);
  } catch (err) {
    if (err.code === "Z_DATA_ERROR") {
      return null;
    } else {
      throw err;
    }
  }
};

export { parseFile };
