<template>
  <div class="card mt-16px flex-1">
    <div class="flex justify-between items-center">
      <div class="tit flex-shrink-0">排行榜</div>
      <div class="flex flex-1 justify-end">
        <n-select
          v-model:value="params.screeningType"
          class="w-30% ml-3"
          :options="screenTypeList"
          value-field="screenType"
          label-field="screenTypeName"
        />
        <n-select
          v-model:value="params.planId"
          value-field="planId"
          label-field="planName"
          class="w-55% ml-3"
          :options="planList"
        />
      </div>
    </div>
    <n-data-table
      class="cusTable mt-15px"
      style="
        --n-th-padding: 10px 12px;
        --n-th-font-weight: bold;
        --n-th-text-color: #222;
        --n-td-padding: 10px;
        --n-td-text-color: #222;
      "
      :columns="columns"
      :data="dataList"
      :bordered="false"
      max-height="200px"
    />
  </div>
</template>

<script setup>
import { ref, reactive, inject, watch } from 'vue';
import { columns } from '../../index.data';
import { getPlanList } from '@common/api/examine/plan';
import { rank } from '@/api/dashbord/hosptial';
import { useUserStore } from '@/store';
import { unionBy } from 'lodash-es';

const {
  userInfo: { orgId }
} = useUserStore();
const screenTypeList = inject('screenTypeList');
const params = reactive({});
const planList = ref([]);
const dataList = ref([]);

async function gPlanList(init) {
  let res = await getPlanList({ current: 1, size: 50, planName: null, appType: params.screeningType });
  planList.value = unionBy(res?.records || [], 'planId');
  if (init) {
    params.planId = planList.value[0]?.planId || null;
  }
}

async function getRank() {
  let res = await rank({ ...params, orgId, scTypeName: undefined });
  dataList.value = res;
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
      gPlanList(1);
    }
  }
);

watch(
  () => params.planId,
  () => {
    params.planId && getRank();
  }
);
</script>

<style lang="less" scoped></style>
