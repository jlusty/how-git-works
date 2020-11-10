<script lang="ts">
  import { filesystem } from "../stores.js";
  import Folder from "./Folder.svelte";

  export let name: string;
</script>

<Folder {name} files={$filesystem} expanded />
