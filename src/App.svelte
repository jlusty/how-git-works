<script lang="ts">
  import FolderButton from "./loadFiles/OpenFolderButton.svelte";
  import Filesystem from "./filesystem/Filesystem.svelte";
  import Infobox from "./infobox/Infobox.svelte";
  import ResizableSplit from "./ResizableSplit.svelte";
  import { mousedown } from "./stores";

  const handleMousedown = () => {
    mousedown.set(true);
  };
  const handleMouseup = () => {
    mousedown.set(false);
  };
</script>

<style>
  main {
    text-align: left;
    padding: 15px;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    width: 95%;
    height: 95%;
  }

  .filesSelector {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .infoBox {
    padding-left: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

<main on:mousedown={handleMousedown} on:mouseup={handleMouseup}>
  <ResizableSplit>
    <div class="filesSelector" slot="left">
      <FolderButton />
      <Filesystem />
    </div>
    <div class="infoBox" slot="right">
      <Infobox />
    </div>
  </ResizableSplit>
</main>
