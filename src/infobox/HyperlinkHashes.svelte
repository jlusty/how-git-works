<script lang="ts">
  import ObjectHyperlink from "./ObjectHyperlink.svelte";

  export let bytes: number[] | undefined = undefined;

  const findHashes = (bytes: number[]): number[] => {
    const hashLocations = [];
    let validHashLength = 0;
    for (let i = 0; i < bytes.length; i++) {
      if (
        (bytes[i] >= 48 && bytes[i] <= 57) || // 0123456789
        (bytes[i] >= 97 && bytes[i] <= 102) // abcdef
      ) {
        validHashLength++;
      } else {
        validHashLength = 0;
      }
      if (validHashLength === 40) {
        hashLocations.push(i - 39);
        validHashLength = 0;
      }
    }
    return hashLocations;
  };

  const splitAtHashes = (bytes: number[], hashLocations: number[]) => {
    const byteGroupsArr: { bytes: number[]; isHash: boolean }[] = [];
    if (hashLocations[0] !== 0) {
      byteGroupsArr.push({
        bytes: bytes.slice(0, hashLocations[0]),
        isHash: false,
      });
    }
    for (let i = 0; i < hashLocations.length; i++) {
      byteGroupsArr.push({
        bytes: bytes.slice(hashLocations[i], hashLocations[i] + 40),
        isHash: true,
      });
      if (
        hashLocations[i] + 40 !== bytes.length &&
        hashLocations[i] + 40 !== hashLocations[i + 1]
      ) {
        byteGroupsArr.push({
          bytes: bytes.slice(hashLocations[i] + 40, hashLocations[i + 1]),
          isHash: false,
        });
      }
    }
    return byteGroupsArr;
  };
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }
</style>

<p>
  {#each splitAtHashes(bytes, findHashes(bytes)) as s}
    {#if s.isHash}
      <ObjectHyperlink hash={s.bytes} />
    {:else}
      {String.fromCharCode(...s.bytes)}
    {/if}
  {/each}
</p>
