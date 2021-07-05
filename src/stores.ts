import * as fs from "fs";
import { writable } from "svelte/store";

export const foldername = writable(localStorage.getItem("foldername") || "");
export const filesystem = writable([]);

export const filename = writable(localStorage.getItem("filename") || "");
export const fileHistory = writable({ history: [], position: -1 });

filename.subscribe((value) => {
  if (fs.existsSync(value)) {
    localStorage.setItem("filename", value);
  } else {
    localStorage.setItem("filename", "");
  }
});

foldername.subscribe((value) => {
  localStorage.setItem("foldername", value ?? "");
});

export const mousedown = writable(false);
