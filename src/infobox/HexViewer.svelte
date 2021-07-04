<script lang="ts">
  export let binaryData: number[] = [];
  export let rowWidth: number = 10;

  let selectedByteIdx: number | undefined = undefined;

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
  .vertical-line {
    width: 1px;
    background-color: grey;
    height: 100%;
    margin: 0 10px;
  }

  .hex-viewer-wrapper {
    display: flex;
    height: 50%;
  }

  .all-bytes {
    display: flex;
    flex-direction: column;
  }

  .hex-byte {
    font-size: small;
    padding: 0 5px;
  }

  .char-byte {
    font-size: small;
  }

  .byte-row {
    margin: 2px 0;
  }

  .selected {
    background-color: #bebebe;
  }
</style>

<div class="hex-viewer-wrapper">
  <div class="all-bytes">
    {#each dataRows as row, rowIdx}
      <div class="byte-row">
        {#each row as byte, i}
          <span
            class="hex-byte"
            class:selected={selectedByteIdx === rowIdx * rowWidth + i}
            on:mouseenter={() => setSelectedByteIdx(rowIdx * rowWidth + i)}
            on:mouseleave={unsetSelectedByteIdx}>{byteToHex(byte)}</span
          >
        {/each}
      </div>
    {/each}
  </div>
  <div class="vertical-line" />
  <div class="all-bytes">
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
</div>
