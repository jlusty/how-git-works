<script lang="ts">
  import { absoluteFilename, gitFolder } from "../stores";

  export let id: string;
  export let hash: string;

  const fullObjectPath = (hash: string) =>
    `${$gitFolder}\\objects\\${hash.substring(0, 2)}\\${hash.substring(2)}`;

  const goToObject = (hash: string) => {
    const fullPath = fullObjectPath(hash);
    absoluteFilename.set(fullPath);
  };
</script>

<a
  {id}
  href={fullObjectPath(hash)}
  on:click|preventDefault={() => goToObject(hash)}>{hash}</a
>
