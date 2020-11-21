<script lang="ts">
  import type { GitTree } from "./decodeGit";
  import { foldername, filename } from "../stores";

  export let textStr: string = "";
  export let gitTree: GitTree;

  const goToObject = (hash: string) => {
    const fullPath = `${$foldername}\\objects\\${hash.substr(
      0,
      2
    )}\\${hash.substr(2)}`;
    filename.set(fullPath);
  };
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }
</style>

{#if textStr !== ''}
  <p>{textStr}</p>
{:else if gitTree}
  <p>
    {gitTree.name}
    {gitTree.length}{'\n'}
    {#each gitTree.files as f}
      {`${f.type} ${f.name} `}<a
        href="#"
        on:click={() => goToObject(f.hash)}>{f.hash}</a>{'\n'}
    {/each}
  </p>
{:else}
  <p />
{/if}
