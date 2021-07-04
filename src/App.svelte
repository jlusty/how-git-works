<script lang="ts">
  import FolderButton from "./loadFiles/OpenFolderButton.svelte";
  import Filesystem from "./filesystem/Filesystem.svelte";
  import Infobox from "./infobox/Infobox.svelte";
  import ResizableSplit from "./ResizableSplit.svelte";
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
    height: 100%;
  }
</style>

<main>
  <ResizableSplit>
    <div class="filesSelector" slot="left">
      <FolderButton />
      <Filesystem />
    </div>
    <Infobox slot="right" />
  </ResizableSplit>
</main>
