<script lang="ts">
  import { FileIcon } from "svelte-feather-icons";
  import { filename } from "../stores";
  export let name: string;
  export let fullPath: string;

  function handleClick() {
    filename.set(fullPath);
  }
</script>

<style>
  span {
    display: flex;
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
  }
  .padded {
    padding: 0px 15px;
  }
</style>

<span on:click={handleClick}>
  <div class="padded">
    <FileIcon size="12" />
  </div>
  {name}
</span>
