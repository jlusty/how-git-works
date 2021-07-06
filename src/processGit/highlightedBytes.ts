import type { HighlightedByteRange } from "../infobox/types";
import { parseGitTree } from "./parseTree";

export type ObjectType = "blob" | "tree" | "commit" | "tag";

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

export const possibleHighlights = { tree };
