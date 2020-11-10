<script>
  import { ipcRenderer } from "electron";
  import { filename } from "./stores";

  const handleClick = () => {
    ipcRenderer.send("open-file");
  };

  ipcRenderer.on("file-opened", (event, arg) => {
    filename.set(arg);
  });
</script>

<button on:click={handleClick}>Open a file</button>
<p>{$filename}</p>
