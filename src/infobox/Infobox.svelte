<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFile } from "../filesystem/filesystem";
  import { filename, foldername } from "../stores";
  import { inflateZlib, parseGitTree } from "../processGit/decodeGit";
  import type { GitTree } from "../processGit/decodeGit";
  import GitTreeComp from "../processGit/GitTree.svelte";
  import NavigationButtons from "./NavigationButtons.svelte";

  interface FileData {
    buf: Buffer;
    str: string;
  }
  interface File {
    contents: FileData;
    zlibParsed?: FileData | "Unable to parse with zlib";
    treeParsed?: GitTree;
  }

  let file: File;
  let parsedWithZlib = false;
  let parsedTree = false;
  let infoboxContents = "";

  const unsubscribe = filename.subscribe((value) => {
    if (value.length > 0) {
      parsedWithZlib = false;
      parsedTree = false;
      const contents = readFile(value);
      file = { contents: { buf: contents, str: contents.toString() } };

      infoboxContents = file.contents.str;
    }
  });

  const parseZlib = () => {
    parsedWithZlib = !parsedWithZlib;
    if (!parsedWithZlib) {
      parsedTree = false;
    }
    if (!file.zlibParsed) {
      try {
        const zlibParsed = inflateZlib(file.contents.buf);
        file.zlibParsed = { buf: zlibParsed, str: zlibParsed.toString() };
      } catch (err) {
        if (err.code === "Z_DATA_ERROR") {
          file.zlibParsed = "Unable to parse with zlib";
        } else {
          throw err;
        }
      }
    }
    if (parsedWithZlib) {
      infoboxContents =
        file.zlibParsed === "Unable to parse with zlib"
          ? "Unable to parse with zlib"
          : file.zlibParsed.str;
    } else {
      infoboxContents = file.contents.str;
    }
  };

  const parseTree = () => {
    parsedTree = !parsedTree;
    if (file.zlibParsed === "Unable to parse with zlib") {
      return;
    }
    if (!file.treeParsed) {
      const parsedTree = parseGitTree(file.zlibParsed.buf);
      file.treeParsed = parsedTree;
    }
    infoboxContents = parsedTree ? "" : file.zlibParsed.str;
  };

  onDestroy(unsubscribe);
</script>

<style>
  .scrolling-box {
    overflow-y: scroll;
    height: 95%;
  }

  .button-row {
    display: flex;
    flex-direction: row;
  }

  button {
    width: 25%;
  }
</style>

<NavigationButtons />
{#if $filename.length > 0}
  <p>{$filename.replace(`${$foldername}\\`, '')}</p>
  <div class="button-row">
    <button on:click={parseZlib}>zlib: {parsedWithZlib}</button>
    {#if parsedWithZlib && file.zlibParsed !== 'Unable to parse with zlib'}
      <button on:click={parseTree}>tree: {parsedTree}</button>
    {/if}
  </div>
  <div class="scrolling-box">
    <GitTreeComp textStr={infoboxContents} gitTree={file.treeParsed} />
  </div>
{:else}
  <p>No file opened</p>
{/if}
