<script lang="ts">
  import { mousedown } from "../stores";
  import { tooltip } from "../tooltip/tooltip";
  import type { HighlightedByteRange } from "./types";

  export let byteStyle: string;
  export let byteRowStyle: string = "";
  export let style: string = "";
  export let byteArr: string[] = [];

  type HighlightType =
    | "highlighted-left"
    | "highlighted-middle"
    | "highlighted-right"
    | "highlighted-single";
  export let highlightedBytes: HighlightedByteRange[] = [];
  export let fixedWidthPx: number = 250;
  export let fixCurrentWidth: boolean = false;

  export let selectedByteIdx: number | undefined = undefined;

  export const byteWidthPx = 26;
  export let rowWidth: number;
  $: rowWidth = Math.max(Math.floor(fixedWidthPx / byteWidthPx), 1);
  $: dataRows = fixCurrentWidth
    ? getDataRowsNewline(byteArr)
    : getDataRows(byteArr, rowWidth, (b) =>
        b === "\n" || b === "\t" ? "." : b
      );

  const getDataRows = <T extends unknown>(
    byteArr: T[],
    rowWidth: number,
    byteTransform?: (b: T) => any
  ) => {
    const rows: { byte: T; idx: number }[][] = [];
    for (let i = 0; i < byteArr.length; i++) {
      const b = byteTransform(byteArr[i]);
      if (i % rowWidth === 0) {
        rows.push([{ byte: b, idx: i }]);
      } else {
        rows[rows.length - 1].push({ byte: b, idx: i });
      }
    }
    return rows;
  };

  const getDataRowsNewline = <T extends unknown>(byteArr: T[]) => {
    const rows: { byte: T; idx: number }[][] = [[]];
    for (let i = 0; i < byteArr.length; i++) {
      const b = byteArr[i];
      if (b === "\n") {
        rows.push([{ byte: b, idx: i }]);
      } else {
        rows[rows.length - 1].push({ byte: b, idx: i });
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
  ): { type: HighlightType; [param: string]: string } => {
    for (const { start, end, ...params } of highlightedBytes) {
      if (byteIdx === start && end == null) {
        return { type: "highlighted-single", ...params };
      } else if (byteIdx === start) {
        return { type: "highlighted-left", ...params };
      } else if (byteIdx > start && byteIdx < end) {
        return { type: "highlighted-middle", ...params };
      } else if (byteIdx === end) {
        return { type: "highlighted-right", ...params };
      }
    }
  };
</script>

<style>
  .all-bytes {
    display: flex;
    flex-direction: column;
    min-width: 0;
    align-items: flex-start;
  }

  .right-padding {
    padding-left: 20px;
  }

  .byte-row {
    display: flex;
    font-size: small;
    white-space: pre;
    overflow: hidden;
    text-overflow: clip;
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
  {#each dataRows as row}
    <div class="byte-row" style={byteRowStyle}>
      {#each row as { byte, idx }}
        {#if byteIsHighlighted(idx, highlightedBytes)}
          <span
            class={byteIsHighlighted(idx, highlightedBytes)?.type}
            style="{byteStyle} max-width: {byteWidthPx}px; --highlight-color: {byteIsHighlighted(
              idx,
              highlightedBytes
            )?.color ?? '100, 100, 100'}"
            class:selected={selectedByteIdx === idx}
            on:mouseenter={() => setSelectedByteIdx(idx)}
            on:mouseleave={unsetSelectedByteIdx}
            use:tooltip={{ interactive: true }}
            title={byteIsHighlighted(idx, highlightedBytes)?.description}
          >
            {byte}
          </span>
        {:else}
          <span
            style="{byteStyle} max-width: {byteWidthPx}px; --highlight-color: {'100, 100, 100'}"
            class:selected={selectedByteIdx === idx}
            on:mouseenter={() => setSelectedByteIdx(idx)}
            on:mouseleave={unsetSelectedByteIdx}
          >
            {byte}
          </span>
        {/if}
      {/each}
    </div>
  {/each}
</div>
