<script lang="ts">
  import { onDestroy } from "svelte";
  import Toggle from "svelte-toggle";
  import { readFile } from "../filesystem/filesystem";
  import { absoluteFilename, relativeFilename } from "../stores";
  import NavigationButtons from "./NavigationButtons.svelte";
  import { parseFile } from "./parseFile";
  import type { GitFile } from "./parseFile";
  import HexInfoBox from "./HexInfoBox.svelte";
  import ObjectHyperlinkStr from "./ObjectHyperlinkStr.svelte";

  let file: GitFile | null;
  let showHex = true;
  let parsedWithZlib = false;
  let parsedTree = false;
  let parsedIndex = false;

  const unsubscribe = absoluteFilename.subscribe((value) => {
    if (value.length > 0) {
      const contents = readFile(value);
      if (contents) {
        file = parseFile(contents);
      } else {
        file = null;
      }
    }
    if (!file?.zlibParsed) {
      parsedWithZlib = false;
    }
    if (!file?.zlibParsed || file.type !== "tree") {
      parsedTree = false;
    }
    if (file.type !== "index") {
      parsedIndex = false;
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

  p {
    font-size: small;
  }
</style>

<div class="button-row">
  <NavigationButtons />
  <p class="toggle-label">show hex:</p>
  <Toggle bind:toggled={showHex} hideLabel class="no-margin" />
  <p class="toggle-label">decode zlib:</p>
  <Toggle
    disabled={!file?.zlibParsed}
    bind:toggled={parsedWithZlib}
    hideLabel
    class="no-margin"
  />
  {#if parsedWithZlib && file.type === "tree"}
    <p class="toggle-label">tree parsed:</p>
    <Toggle bind:toggled={parsedTree} hideLabel class="no-margin" />
  {/if}
  {#if file?.contents.str.substring(0, 4) === "DIRC"}
    <p class="toggle-label">index parsed:</p>
    <Toggle bind:toggled={parsedIndex} hideLabel class="no-margin" />
  {/if}
</div>
{#if file}
  <h4>{$relativeFilename}</h4>
  <p>Hash hyperlink: <ObjectHyperlinkStr /></p>
  <HexInfoBox
    binaryData={parsedWithZlib
      ? [...file.zlibParsed.buf]
      : [...file.contents.buf]}
    {showHex}
    objectType={parsedTree ? "tree" : parsedIndex ? "index" : null}
  />
{:else}
  <p>No file opened</p>
{/if}
