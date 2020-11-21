<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFolderToFilesystem } from "./filesystem";
  import { filesystem, foldername } from "../stores";
  import Folder from "./Folder.svelte";

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

  .scrolling-box {
    overflow-y: scroll;
    height: 95%;
    overflow-x: auto;
  }
</style>

{#if $foldername.length > 0}
  <div class="scrolling-box">
    <Folder name={$foldername} files={$filesystem} expanded />
    <br />
  </div>
{:else}
  <p>No folder opened</p>
{/if}
