<script lang="ts">
  import FolderButton from "./loadFiles/OpenFolderButton.svelte";
  import Filesystem from "./filesystem/Filesystem.svelte";
  import Infobox from "./infobox/Infobox.svelte";
</script>

<style>
  main {
    text-align: left;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    background-color: #ffffff;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <FolderButton />
  <Filesystem />
  <Infobox />
</main>
