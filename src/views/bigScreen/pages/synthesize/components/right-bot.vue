<template>
  <SubTitle :sub-title="'筛查数据情况对比'" />
  <div class="expand-all overflow-hidden">
    <ScrollList :scroll-columns="state.columns" :scroll-list="state.dataList" />
  </div>
</template>

<script setup>
import { reactive, watch, inject, onMounted } from 'vue';

import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';
import { screenSituation } from '@/api/bigScreen/synthesize';

const params = inject('params');

const state = reactive({
  columns: [
    { key: 'firstName', title: '数据类目', width: '33.3%' },
    { key: 'secondName', title: '数据类目', width: '33.3%' },
    { key: 'studentCount', title: '重合学生数', width: '33.3%' }
  ],
  dataList: []
});

async function getData() {
  const res = await screenSituation({ planId: '', id: params.id, level: params.level });

  // console.log('right-bottom', res);

  state.dataList = res.map(i => {
    return {
      ...i,
      studentCount: i.studentCount || 0
    };
  });
}

onMounted(() => {
  getData();
});

watch(
  () => params.level,
  () => {
    getData();
  }
);
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 0.8vw 0.8vw;
}
</style>
