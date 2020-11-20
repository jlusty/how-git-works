import { writable } from "svelte/store";

export const filename = writable("");
export const foldername = writable(localStorage.getItem("foldername") || "");
export const filesystem = writable([]);
