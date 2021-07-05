<script lang="ts">
  import Toggle from "svelte-toggle";
  import HexViewer from "./HexViewer.svelte";

  export let binaryData: number[] = [];

  let showHex = true;
</script>

<style>
  .scrolling-box {
    overflow-y: scroll;
    height: 95%;
  }

  .button-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
    flex: 0 0 45px;
  }

  :global(.no-margin) {
    padding: 0;
    margin: 0;
  }

  .toggle-label {
    font-size: small;
    padding: 0 5px 0 20px;
  }

  .break-lines {
    white-space: pre-line;
    text-align: left;
    word-break: break-all;
  }

  .small-font {
    font-size: small;
  }
</style>

<div class="button-row">
  <p class="toggle-label">show hex:</p>
  <Toggle bind:toggled={showHex} hideLabel class="no-margin" />
</div>
<div class="scrolling-box break-lines small-font">
  {#if showHex}
    <HexViewer {binaryData} />
  {:else}
    {String.fromCharCode(...binaryData)}
  {/if}
</div>
