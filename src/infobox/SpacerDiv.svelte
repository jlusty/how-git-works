<script lang="ts">
  import { mousedown } from "../stores";

  export let leftFullyVisible: boolean = false;

  let spacerDiv: HTMLElement;
  let spacerDivWidth: number;
  $: if (spacerDiv && leftFullyVisible && !$mousedown) {
    spacerDivWidth = spacerDiv.clientWidth;
  }
</script>

<div
  bind:this={spacerDiv}
  style={`height: 10px; flex: 1 0 ${
    leftFullyVisible ? "auto" : `${spacerDivWidth}px`
  }`}
/>
