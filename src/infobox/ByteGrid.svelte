<script lang="ts">
  import { mousedown } from "../stores";
  import type { HighlightedByteRange } from "./types";

  export let byteStyle: string;
  export let style: string = "";
  export let byteArr: string[] = [];

  type HighlightType =
    | "highlighted-left"
    | "highlighted-middle"
    | "highlighted-right"
    | "highlighted-single";
  export let highlightedBytes: HighlightedByteRange[] = [];
  export let leftWidthPx: number = 250;

  export let selectedByteIdx: number | undefined = undefined;

  export const byteWidthPx = 26;
  export let rowWidth: number;
  $: rowWidth = Math.max(Math.floor(leftWidthPx / byteWidthPx), 1);
  $: dataRows = getDataRows(byteArr, rowWidth);

  const getDataRows = <T extends unknown>(byteArr: T[], rowWidth: number) => {
    const rows: T[][] = [];
    for (let i = 0; i < byteArr.length; i++) {
      if (i % rowWidth === 0) {
        rows.push([byteArr[i]]);
      } else {
        rows[rows.length - 1].push(byteArr[i]);
      }
    }
    return rows;
  };

  const setSelectedByteIdx = (byteIdx: number) => {
    if (!$mousedown) {
      selectedByteIdx = byteIdx;
    }
  };
  const unsetSelectedByteIdx = () => {
    if (!$mousedown) {
      selectedByteIdx = undefined;
    }
  };

  $: if ($mousedown) {
    selectedByteIdx = undefined;
  }

  const byteIsHighlighted = (
    byteIdx: number,
    highlightedBytes: HighlightedByteRange[]
  ): { type: HighlightType; color: string } => {
    for (const { start, end, color } of highlightedBytes) {
      if (byteIdx === start && end == null) {
        return { type: "highlighted-single", color };
      } else if (byteIdx === start) {
        return { type: "highlighted-left", color };
      } else if (byteIdx > start && byteIdx < end) {
        return { type: "highlighted-middle", color };
      } else if (byteIdx === end) {
        return { type: "highlighted-right", color };
      }
    }
  };
</script>

<style>
  .all-bytes {
    display: flex;
    flex-direction: column;
  }

  .right-padding {
    padding-left: 20px;
  }

  .hex-byte {
    min-width: 10px;
    padding: 0 5px;
  }

  .char-byte {
    min-width: 5px;
  }

  .byte-row {
    font-size: small;
    white-space: pre;
    overflow: hidden;
    text-overflow: clip;
    margin: 3px 0;
  }
  .byte-row span {
    display: inline-block;
  }

  .selected {
    background-color: rgba(var(--highlight-color), 0.2);
  }

  .highlighted-left {
    box-shadow: 1px 0 0 0 rgb(var(--highlight-color)) inset,
      0 1px 0 0 rgb(var(--highlight-color)) inset,
      0 -1px 0 0 rgb(var(--highlight-color)) inset;
  }
  .highlighted-middle {
    box-shadow: 0 1px 0 0 rgb(var(--highlight-color)) inset,
      0 -1px 0 0 rgb(var(--highlight-color)) inset;
  }
  .highlighted-right {
    box-shadow: -1px 0 0 0 rgb(var(--highlight-color)) inset,
      0 1px 0 0 rgb(var(--highlight-color)) inset,
      0 -1px 0 0 rgb(var(--highlight-color)) inset;
  }
  .highlighted-single {
    box-shadow: 1px 0 0 0 rgb(var(--highlight-color)) inset,
      -1px 0 0 0 rgb(var(--highlight-color)) inset,
      0 1px 0 0 rgb(var(--highlight-color)) inset,
      0 -1px 0 0 rgb(var(--highlight-color)) inset;
  }
</style>

<div class="all-bytes" {style}>
  {#each dataRows as row, rowIdx}
    <div class="byte-row">
      {#each row as byte, i}
        <span
          class={byteIsHighlighted(rowIdx * rowWidth + i, highlightedBytes)
            ?.type}
          style="{byteStyle} max-width: {byteWidthPx}px; --highlight-color: {byteIsHighlighted(
            rowIdx * rowWidth + i,
            highlightedBytes
          )?.color ?? '100, 100, 100'}"
          class:selected={selectedByteIdx === rowIdx * rowWidth + i}
          on:mouseenter={() => setSelectedByteIdx(rowIdx * rowWidth + i)}
          on:mouseleave={unsetSelectedByteIdx}>{byte}</span
        >
      {/each}
    </div>
  {/each}
</div>
