<template>
  <div>
    <!-- <n-button strong secondary type="info" style="margin-left: 12px"> {{ score }}分 </n-button> -->
    <div class="button">分数：{{ score }}</div>
  </div>
</template>

<script setup>
import { string } from 'vue-types';
defineProps({
  score: string().def('0')
});
</script>

<style lang="less" scoped>
.button {
  padding: 5px 12px;
  background: rgba(62, 158, 255, 0.15);
  border-radius: 24px;
  font-size: 14px;
  color: #3e9eff;
  margin: 0 8px;
}
</style>
