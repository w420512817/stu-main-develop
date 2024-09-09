<template>
  <slot :data="data"></slot>
</template>

<script setup>
import { watch, ref, inject } from 'vue';

import { unusualAgeCondition } from '@/api/bigScreen/spine';
import { numToPercent } from '@common/utils/common';

const params = inject('params');

const data = ref({
  spinalHealthNum: 0, // 脊柱健康人数
  spinalUnHealthNum: '', // 脊柱异常人数
  spinalHealthRate: 0, // 脊柱正常比例
  unusualAgeVOS: [] // 年龄分布
});

async function getUnusualAgeCondition() {
  let res = await unusualAgeCondition(params);
  res.spinalUnHealthRate = numToPercent(res.spinalUnHealthRate);
  res.spinalHealthRate = numToPercent(res.spinalHealthRate);
  data.value = res;
}

watch(params, () => {
  params.planId && getUnusualAgeCondition();
});
</script>

<style lang="less" scoped>
.chart {
  width: 9vh;
  height: 9vh;
}
</style>
