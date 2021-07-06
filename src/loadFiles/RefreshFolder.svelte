<script lang="ts">
  import { RefreshCwIcon } from "svelte-feather-icons";
  import { openFolder } from "../stores";

  const handleClick = () => {
    const currentFolder = $openFolder;
    openFolder.set("");
    openFolder.set(currentFolder);
  };
</script>

<style>
  button {
    width: 100%;
  }
</style>

<button on:click={handleClick}><RefreshCwIcon size="14" /></button>
