<script lang="ts">
  import { parseGitTree } from "./parseTree";
  import HyperlinkHashes from "../infobox/HyperlinkHashes.svelte";

  export let zlibBuf: Buffer;

  const gitTree = parseGitTree(zlibBuf);
</script>

<HyperlinkHashes
  bytes={[
    ...`${gitTree.name} ${gitTree.length}\n${gitTree.files
      .map((f) => `${f.type} ${f.name} ${f.hash}\n`)
      .join("")}`,
  ].map((c) => c.charCodeAt(0))}
/>
