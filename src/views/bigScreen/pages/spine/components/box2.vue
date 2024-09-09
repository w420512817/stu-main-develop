<template>
  <div class="b1 inline-block">
    <div class="b2">
      <div class="bor"></div>
      <div class="wh-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.b1 {
  border: 2px solid #073a61;
  border-radius: 50%;
  padding: 0.5vw;

  .b2 {
    padding: 0.5vw;
    position: relative;
  }
  .bor {
    animation: rotate 50s linear infinite;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px dashed #146197;
    position: absolute;
    left: 0;
    top: 0;
  }
}
@keyframes rotate {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
