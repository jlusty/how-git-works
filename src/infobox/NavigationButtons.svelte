<script lang="ts">
  import { filename, fileHistory } from "../stores";

  let goingBack = false;
  let goingForward = false;

  filename.subscribe((value) => {
    console.log(JSON.stringify($fileHistory));
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
    width: 50px;
  }
</style>

<button on:click={handleBackClick}>Back</button>
<button on:click={handleForwardClick}>Forward</button>
