<script lang="ts">
  import { FileIcon } from "svelte-feather-icons";
  export let name: string;
</script>

<style>
  span {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
  }
</style>

<FileIcon size="12" />
<span>{name}</span>
