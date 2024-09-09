<template>
  <SubTitle is-large :sub-title="'筛查数据情况对比'" />

  <div class="expand-all overflow-hidden">
    <ScrollList :scroll-columns="state.columns" :scroll-list="state.dataList" />
  </div>
</template>

<script setup>
import { reactive, inject, watch, computed } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';

import { cariesRealTimeScreen } from '@/api/bigScreen/cavity';

const params = inject('params');
const loadingFn = inject('loadingFn');

const state = reactive({
  columns: [
    { key: 'areaName', title: '省市名称', width: '20%' },
    { key: 'screenCount', title: '实时筛查人数', width: '20%' },
    { key: 'permanentTeethScreenStdCount', title: '恒牙筛查人数', width: '20%' },
    { key: 'cariesScreenStdCount', title: '龋齿筛查人数', width: '20%' },
    { key: 'periodontalScreenStdCount', title: '牙周筛查人数', width: '20%' }
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
    const res = await cariesRealTimeScreen({ planId: params.planId, id: params.id, level: params.level });

    // console.log('mid-bottom', res);

    state.dataList = res;
  } finally {
    loadingFn(-1);
  }
}

watch([() => params.planId, () => params.level], () => {
  state.columns[0].title = `${namePrefix.value}名称`;
  getData();
});
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 1vw 0.8vw;
}
</style>
