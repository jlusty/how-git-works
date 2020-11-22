<script lang="ts">
  import { onDestroy } from "svelte";
  import Toggle from "svelte-toggle";
  import { readFile } from "../filesystem/filesystem";
  import { filename, foldername } from "../stores";
  import GitTreeComp from "../processGit/GitTree.svelte";
  import NavigationButtons from "./NavigationButtons.svelte";
  import HyperlinkHashes from "../processGit/HyperlinkHashes.svelte";
  import { parseFile } from "./parseFile";
  import type { GitFile } from "./parseFile";

  let file: GitFile;
  let parsedWithZlib = false;
  let parsedTree = false;
  let infoboxContents = "";

  const unsubscribe = filename.subscribe((value) => {
    parsedWithZlib = false;
    parsedTree = false;
    if (value.length > 0) {
      const contents = readFile(value);
      if (contents) {
        file = parseFile(contents);
        infoboxContents = file.contents.str;
        if (file.zlibParsed) {
          parsedWithZlib = true;
        }
      } else {
        infoboxContents = "!!! File not found !!!";
      }
    }
  });

  $: parsedTree = parsedWithZlib && parsedTree;

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
    align-items: center;
    margin: 0;
    flex: 0 0 45px;
  }

  :global(.no-margin) {
    padding: 0;
    margin: 0;
  }

  .toggle-label {
    font-size: small;
    padding: 0 5px 0 20px;
  }
</style>

<div class="button-row">
  <NavigationButtons />
  {#if file?.zlibParsed}
    <p class="toggle-label">zlib decoded:</p>
    <Toggle bind:toggled={parsedWithZlib} hideLabel class="no-margin" />
    {#if parsedWithZlib && file.type === 'tree'}
      <p class="toggle-label">tree parsed:</p>
      <Toggle bind:toggled={parsedTree} hideLabel class="no-margin" />
    {/if}
  {/if}
</div>
{#if $filename.length > 0}
  <h4>{$filename.replace(`${$foldername}\\`, '')}</h4>
  <div class="scrolling-box">
    {#if parsedTree}
      <GitTreeComp zlibBuf={file.zlibParsed.buf} />
    {:else}
      <HyperlinkHashes
        textStr={parsedWithZlib ? file.zlibParsed.str : infoboxContents} />
    {/if}
  </div>
{:else}
  <p>No file opened</p>
{/if}
