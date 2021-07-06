import * as fs from "fs";
import { writable, derived } from "svelte/store";

export const openFolder = writable(localStorage.getItem("foldername") || "");
export const filesystem = writable([]);

export const absoluteFilename = writable(
  localStorage.getItem("filename") || ""
);
export const gitFolder = derived(absoluteFilename, ($absoluteFilename) =>
  $absoluteFilename.substring(0, $absoluteFilename.indexOf(".git") + 4)
);

export const relativeFilename = derived(
  [openFolder, absoluteFilename],
  ([$openFolder, $absoluteFilename]) =>
    $absoluteFilename.replace(`${$openFolder}\\`, "")
);
export const fileHistory = writable({ history: [], position: -1 });

absoluteFilename.subscribe((value) => {
  if (fs.existsSync(value)) {
    localStorage.setItem("filename", value);
  } else {
    localStorage.setItem("filename", "");
  }
});

openFolder.subscribe((value) => {
  localStorage.setItem("foldername", value ?? "");
});

export const mousedown = writable(false);
