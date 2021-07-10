<script lang="ts">
  import ResizableSplit from "../ResizableSplit.svelte";
  import { mousedown } from "../stores";
  import ByteGrid from "./ByteGrid.svelte";
  import type { HighlightedByteRange } from "./types";

  export let binaryData: number[] = [];

  export let highlightedBytes: HighlightedByteRange[] = [];
  let leftWidthPx: number = 250;
  let rowWidth: number;

  export let showHex: boolean = true;

  let selectedByteIdx: number | undefined = undefined;

  const byteToHex = (b: number) => `${b < 16 ? "0" : ""}${b.toString(16)}`;
  const byteToChar = (b: number) =>
    isBytePrintableASCII(b) ? String.fromCharCode(b) : ".";

  const isBytePrintableASCII = (byte: number) => byte >= 0x20 && byte <= 0x7f;

  $: if ($mousedown) {
    selectedByteIdx = undefined;
  }

  let spacerDiv;
  let spacerDivWidth: number;
  $: if (spacerDiv && showHex && !$mousedown) {
    spacerDivWidth = spacerDiv.clientWidth;
  }
</script>

<style>
  .hex-viewer-wrapper {
    display: flex;
    flex: 1;
    margin: 10px 0;
    min-width: 0;
  }
</style>

<div class="hex-viewer-wrapper">
  <ResizableSplit
    onWidthChange={(px) => {
      leftWidthPx = px;
    }}
    leftSlotWidth={leftWidthPx}
    resizeBarWidth={3}
    minLeftSlotWidth={30}
    hideLeft={!showHex}
  >
    <ByteGrid
      slot="left"
      byteArr={binaryData.map(byteToHex)}
      {highlightedBytes}
      bind:selectedByteIdx
      bind:rowWidth
      byteStyle="min-width: 10px; padding: 0 5px;"
      let:leftSlotWidth
      fixedWidthPx={leftSlotWidth}
    />
    <div slot="right" style="display: flex;" let:leftFullyVisible>
      <ByteGrid
        byteArr={binaryData.map(byteToChar)}
        {highlightedBytes}
        bind:selectedByteIdx
        bind:rowWidth
        byteStyle="min-width: 5px;"
        style="padding-left: 20px;"
        byteRowStyle="white-space: pre-wrap; flex-wrap: wrap;"
        fixCurrentWidth={!leftFullyVisible}
      />
      <div
        bind:this={spacerDiv}
        style={`height: 10px; flex: 1 0 ${
          leftFullyVisible ? "auto" : `${spacerDivWidth}px`
        }`}
      />
    </div>
  </ResizableSplit>
</div>
