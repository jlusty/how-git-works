<script lang="ts">
  import { ArrowLeftIcon, ArrowRightIcon } from "svelte-feather-icons";
  import { filename, fileHistory } from "../stores";

  let goingBack = false;
  let goingForward = false;

  filename.subscribe((value) => {
    if (goingBack) {
      fileHistory.update((fh) => ({ ...fh, position: fh.position - 1 }));
      goingBack = false;
    } else if (goingForward) {
      fileHistory.update((fh) => ({ ...fh, position: fh.position + 1 }));
      goingForward = false;
    } else {
      if (filename) {
        fileHistory.update((fh) => ({
          history: [...fh.history.slice(0, fh.position + 1), value],
          position: fh.position + 1,
        }));
      }
    }
  });

  const handleBackClick = () => {
    if ($fileHistory.position > 0) {
      goingBack = true;
      filename.set($fileHistory.history[$fileHistory.position - 1]);
    }
  };

  const handleForwardClick = () => {
    if ($fileHistory.position < $fileHistory.history.length - 1) {
      goingForward = true;
      filename.set($fileHistory.history[$fileHistory.position + 1]);
    }
  };
</script>

<style>
  button {
    width: 40px;
    margin: 0;
  }
</style>

<div>
  <button
    on:click={handleBackClick}
    disabled={$fileHistory.position === 0}><ArrowLeftIcon size="14" /></button>
  <button
    on:click={handleForwardClick}
    disabled={$fileHistory.position === $fileHistory.history.length - 1}><ArrowRightIcon
      size="14" /></button>
</div>
