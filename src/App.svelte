<script lang="ts">
  import FilesButton from "./FilesButton.svelte";
  import FolderButton from "./FolderButton.svelte";
  import FileContents from "./FileContents.svelte";
  import FolderContents from "./FolderContents.svelte";
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
  <FolderContents />
  <FileContents />
</main>
