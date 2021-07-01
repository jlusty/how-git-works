<script lang="ts">
  import { foldername, filename } from "../stores";

  export let bytes: number[] | undefined = undefined;
  export let showAscii: boolean = false;

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

  const isPrintableASCII = (str: string) =>
    /^(\x09|\x0A|[\x20-\x7F])*$/.test(str);

  const isBytePrintableASCII = (byte: number) =>
    byte === 0x9 || byte === 0xa || (byte >= 0x20 && byte <= 0x7f);

  const nullBytesCodeTags = (str: string) =>
    [...str]
      .map((c) => (isPrintableASCII(c) ? c : `<code>${c.charCodeAt(0)}</code>`))
      .join("");

  const fullObjectPath = (hashBytes: number[]) =>
    `${$foldername}\\objects\\${String.fromCharCode(
      ...hashBytes.slice(0, 2)
    )}\\${String.fromCharCode(...hashBytes.slice(2))}`;

  const goToObject = (hashBytes: number[]) => {
    const fullPath = fullObjectPath(hashBytes);
    filename.set(fullPath);
  };

  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
  {#each splitAtHashes(bytes, findHashes(bytes)) as s}
    {#if s.isHash}
      <a
        href={fullObjectPath(s.bytes)}
        on:click|preventDefault={() => goToObject(s.bytes)}
        >{String.fromCharCode(...s.bytes)}</a
      >
    {:else}{@html s.bytes
        .map((b) =>
          showAscii
            ? isBytePrintableASCII(b)
              ? escapeHtml(String.fromCharCode(b))
              : `<code>${b < 16 ? "0" : ""}${b.toString(16)}</code>`
            : `<code>${b < 16 ? "0" : ""}${b.toString(16)}</code>`
        )
        .join("")}{/if}
  {/each}
</p>
