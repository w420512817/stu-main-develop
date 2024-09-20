<template>
  <SubTitle :sub-title="'远视储备情况'" />
  <div class="expand-all overflow-hidden">
    <lineC :data="sourceList" :unit="unit" />
  </div>
</template>

<script setup>
import { inject, watch, ref } from 'vue';
import { hyperopiaRate } from '@/api/bigScreen/vision';
import lineC from '@/views/bigScreen/component/lineC.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';

const unit = '%';
const params = inject('params');
const loadingFn = inject('loadingFn');

const sourceList = ref([
  { n: '小班', v: 0 },
  { n: '中班', v: 0 },
  { n: '大班', v: 0 }
]);

async function getData() {
  try {
    loadingFn(1);
    const res = await hyperopiaRate({ planId: params.planId, areaId: params.id });

    sourceList.value = res?.map(item => {
      return {
        v: numToPercent(item.hyperopiaRate),
        n: item.gradeName
      };
    });
  } finally {
    loadingFn(-1);
  }
}

watch([() => params.planId, () => params.level], () => {
  getData();
});
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 0.8vw 0.8vw;
}
</style>
