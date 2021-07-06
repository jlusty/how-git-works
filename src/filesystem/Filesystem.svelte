<script lang="ts">
  import { onDestroy } from "svelte";
  import { readFolderToFilesystem } from "./filesystem";
  import { filesystem, openFolder } from "../stores";
  import Folder from "./Folder.svelte";

  const unsubscribe = openFolder.subscribe((value) => {
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
    flex: 1 1 auto;
    overflow-x: auto;
    height: 0;
  }
</style>

{#if $openFolder.length > 0}
  <div class="scrolling-box">
    <Folder name={$openFolder} files={$filesystem} expanded />
    <br />
  </div>
{:else}
  <p>No folder opened</p>
{/if}
