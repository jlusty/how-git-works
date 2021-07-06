<script lang="ts">
  import { absoluteFilename, gitFolder } from "../stores";

  export let hash: number[];

  const fullObjectPath = (hashBytes: number[]) =>
    `${$gitFolder}\\objects\\${String.fromCharCode(
      ...hashBytes.slice(0, 2)
    )}\\${String.fromCharCode(...hashBytes.slice(2))}`;

  const goToObject = (hashBytes: number[]) => {
    const fullPath = fullObjectPath(hashBytes);
    absoluteFilename.set(fullPath);
  };
</script>

<a href={fullObjectPath(hash)} on:click|preventDefault={() => goToObject(hash)}
  >{String.fromCharCode(...hash)}</a
>
