// Hack to stop @rollup/plugin-typescript from complaining
// @ts-ignore
import * as fs from "fs";

function readFile(path) {
  return fs.readFileSync(path);
}

export default readFile;
