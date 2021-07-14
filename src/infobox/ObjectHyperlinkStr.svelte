<script lang="ts">
  import { absoluteFilename, gitFolder, hash } from "../stores";

  const fullObjectPath = (hashStr: string) =>
    `${$gitFolder}\\objects\\${hashStr.substring(0, 2)}\\${hashStr.substring(
      2
    )}`;

  const goToObject = (hashStr: string) => {
    const fullPath = fullObjectPath(hashStr);
    absoluteFilename.set(fullPath);
    hash.set(undefined);
  };
</script>

{#if $hash}
  <a
    href={fullObjectPath($hash)}
    on:click|preventDefault={() => goToObject($hash)}
  >
    {$hash}
  </a>
{/if}
