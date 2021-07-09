<script lang="ts">
  import HyperlinkHashes from "./HyperlinkHashes.svelte";
  import HexViewer from "./HexViewer.svelte";
  import type { ObjectType } from "../processGit/highlightedBytes";
  import { possibleHighlights } from "../processGit/highlightedBytes";

  export let binaryData: number[] = [];
  export let showHex = true;
  export let objectType: ObjectType | null = null;

  $: highlightedBytes = objectType
    ? possibleHighlights[objectType](binaryData)
    : [];
</script>

<style>
  .scrolling-box {
    display: flex;
    overflow-y: scroll;
    flex: 1 0 0;
    min-height: 100px;
  }

  :global(.no-margin) {
    padding: 0;
    margin: 0;
  }
  .break-lines {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }

  .small-font {
    font-size: small;
  }
</style>

<div class="scrolling-box break-lines small-font">
  <!-- {#if showHex} -->
  <HexViewer {binaryData} {highlightedBytes} {showHex} />
  <!-- {:else}
    <HyperlinkHashes bytes={binaryData} />
  {/if} -->
</div>
