<script lang="ts">
  import { FolderPlusIcon, FolderMinusIcon } from "svelte-feather-icons";
  import type { FileSystemStruct } from "./filesystem";
  import File from "./File.svelte";
  export let expanded = false;
  export let name: string;
  export let files: FileSystemStruct;
  function toggle() {
    expanded = !expanded;
  }
</script>

<style>
  span {
    display: flex;
    padding: 0 0 0 1.5em;
    font-weight: bold;
    cursor: pointer;
  }
  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }
  li {
    padding: 0.2em 0;
  }
  .padded {
    padding: 0px 15px;
  }
</style>

<span on:click={toggle}>
  <div class="padded">
    {#if expanded}
      <FolderMinusIcon size="14" />
    {:else}
      <FolderPlusIcon size="14" />
    {/if}
  </div>
  {name}
</span>

{#if expanded}
  <ul>
    {#each files as file}
      <li>
        {#if file.type === 'folder'}
          <svelte:self {...file} />
        {:else}
          <File {...file} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}
