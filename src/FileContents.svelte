<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFile } from "./filesystem";
  import { filename } from "./stores.js";
  import { inflateZlib, parseGitTree } from "./decodeGit";

  let decodedContentsStr = "";
  let parsedTree = "";

  const unsubscribe = filename.subscribe((value) => {
    if (value.length > 0) {
      const fileContents = readFile(value);
      const decodedContents = inflateZlib(fileContents);
      decodedContentsStr = decodedContents.toString();
      parsedTree = parseGitTree(decodedContents);
    }
  });

  onDestroy(unsubscribe);
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
  }
</style>

{#if $filename.length > 0}
  <p>{decodedContentsStr}</p>
  <p>{parsedTree}</p>
{:else}
  <p>No file opened</p>
{/if}
