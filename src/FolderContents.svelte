<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFolderToFilesystem } from "./filesystem";
  import { filesystem, foldername } from "./stores.js";
  import Filesystem from "./filesystem/Filesystem.svelte";

  const unsubscribe = foldername.subscribe((value) => {
    if (value.length > 0) {
      filesystem.set(readFolderToFilesystem(value));
    }
  });

  onDestroy(unsubscribe);
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
  }
</style>

{#if $foldername.length > 0}
  <Filesystem name={$foldername} />
  <br />
{:else}
  <p>No folder opened</p>
{/if}
