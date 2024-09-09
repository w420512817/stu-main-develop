<template>
  <SubTitle is-large :sub-title="'实时体测数据展示'" />

  <div class="expand-all overflow-hidden">
    <ScrollList :scroll-columns="state.columns" :scroll-list="state.dataList" />
  </div>
</template>

<script setup>
import { reactive, inject, watch, computed } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';

import { realTimeData } from '@/api/bigScreen/phyTest';

const params = inject('params');
const loadingFn = inject('loadingFn');

const state = reactive({
  columns: [
    { key: 'areaName', title: '省市名称', width: '18%' },
    { key: 'stdCount', title: '实时筛查人数', width: '16%' },
    { key: 'bmiCount', title: 'BMI人数', width: '14%' },
    { key: 'vcCount', title: '肺活量人数', width: '16%' },
    { key: 'stfCount', title: '坐位体前屈人数', width: '20%' },
    { key: 'fiftyCount', title: '50m跑人数', width: '16%' }
  ],
  dataList: []
});

const namePrefix = computed(() => {
  let nameMap = {
    1: '省市',
    2: '区县',
    3: '学校'
  };
  return nameMap[params.level];
});

async function getData() {
  try {
    loadingFn(1);
    const res = await realTimeData({ planId: params.planId, id: params.id, level: params.level });
    // console.log('mid-bottom', res);
    state.dataList = res;
  } finally {
    loadingFn(-1);
  }
}

watch(
  () => params.planId,
  () => {
    getData();
  }
);

watch(
  () => params.level,
  () => {
    state.columns[0].title = `${namePrefix.value}名称`;
    getData();
  }
);
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 1vw 0.8vw;
}
</style>
