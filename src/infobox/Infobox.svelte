<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFile } from "../filesystem/filesystem";
  import { filename, foldername } from "../stores";
  import { inflateZlib, parseGitTree } from "../processGit/decodeGit";
  import type { GitTree } from "../processGit/decodeGit";
  import GitTreeComp from "../processGit/GitTree.svelte";

  interface FileData {
    buf: Buffer;
    str: string;
  }
  interface File {
    contents: FileData;
    zlibParsed?: FileData;
    treeParsed?: GitTree;
  }

  let file: File;
  let parsedWithZlib = false;
  let parsedTree = false;
  let infoboxContents = "";

  const unsubscribe = filename.subscribe((value) => {
    if (value.length > 0) {
      parsedWithZlib = false;
      const contents = readFile(value);
      file = { contents: { buf: contents, str: contents.toString() } };

      infoboxContents = file.contents.str;
    }
  });

  const parseZlib = () => {
    parsedWithZlib = !parsedWithZlib;
    if (!file.zlibParsed) {
      const zlibParsed = inflateZlib(file.contents.buf);
      file.zlibParsed = { buf: zlibParsed, str: zlibParsed.toString() };
    }
    infoboxContents = parsedWithZlib ? file.zlibParsed.str : file.contents.str;
  };

  const parseTree = () => {
    parsedTree = !parsedTree;
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

{#if $filename.length > 0}
  <p>{$filename.replace(`${$foldername}\\`, '')}</p>
  <div class="button-row">
    <button on:click={parseZlib}>zlib: {parsedWithZlib}</button>
    {#if parsedWithZlib}
      <button on:click={parseTree}>tree: {parsedTree}</button>
    {/if}
  </div>
  <div class="scrolling-box">
    <GitTreeComp textStr={infoboxContents} gitTree={file.treeParsed} />
  </div>
{:else}
  <p>No file opened</p>
{/if}
