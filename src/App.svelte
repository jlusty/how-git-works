<script lang="ts">
  import FolderButton from "./loadFiles/OpenFolderButton.svelte";
  import Filesystem from "./filesystem/Filesystem.svelte";
  import Infobox from "./infobox/Infobox.svelte";
</script>

<style>
  main {
    text-align: left;
    padding: 1em;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
  }

  .column {
    flex-direction: column;
  }

  .filesSelector {
    flex-direction: column;
    width: 35%;
  }
</style>

<main>
  <div class="filesSelector">
    <FolderButton />
    <Filesystem />
  </div>
  <div class="column">
    <Infobox />
  </div>
</main>
