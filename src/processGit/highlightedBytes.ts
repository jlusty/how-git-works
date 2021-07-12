import type { HighlightedByteRange } from "../infobox/types";
import { parseGitIndex } from "./parseIndex";
import { parseGitTree } from "./parseTree";

export type ObjectType = "blob" | "tree" | "commit" | "tag";
export type GitIndex = "index";

const tree = (bytes: number[]): HighlightedByteRange[] => {
  const parsedTree = parseGitTree(Buffer.from(bytes));

  const highlights = [
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
      description: "file",
    });
    highlights.push({
      start: start + 5 + 2 + f.name.length + 1,
      end: start + 5 + 2 + f.name.length + 1 + 19,
      color: "0, 255, 255",
      description: "file",
    });
    start = start + 5 + 2 + f.name.length + 1 + 19 + 1;
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
    color: string = "0, 0, 255"
  ) => {
    let end = start + length - 1;
    highlights.push({
      start,
      end,
      color,
      description,
    });
    start = end + 1;
  };

  for (let i = 0; i < parsedIndex.headers.numEntries; i++) {
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
    addEntry(20, "hash", "255, 0, 0");
    addEntry(2, "flags and filename length");
    addEntry(parsedIndex.entries[i].filenameLength, "filename");
    start++;
  }

  return highlights;
};

export const possibleHighlights = { tree, index };
