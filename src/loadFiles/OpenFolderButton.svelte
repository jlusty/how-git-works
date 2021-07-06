<script lang="ts">
  import { ipcRenderer } from "electron";
  import { openFolder } from "../stores";
  import RefreshFolder from "./RefreshFolder.svelte";

  const handleClick = () => {
    ipcRenderer.send("open-folder");
  };

  ipcRenderer.on("folder-opened", (_event, arg) => {
    openFolder.set(arg);
  });
</script>

<style>
  .button-row {
    width: 95%;
    display: flex;
  }

  .open-folder-button {
    flex: 0 0 80%;
  }
</style>

<div class="button-row">
  <button on:click={handleClick} class="open-folder-button"
    >Open a folder</button
  >
  <RefreshFolder />
</div>
<p>{$openFolder}</p>
