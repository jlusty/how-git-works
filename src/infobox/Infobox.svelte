<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFile } from "../filesystem/filesystem";
  import { filename, foldername } from "../stores";
  import { inflateZlib, parseGitTree } from "../processGit/decodeGit";

  let fileContentsStr;
  let decodedContentsStr = "";
  let parsedTree = "";

  const unsubscribe = filename.subscribe((value) => {
    if (value.length > 0) {
      const fileContents = readFile(value);
      fileContentsStr = fileContents.toString();
      // const decodedContents = inflateZlib(fileContents);
      // decodedContentsStr = decodedContents.toString();
      // parsedTree = parseGitTree(decodedContents);
    }
  });

  onDestroy(unsubscribe);
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }

  .scrolling-box {
    overflow-y: scroll;
    height: 95%;
  }
</style>

{#if $filename.length > 0}
  <p>{$filename.replace(`${$foldername}\\`, '')}</p>
  <div class="scrolling-box">
    <p>{fileContentsStr}</p>
    <p>{decodedContentsStr}</p>
    <p>{parsedTree}</p>
  </div>
{:else}
  <p>No file opened</p>
{/if}
