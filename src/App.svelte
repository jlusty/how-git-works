<script lang="ts">
  import FolderButton from "./loadFiles/OpenFolderButton.svelte";
  import Filesystem from "./filesystem/Filesystem.svelte";
  import Infobox from "./infobox/Infobox.svelte";
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

  .column {
    display: flex;
    flex-direction: column;
    padding-left: 5%;
    width: 60%;
  }

  .filesSelector {
    display: flex;
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
