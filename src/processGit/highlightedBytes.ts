import type { HighlightedByteRange } from "../infobox/types";
import { unpackHash } from "./decodeGit";
import { parseGitIndex } from "./parseIndex";
import { parseGitTree } from "./parseTree";

export type ObjectType = "blob" | "tree" | "commit" | "tag";
export type GitIndex = "index";

const tree = (bytes: number[]): HighlightedByteRange[] => {
  console.log(bytes);
  const parsedTree = parseGitTree(Buffer.from(bytes));

  const highlights: HighlightedByteRange[] = [
    {
      start: 0,
      end: 5 + parsedTree.length.length - 1,
      color: "0, 255, 0",
      description: "name and length",
    },
  ];

  let start = 5 + parsedTree.length.length + 1;
  for (const f of parsedTree.files) {
    highlights.push({
      start: start,
      end: start + 5 + 2 + f.name.length - 1,
      color: "0, 0, 255",
      description: "file name",
    });
    start = start + 5 + 2 + f.name.length + 1;
    let end = start + 19;
    const hash = unpackHash(bytes.slice(start, end + 1));
    highlights.push({
      start,
      end,
      color: "0, 255, 255",
      description: "object hash",
      hash,
    });
    start = end + 1;
  }

  return highlights;
};

const index = (bytes: number[]): HighlightedByteRange[] => {
  const parsedIndex = parseGitIndex(Buffer.from(bytes));

  const highlights = [
    {
      start: 0,
      end: 3,
      color: "0, 255, 0",
      description: "signature",
    },
    {
      start: 4,
      end: 7,
      color: "0, 255, 0",
      description: "version number",
    },
    {
      start: 8,
      end: 11,
      color: "0, 255, 0",
      description: "number of index entries",
    },
  ];

  let start = 12;
  const addEntry = (
    length: number,
    description: string,
    color: string = "0, 0, 255",
    hash?: string
  ) => {
    let end = start + length - 1;
    highlights.push({
      ...{
        start,
        end,
        color,
        description,
      },
      ...(hash && { hash }),
    });
    start = end + 1;
  };

  for (let i = 0; i < parsedIndex.headers.numEntries; i++) {
    const entryStartPoint = start;
    addEntry(4, "ctime seconds");
    addEntry(4, "ctime nanoseconds");
    addEntry(4, "mtime seconds");
    addEntry(4, "mtime nanoseconds");
    addEntry(4, "dev");
    addEntry(4, "ino");
    addEntry(4, "mode");
    addEntry(4, "uid");
    addEntry(4, "gid");
    addEntry(4, "file size");
    addEntry(20, "hash", "255, 0, 0", parsedIndex.entries[i].hash);
    addEntry(2, "flags and filename length");
    addEntry(parsedIndex.entries[i].filenameLength, "filename");
    start++;
    while ((start - entryStartPoint) % 8 !== 0) {
      start++;
    }
  }

  return highlights;
};

const commit = (bytes: number[]): HighlightedByteRange[] => {
  const highlights = [
    {
      start: 0,
      end: 5,
      color: "0, 255, 0",
      description: "signature",
    },
  ];

  let start = 7;
  const addEntry = (
    length: number,
    description: string,
    color: string = "0, 0, 255",
    hash?: string
  ) => {
    let end = start + length - 1;
    highlights.push({
      ...{
        start,
        end,
        color,
        description,
      },
      ...(hash && { hash }),
    });
    start = end + 1;
  };

  let i = 0;
  while (bytes[start + i] !== 0) {
    i++;
  }
  addEntry(i, "length");
  start += 1;

  addEntry(4, "tree label");
  start += 1;
  addEntry(
    40,
    "hash",
    "255, 0, 0",
    String.fromCharCode(...bytes.slice(start, start + 40))
  );

  if (String.fromCharCode(...bytes.slice(start + 1, start + 7)) === "parent") {
    start += 1;
    addEntry(6, "tree label");
    start += 1;
    addEntry(
      40,
      "hash",
      "255, 0, 0",
      String.fromCharCode(...bytes.slice(start, start + 40))
    );
  }

  start += 1;
  i = 1;
  while (bytes[start + i] !== 0x0a && i < bytes.length) {
    i++;
  }
  i += 1;
  while (bytes[start + i] !== 0x0a && i < bytes.length) {
    i++;
  }
  addEntry(i, "author and committer");

  start += 2;
  addEntry(bytes.length - start - 1, "commit message");
  return highlights;
};

export const possibleHighlights = { tree, index, commit };
