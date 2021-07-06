<script lang="ts">
  import { FileIcon } from "svelte-feather-icons";
  import { absoluteFilename } from "../stores";

  export let name: string;
  export let fullPath: string;

  function handleClick() {
    absoluteFilename.set(fullPath);
  }

  let hovering = false;

  function enter() {
    hovering = true;
  }
  function leave() {
    hovering = false;
  }
</script>

<style>
  span {
    display: flex;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
    cursor: pointer;
  }
  .padded-icon {
    padding-right: 15px;
  }
  .active {
    background-color: lightblue;
  }
</style>

<span
  on:click={handleClick}
  class:active={hovering}
  on:mouseenter={enter}
  on:mouseleave={leave}
>
  <div class="padded-icon">
    <FileIcon size="12" />
  </div>
  {name}
</span>
