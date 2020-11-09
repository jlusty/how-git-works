<script>
  import { ipcRenderer } from "electron";
  import { filename } from "./stores";

  const handleClick = () => {
    ipcRenderer.send("test-message");
  };

  ipcRenderer.on("asynchronous-filename-reply", (event, arg) => {
    filename.set(arg);
  });
</script>

<button on:click={handleClick}>Open a file</button>
<p>{$filename}</p>
