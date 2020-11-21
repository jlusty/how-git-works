import { writable } from "svelte/store";

export const foldername = writable(localStorage.getItem("foldername") || "");
export const filesystem = writable([]);

export const filename = writable(localStorage.getItem("filename") || "");
export const fileHistory = writable({ history: [], position: -1 });

filename.subscribe((value) => {
  localStorage.setItem("filename", value ?? "");
});

foldername.subscribe((value) => {
  localStorage.setItem("foldername", value ?? "");
});
