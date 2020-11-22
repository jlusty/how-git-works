<script lang="ts">
  import { parseGitIndex } from "./parseIndex";
  import HyperlinkHashes from "./HyperlinkHashes.svelte";

  export let contentBuf: Buffer;

  const gitIndex = parseGitIndex(contentBuf);
</script>

<HyperlinkHashes
  textStr={`${gitIndex.headers.signature} ${gitIndex.headers.version} ${gitIndex.headers.numEntries}\n\
   ${gitIndex.entries
     .map((e) => `${e.headers.ctimeSeconds} ${e.headers.ctimeNanoSeconds} ${e.headers.mtimeSeconds} ${e.headers.mtimeNanoSeconds} ${e.headers.dev} ${e.headers.ino} ${e.headers.mode} ${e.headers.uid} ${e.headers.gid} ${e.headers.file}\
   ${e.hash} ${e.flags} ${e.filenameLength} ${e.filename}\n`)
     .join('')}\
   ${gitIndex.extensions
     .map((e) => `${e.signature} ${e.bytes.join(' ')}\n`)
     .join('')}\
   ${gitIndex.checksum}`} />
