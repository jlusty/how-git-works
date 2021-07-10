<script lang="ts">
  import ResizableSplit from "../ResizableSplit.svelte";
  import { mousedown } from "../stores";
  import ByteGrid from "./ByteGrid.svelte";
  import SpacerDiv from "./SpacerDiv.svelte";
  import type { HighlightedByteRange } from "./types";

  export let binaryData: number[] = [];

  export let highlightedBytes: HighlightedByteRange[] = [];
  let leftWidthPx: number = 250;
  let rowWidth: number;

  export let showHex: boolean = true;

  let selectedByteIdx: number | undefined = undefined;

  const byteToHex = (b: number) => `${b < 16 ? "0" : ""}${b.toString(16)}`;
  const byteToChar = (b: number) => {
    switch (b) {
      case 0x00:
        return "␀";
      case 0x09:
        return "\t";
      case 0x0a:
        return "\n";
    }
    return isBytePrintableASCII(b) ? String.fromCharCode(b) : ".";
  };

  const isBytePrintableASCII = (byte: number) => byte >= 0x20 && byte <= 0x7f;

  $: if ($mousedown) {
    selectedByteIdx = undefined;
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
      byteStyle="min-width: 10px; padding: 0 5px;  margin: 3px 0;"
      let:leftSlotWidth
      fixedWidthPx={leftSlotWidth}
    />
    <div slot="right" style="display: flex;" let:leftFullyVisible>
      <ByteGrid
        byteArr={binaryData.map(byteToChar)}
        {highlightedBytes}
        bind:selectedByteIdx
        bind:rowWidth
        byteStyle="min-width: 5px;  margin: 3px 0;"
        style="padding-left: 20px;"
        byteRowStyle="white-space: pre-wrap; flex-wrap: wrap;"
        fixCurrentWidth={!leftFullyVisible}
      />
      <SpacerDiv {leftFullyVisible} />
    </div>
  </ResizableSplit>
</div>
