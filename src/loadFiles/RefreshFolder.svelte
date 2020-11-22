<script lang="ts">
  import { RefreshCwIcon } from "svelte-feather-icons";
  import { foldername } from "../stores";

  const handleClick = () => {
    const currentFoler = $foldername;
    foldername.set("");
    foldername.set(currentFoler);
  };
</script>

<style>
  button {
    width: 100%;
  }
</style>

<button on:click={handleClick}><RefreshCwIcon size="14" /></button>
