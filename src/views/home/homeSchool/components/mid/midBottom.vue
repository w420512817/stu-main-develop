<template>
  <div class="card mt-16px flex-1">
    <div class="flex justify-between items-center">
      <div class="tit flex-shrink-0">排行榜</div>
      <div class="flex flex-1-hidden">
        <n-select
          v-model:value="params.screeningType"
          class="w-30% ml-2%"
          :options="screenTypeList"
          value-field="screenType"
          label-field="screenTypeName"
        />
        <n-select
          v-model:value="params.planId"
          value-field="planId"
          label-field="planName"
          class="w-40% mx-2%"
          :options="planList"
        />
        <n-select v-model:value="params.columnType" class="w-30%" :options="optType" />
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
      :columns="columnsRef"
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
import { rank } from '@/api/dashbord/school';
import { useUserStore } from '@/store';
import { unionBy } from 'lodash-es';

const {
  userInfo: { orgId }
} = useUserStore();
const screenTypeList = inject('screenTypeList');
const optType = [
  { label: '年级', value: 1 },
  { label: '班级', value: 2 }
];
const params = reactive({
  columnType: 1
});
const planList = ref([]);
const dataList = ref([]);
const columnsRef = ref(columns);

async function gPlanList(init) {
  let res = await getPlanList({ current: 1, size: 50, planName: null, appType: params.screeningType });
  planList.value = unionBy(res?.records || [], 'planId');
  if (init) {
    params.planId = planList.value[0]?.planId || null;
  }
}

async function getRank() {
  let res = await rank({ ...params, orgId });
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

watch([() => params.planId, () => params.columnType], () => {
  if (params.planId && params.columnType) {
    getRank();
  }
  columnsRef.value[1].title = optType.find(item => item.value == params.columnType)?.label || '年级';
});
</script>

<style lang="less" scoped></style>
