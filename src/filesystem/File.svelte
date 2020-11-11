<script lang="ts">
  import { FileIcon } from "svelte-feather-icons";
  import { filename } from "../stores";
  export let name: string;
  export let fullPath: string;

  function handleClick() {
    filename.set(fullPath);
  }
</script>

<style>
  span {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
  }
</style>

<span on:click={handleClick}>
  <FileIcon size="12" />
  {name}
</span>
