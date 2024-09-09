<template>
  <SubTitle is-large :sub-title="'预警总览'" />

  <div class="expand-all overflow-hidden">
    <ScrollList :scroll-columns="state.columns" :scroll-list="state.dataList" />
  </div>
</template>

<script setup>
import { reactive, inject, watch, onMounted } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';

import { getAreaWarningNumVO } from '@/api/bigScreen/synthesize';

const params = inject('params');

const state = reactive({
  columns: [
    { key: 'warningName', title: '预警名称', width: '25%' },
    { key: 'warningArea', title: '预警地址', width: '25%' },
    { key: 'warningTypeName', title: '预警类型', width: '30%' },
    { key: 'warningNum', title: '预警人数', width: '20%' }
  ],
  dataList: []
});

async function getData() {
  const res = await getAreaWarningNumVO({ planId: params.planId, id: params.id, level: params.level });

  // console.log('left-bottom', res);

  state.dataList = res;
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
  padding: 0 0.8vw 1vw 0.8vw;
}
</style>
