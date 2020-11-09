<script>
  import { ipcRenderer } from "electron";

  let filename = "";
  const handleClick = () => {
    ipcRenderer.send("test-message");
  };

  ipcRenderer.on("asynchronous-filename-reply", (event, arg) => {
    console.log(arg);
    filename = arg;
  });
</script>

<button on:click={handleClick}>Open a file</button>
<p>{filename}</p>
