<script lang="ts">
  export let resizeBarWidth = 4;

  // Expose width of left box (in px)
  export let onWidthChange = (px: number) => {};
  export let leftSlotWidth = 250;
  export let minLeftSlotWidth = 0;

  $: onWidthChange(leftSlotWidth);

  // Handle resizing
  let staticLeftSlotWidth = leftSlotWidth;
  let resizeStartX: number;
  let mousedown = false;

  const handleMousedown = (event: MouseEvent) => {
    mousedown = true;
    resizeStartX = event.clientX;
  };
  const handleMouseup = () => {
    mousedown = false;
    staticLeftSlotWidth = leftSlotWidth;
  };

  const handleMousemove = (event: MouseEvent) => {
    if (mousedown) {
      leftSlotWidth = Math.max(
        staticLeftSlotWidth + (event.clientX - resizeStartX),
        minLeftSlotWidth
      );
    }
  };
</script>

<style>
  .resizeParent {
    text-align: left;
    padding: 15px;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    width: 95%;
    height: 95%;
  }

  .select-text-disabled {
    user-select: none;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .resizeBar {
    background-color: grey;
    height: 100%;
    cursor: w-resize;
  }
</style>

<div
  on:mousemove={handleMousemove}
  on:mouseup={handleMouseup}
  class={`resizeParent ${mousedown ? "select-text-disabled" : ""}`}
>
  <div style="flex: 0 0 {leftSlotWidth}px; width: {leftSlotWidth}px;">
    <slot name="left" />
  </div>
  <div
    class="resizeBar"
    style="flex: 0 0 {resizeBarWidth}px;"
    on:mousedown={handleMousedown}
  />
  <div class="column">
    <slot name="right" />
  </div>
</div>
