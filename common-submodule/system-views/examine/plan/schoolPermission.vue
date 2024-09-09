<template>
  <n-card title="权限设置" class="h-full shadow-sm">
    <n-form label-placement="left" inline @keypress.enter="handleSearch">
      <n-form-item class="!w-300px" label="地区">
        <n-cascader
          v-model:value="formValue.areaRange"
          clearable
          placeholder="请选择"
          expand-trigger="hover"
          value-field="regionId"
          label-field="regionName"
          :options="state.areaList"
          check-strategy="parent"
          :show-path="false"
        />
      </n-form-item>
      <n-form-item class="!w-300px" label="选择学段">
        <n-select v-model:value="formValue.prefix" clearable :options="prefixList" />
      </n-form-item>
      <n-form-item class="!w-300px" label="是否可筛">
        <n-select v-model:value="formValue.siftable" clearable :options="siftableList" />
      </n-form-item>
      <n-form-item class="!w-300px" label="学校名称">
        <n-input v-model:value="formValue.orgName" clearable />
      </n-form-item>
      <n-button type="primary" @click="handleSearch">查询</n-button>
    </n-form>
    <!-- <n-button type="primary" class="m-r-10" @click="handleTableClick(AC_ADD)">筛查权限控制</n-button> -->
    <n-space>
      <n-button v-auth="[9011, 9059, 9107, 9155]" type="primary" @click="handleTableClick('permission_all')"
        >筛查权限控制-全体学校</n-button
      >
      <n-button v-auth="[9011, 9059, 9107, 9155]" type="primary" @click="handleTableClick('permission_some')"
        >筛查权限控制</n-button
      >
    </n-space>
    <!-- :scroll-x="1500" -->
    <n-data-table
      v-model:checked-row-keys="selectItem.rowKeys"
      remote
      striped
      :render-cell="v => v ?? '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
      :row-key="row => row.id"
      @update:checked-row-keys="handleCheck"
    />
    <permissionModal
      title="权限设置"
      :use-data="state.useData"
      :is-edit="false"
      @add-success="getDataSource"
      @register="registerPermission"
    />
  </n-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';

import permissionModal from './components/permissionModal.vue';

import { schoolListByJurisdiction, planArea, getPlanJurisdiction } from '@common/api/examine/plan';

import { createPermissionColumns } from './index.data';
import { useRoute } from 'vue-router';
const { query } = useRoute();
defineOptions({ name: 'TaskList' });
let state = reactive({
  useData: {},
  planId: '',
  areaList: []
});
state.planId = query.planId;
const { fetch: getListApi, loading } = useApi(schoolListByJurisdiction);
const [registerPermission, { openModal }] = useModal();

// const {
//   userInfo: { orgId }
// } = useUserStore();

const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

const columns = createPermissionColumns({ handleTableClick });
const dataSource = ref([]);
const prefixList = [
  { label: '幼儿园', value: '1' },
  { label: '小学', value: '2' },
  { label: '初中', value: '3' },
  { label: '职高', value: '5' },
  { label: '大专', value: '6' },
  { label: '本科', value: '7' }
];
const siftableList = [
  { label: '否', value: '0' },
  { label: '是', value: '1' }
];
const formValue = reactive({
  areaRange: null,
  prefix: null,
  siftable: null,
  orgName: ''
});
const selectItem = reactive({
  rowKeys: []
});
// const appsList = ref([]);

async function getDataSource() {
  const { page: pageNum, pageSize } = pagination;
  const { ...info } = formValue;
  let provinceId = formValue.areaRange && formValue.areaRange.substring(2, 6) == '0000' ? formValue.areaRange : '';
  let cityId =
    formValue.areaRange && formValue.areaRange.substring(4, 6) == '00' && formValue.areaRange.substring(2, 4) != '00'
      ? formValue.areaRange
      : '';
  let regionId = formValue.areaRange && formValue.areaRange.substring(4, 6) != '00' ? formValue.areaRange : '';
  const params = {
    ...info,
    pageNum,
    pageSize,
    provinceId,
    cityId,
    regionId,
    planId: state.planId
    // planId: '963798612147968'
  };
  const data = await getListApi(params);

  dataSource.value = data?.records ?? [];
  setCount(+data.total);
}

function getAllPermision() {
  getPlanJurisdiction({
    planId: state.planId
  }).then(() => {});
}
getAllPermision();
// const getAppsList = async () => {
//   appsList.value = await getApplicationList({ orgId });
// };

onMounted(() => {
  // getAppsList();
  getDataSource();
});

function handleSearch() {
  selectItem.rowKeys = [];
  setPage(1);
  getDataSource();
}
function handleCheck(e) {
  console.log(e);
  selectItem.rowKeys = e;
}
function handleTableClick(key, row = {}) {
  state.useData = row;
  switch (key) {
    case 'permission':
      openModal();
      break;
    case 'permission_all':
      state.useData = { planId: state.planId };
      openModal();
      break;
    case 'permission_some':
      if (!selectItem.rowKeys[0]) {
        window.$message.warning('请选择学校');
      } else {
        let arr = [];
        dataSource.value.forEach(v => {
          selectItem.rowKeys.forEach(vv => {
            if (v.id == vv) {
              arr = arr.concat(v.prefix.split(','));
            }
          });
        });
        let uniqueArr = Array.from(new Set(arr));
        state.useData = { rowKeys: [...selectItem.rowKeys], prefix: uniqueArr.join(',') };
        openModal();
      }
      break;
  }
}

// function onReset() {
//   setPage(1);
//   Object.assign(formValue);
//   getDataSource();
// }

const getAreaList = async () => {
  let d = await planArea();
  state.areaList = [d];
};
getAreaList();
</script>
<style scoped></style>
