<script>
  import { ipcRenderer } from "electron";
  import { foldername } from "./stores";

  const handleClick = () => {
    ipcRenderer.send("open-folder");
  };

  ipcRenderer.on("folder-opened", (event, arg) => {
    foldername.set(arg);
  });
</script>

<button on:click={handleClick}>Open a folder</button>
<p>{$foldername}</p>
