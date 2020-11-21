import * as fs from "fs";
import * as path from "path";

function readFile(pathString: string): Buffer {
  if (fs.existsSync(pathString)) {
    return fs.readFileSync(pathString);
  }
  return Buffer.from("");
}

function readFolderToFilesystem(pathString: string): FileSystemStruct {
  if (fs.existsSync(pathString)) {
    const filesystem = traverseDir(pathString);
    return filesystem;
  }
  return [];
}

export type FileSystemStruct = Array<FolderStruct | FileStruct>;

export interface FolderStruct {
  type: "folder";
  name: string;
  files: FileSystemStruct;
}

export interface FileStruct {
  type: "file";
  name: string;
  fullPath: string;
}

function traverseDir(dir: string) {
  const filesystem: Array<FolderStruct | FileStruct> = [];
  fs.readdirSync(dir).forEach((file: string) => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      filesystem.push({
        type: "folder",
        name: file,
        files: [...traverseDir(fullPath)],
      });
    } else {
      filesystem.push({ type: "file", name: file, fullPath });
    }
  });
  return filesystem;
}

export { readFile, readFolderToFilesystem };
