<template>
  <div :class="['sub-title', { 'sub-title-large': isLarge }]">{{ subTitle }}</div>
</template>

<script setup>
import { string, bool } from 'vue-types';

defineProps({
  subTitle: string().def(''),
  isLarge: bool().def(false)
});
</script>

<style lang="less" scoped>
.sub-title {
  width: 100%;
  height: 2.8vw;
  box-sizing: border-box;
  padding-left: 3vw;
  line-height: 2.8vw;

  background-image: url('@/assets/image/bigScreen/sub-title.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -0.6vw -0.45vw;

  font-size: 20px;
  font-family: YouSheBiaoTiHei;
  color: #e3f7ff;
  letter-spacing: 1px;
  text-shadow: 0px 2px 8px rgba(0, 9, 25, 0.66), 0px 0px 2px rgba(0, 180, 255, 0.25);
}

.sub-title-large {
  padding-left: 3vw;
  line-height: 2.4vw;

  background-image: url('@/assets/image/bigScreen/sub-title-large.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -0.6vw -0.45vw;
}
</style>
