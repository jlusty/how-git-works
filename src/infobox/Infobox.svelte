<script lang="ts">
  import { onDestroy } from "svelte";
  import Toggle from "svelte-toggle";
  import { readFile } from "../filesystem/filesystem";
  import { absoluteFilename, relativeFilename } from "../stores";
  import GitTreeComponent from "../processGit/GitTree.svelte";
  import GitIndexComponent from "../processGit/GitIndex.svelte";
  import NavigationButtons from "./NavigationButtons.svelte";
  import { parseFile } from "./parseFile";
  import type { GitFile } from "./parseFile";
  import HexInfoBox from "./HexInfoBox.svelte";

  let file: GitFile | null;
  let showAscii = true;
  let parsedWithZlib = false;
  let parsedTree = false;
  let parsedIndex = false;

  const unsubscribe = absoluteFilename.subscribe((value) => {
    showAscii = true;
    parsedWithZlib = false;
    parsedTree = false;
    parsedIndex = false;
    if (value.length > 0) {
      const contents = readFile(value);
      if (contents) {
        file = parseFile(contents);
        if (file.zlibParsed) {
          parsedWithZlib = true;
        }
      } else {
        file = null;
      }
    }
  });

  $: parsedTree = parsedWithZlib && parsedTree;

  onDestroy(unsubscribe);
</script>

<style>
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
  <p class="toggle-label">show ascii:</p>
  <Toggle bind:toggled={showAscii} hideLabel class="no-margin" />
  {#if file?.zlibParsed}
    <p class="toggle-label">zlib decoded:</p>
    <Toggle bind:toggled={parsedWithZlib} hideLabel class="no-margin" />
    {#if parsedWithZlib && file.type === "tree"}
      <p class="toggle-label">tree parsed:</p>
      <Toggle bind:toggled={parsedTree} hideLabel class="no-margin" />
    {/if}
  {:else if file?.contents.str.substring(0, 4) === "DIRC"}
    <p class="toggle-label">index parsed:</p>
    <Toggle bind:toggled={parsedIndex} hideLabel class="no-margin" />
  {/if}
</div>
{#if file}
  <h4>{$relativeFilename}</h4>
  <HexInfoBox
    binaryData={parsedWithZlib
      ? [...file.zlibParsed.buf]
      : [...file.contents.buf]}
  />
{:else}
  <p>No file opened</p>
{/if}
