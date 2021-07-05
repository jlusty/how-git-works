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
    display: flex;
    width: 100%;
  }

  .select-text-disabled {
    user-select: none;
  }

  .resizeBar {
    background-color: grey;
    cursor: w-resize;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }
</style>

<div
  on:mousemove={handleMousemove}
  on:mouseup={handleMouseup}
  class={`resizeParent ${mousedown ? "select-text-disabled" : ""}`}
>
  <div
    class="column"
    style="flex: 0 0 {leftSlotWidth}px; width: {leftSlotWidth}px;"
  >
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
