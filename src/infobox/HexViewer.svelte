<script lang="ts">
  import ResizableSplit from "../ResizableSplit.svelte";
  import { mousedown } from "../stores";
  import ByteGrid from "./ByteGrid.svelte";
  import type { HighlightedByteRange } from "./types";

  export let binaryData: number[] = [];

  export let highlightedBytes: HighlightedByteRange[] = [
    { start: 2, end: 4, color: "red" },
    { start: 7, end: 12, color: "blue" },
  ];
  let leftWidthPx: number = 250;
  let rowWidth: number;

  let selectedByteIdx: number | undefined = undefined;

  const byteToHex = (b: number) => `${b < 16 ? "0" : ""}${b.toString(16)}`;
  const byteToChar = (b: number) =>
    isBytePrintableASCII(b) ? String.fromCharCode(b) : ".";

  const isBytePrintableASCII = (byte: number) => byte >= 0x20 && byte <= 0x7f;

  $: if ($mousedown) {
    selectedByteIdx = undefined;
  }
</script>

<style>
  .hex-viewer-wrapper {
    display: flex;
    flex: 1;
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
  >
    <ByteGrid
      slot="left"
      byteArr={binaryData.map(byteToHex)}
      {highlightedBytes}
      bind:selectedByteIdx
      bind:rowWidth
      byteStyle="min-width: 10px; padding: 0 5px;"
      {leftWidthPx}
    />
    <ByteGrid
      slot="right"
      byteArr={binaryData.map(byteToChar)}
      {highlightedBytes}
      bind:selectedByteIdx
      bind:rowWidth
      byteStyle="min-width: 5px;"
      style="padding-left: 20px;"
    />
  </ResizableSplit>
</div>
