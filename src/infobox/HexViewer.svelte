<script lang="ts">
  import ResizableSplit from "../ResizableSplit.svelte";

  export let binaryData: number[] = [];
  let leftWidthPx: number = 250;

  let selectedByteIdx: number | undefined = undefined;

  const byteWidthPx = 26;
  $: rowWidth = Math.max(Math.floor(leftWidthPx / byteWidthPx), 1);
  $: dataRows = getDataRows(binaryData, rowWidth);

  const getDataRows = (binaryData: number[], rowWidth: number) => {
    const rows: number[][] = [];
    for (let i = 0; i < binaryData.length; i++) {
      if (i % rowWidth === 0) {
        rows.push([binaryData[i]]);
      } else {
        rows[rows.length - 1].push(binaryData[i]);
      }
    }
    return rows;
  };

  const byteToHex = (b: number) => `${b < 16 ? "0" : ""}${b.toString(16)}`;
  const byteToChar = (b: number) =>
    isBytePrintableASCII(b) ? String.fromCharCode(b) : ".";

  const isBytePrintableASCII = (byte: number) => byte >= 0x20 && byte <= 0x7f;

  const setSelectedByteIdx = (byteIdx: number) => {
    selectedByteIdx = byteIdx;
  };
  const unsetSelectedByteIdx = () => {
    selectedByteIdx = undefined;
  };
</script>

<style>
  .hex-viewer-wrapper {
    display: flex;
    height: 50%;
  }

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
    margin: 2px 0;
  }
  .byte-row span {
    display: inline-block;
  }

  .selected {
    background-color: #bebebe;
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
    <div class="all-bytes" slot="left">
      {#each dataRows as row, rowIdx}
        <div class="byte-row">
          {#each row as byte, i}
            <span
              class="hex-byte"
              style="max-width: {byteWidthPx}px;"
              class:selected={selectedByteIdx === rowIdx * rowWidth + i}
              on:mouseenter={() => setSelectedByteIdx(rowIdx * rowWidth + i)}
              on:mouseleave={unsetSelectedByteIdx}>{byteToHex(byte)}</span
            >
          {/each}
        </div>
      {/each}
    </div>
    <div class="all-bytes right-padding" slot="right">
      {#each dataRows as row, rowIdx}
        <div class="byte-row">
          {#each row as byte, i}
            <span
              class="char-byte"
              class:selected={selectedByteIdx === rowIdx * rowWidth + i}
              on:mouseenter={() => setSelectedByteIdx(rowIdx * rowWidth + i)}
              on:mouseleave={unsetSelectedByteIdx}>{byteToChar(byte)}</span
            >
          {/each}
        </div>
      {/each}
    </div>
  </ResizableSplit>
</div>
