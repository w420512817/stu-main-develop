<template>
  <div class="card h-full">
    <div class="flex justify-between items-center">
      <div class="tit flex-shrink-0">筛查情况</div>
      <div class="flex flex-1 justify-end">
        <n-select
          v-model:value="params.screeningType"
          class="w-31%"
          value-field="screenType"
          label-field="screenTypeName"
          :options="screenTypeList"
        />
        <n-select
          v-model:value="params.planId"
          class="w-59% ml-3"
          value-field="planId"
          label-field="planName"
          :options="planList"
        />
      </div>
    </div>
    <div class="con">
      <leftTop />
      <leftMid />
      <leftBottom />
    </div>
  </div>
</template>

<script setup>
import { provide, inject, ref, watch, reactive } from 'vue';
import leftTop from './leftTop.vue';
import leftMid from './leftMid.vue';
import leftBottom from './leftBottom.vue';
import { getPlanList } from '@common/api/examine/plan';
import { unionBy } from 'lodash-es';

const scTypeNameMap = {
  1: '近视率',
  2: '患龋率',
  3: '肥胖率',
  4: '优秀率'
};
const screenTypeList = inject('screenTypeList');
const orgId = inject('orgId');
const planList = ref([]);
const params = reactive({
  screeningType: null,
  planId: null,
  scTypeName: '',
  orgId
});

provide('params', params);

async function gPlanList(init) {
  let res = await getPlanList({ current: 1, size: 50, planName: null, appType: params.screeningType });
  planList.value = unionBy(res?.records || [], 'planId');
  if (init) {
    params.planId = planList.value[0]?.planId || null;
    // params.planId = '1054304473882368';
  }
}

watch(
  screenTypeList,
  () => {
    params.screeningType = screenTypeList.value?.[0]?.screenType;
  },
  { deep: true }
);
watch(
  () => params.screeningType,
  () => {
    if (params.screeningType) {
      params.scTypeName = scTypeNameMap[params.screeningType];
      gPlanList(1);
    }
  }
);
</script>

<style lang="less" scoped></style>
