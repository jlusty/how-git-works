<script lang="ts">
  import type { GitTree } from "./tree";
  import HyperlinkHashes from "./HyperlinkHashes.svelte";

  export let textStr: string = "";
  export let gitTree: GitTree;
</script>

<style>
  p {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }
</style>

{#if textStr !== ''}
  <HyperlinkHashes {textStr} />
{:else if gitTree}
  <HyperlinkHashes
    textStr={`${gitTree.name} ${gitTree.length}\n${gitTree.files
      .map((f) => `${f.type} ${f.name} ${f.hash}\n`)
      .join('')}`} />
{:else}
  <p />
{/if}
