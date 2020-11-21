import { writable } from "svelte/store";

export const filename = writable(localStorage.getItem("filename") || "");
export const foldername = writable(localStorage.getItem("foldername") || "");
export const filesystem = writable([]);
