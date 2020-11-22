<script lang="ts">
  import { parseGitTree } from "./tree";
  import HyperlinkHashes from "./HyperlinkHashes.svelte";

  export let zlibBuf: Buffer;

  const gitTree = parseGitTree(zlibBuf);
</script>

<HyperlinkHashes
  textStr={`${gitTree.name} ${gitTree.length}\n${gitTree.files
    .map((f) => `${f.type} ${f.name} ${f.hash}\n`)
    .join('')}`} />
