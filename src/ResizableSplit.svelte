<script lang="ts">
  let staticBoxWidth = 250;
  let dynamicBoxWidth = staticBoxWidth;
  let resizeStartX: number;
  let mousedown = false;

  const handleMousedown = (event: MouseEvent) => {
    mousedown = true;
    resizeStartX = event.clientX;
  };
  const handleMouseup = () => {
    mousedown = false;
    staticBoxWidth = dynamicBoxWidth;
  };

  const handleMousemove = (event: MouseEvent) => {
    if (mousedown) {
      dynamicBoxWidth = staticBoxWidth + (event.clientX - resizeStartX);
    }
  };
</script>

<style>
  main {
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
    padding-left: 50px;
    flex: 1;
  }

  .resizeBar {
    background-color: grey;
    height: 100%;
    cursor: w-resize;
    flex: 0 0 4px;
  }
</style>

<main
  on:mousemove={handleMousemove}
  on:mouseup={handleMouseup}
  class={mousedown ? "select-text-disabled" : ""}
>
  <div style="flex: 0 0 {dynamicBoxWidth}px; width: {dynamicBoxWidth}px;">
    <slot name="left" />
  </div>
  <div class="resizeBar" on:mousedown={handleMousedown} />
  <div class="column">
    <slot name="right" />
  </div>
</main>
