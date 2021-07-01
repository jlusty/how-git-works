<script lang="ts">
  import { foldername, filename } from "../stores";

  export let textStr: string = "";

  const findHashes = (str: string): number[] => {
    const hashLocations = [];
    let validHashLength = 0;
    for (let i = 0; i < str.length; i++) {
      if ("0123456789abcdef".includes(str[i])) {
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

  const splitAtHashes = (str: string, hashLocations: number[]) => {
    const textArr = [];
    if (hashLocations[0] !== 0) {
      textArr.push({ text: str.substr(0, hashLocations[0]), isHash: false });
    }
    for (let i = 0; i < hashLocations.length; i++) {
      textArr.push({
        text: str.substring(hashLocations[i], hashLocations[i] + 40),
        isHash: true,
      });
      if (
        hashLocations[i] + 40 !== str.length &&
        hashLocations[i] + 40 !== hashLocations[i + 1]
      ) {
        textArr.push({
          text: str.substring(hashLocations[i] + 40, hashLocations[i + 1]),
          isHash: false,
        });
      }
    }
    return textArr;
  };

  const nullBytesCodeTags = (str: string) =>
    [...str].map((c) => (c === "\0" ? "<code>\\0</code>" : c)).join("");

  const goToObject = (hash: string) => {
    const fullPath = `${$foldername}\\objects\\${hash.substr(
      0,
      2
    )}\\${hash.substr(2)}`;
    filename.set(fullPath);
  };
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }

  p :global(code) {
    background-color: #f8f9fa;
    color: #000;
    border: 1px solid #eaecf0;
  }
</style>

<p>
  {#each splitAtHashes(textStr, findHashes(textStr)) as s}
    {#if s.isHash}
      <a
        href={`${$foldername}\\objects\\${s.text.substr(0, 2)}\\${s.text.substr(
          2
        )}`}
        on:click|preventDefault={() => goToObject(s.text)}>{s.text}</a
      >
    {:else}{@html nullBytesCodeTags(s.text)}{/if}
  {/each}
</p>
