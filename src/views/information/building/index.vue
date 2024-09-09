<template>
  <n-card class="h-full shadow-sm" title="教学楼信息">
    <n-form class="w-full" inline label-placement="left" @keypress.enter="onSearch">
      <n-grid cols="2 lg:4" :x-gap="20" responsive="screen">
        <n-form-item-gi v-if="orgProperty == 3" label="学校名称:">
          <dropdown-select
            ref="schoolRef"
            v-model:value="formValue.schoolId"
            :list-api="schoolSelectBox"
            keyword="name"
            label-field="orgName"
            value-field="id"
            filterable
            clearable
            placeholder="请选择学校"
          />
        </n-form-item-gi>
        <n-form-item-gi label="教学楼名称:">
          <n-input v-model:value="formValue.buildingName" type="text" placeholder="请输入教学楼名称" clearable />
        </n-form-item-gi>
        <n-form-item-gi>
          <n-button type="primary" @click="onSearch">查询</n-button>
          <n-button v-auth="9308" type="primary" class="ml-3" @click="openImportModel">导入</n-button>
          <n-button v-auth="9309" type="primary" class="ml-3" @click="onExport">导出</n-button>
          <n-button v-auth="9310" type="primary" class="ml-3" @click="openAddModel">新增</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-button v-if="orgProperty != 3" type="primary" mb-3 @click="jumpSchoolDetail">学校信息</n-button>
    <n-data-table
      remote
      :render-cell="v => v || '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
    <addModal @register="registerAddModal" @on-success="onSearch" />
    <syncImportModal
      type="build"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, { ...data, orgName })"
    />
    <syncImportResult type="build" @register="registerResultModal" @on-success="onSearch" />
  </n-card>
</template>
<script setup>
import { onMounted, ref, reactive, nextTick, toRaw } from 'vue';
import { useThrottleFn } from '@vueuse/core';

import { useUserStore } from '@/store';

// hooks
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useGo } from '@common/hooks/usePage';
// static data
import { AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';
// api
import { getBuildingList, deleteBuilding, exportExcelList } from '@/api/information/building';
import { schoolSelectBox } from '@/api/information';

import addModal from './components/addModal.vue';
import syncImportModal from '../components/syncImportModal.vue';
import syncImportResult from '../components/syncImportResult.vue';

import { createColumns } from './building.data';
import { downloadFile } from '@common/utils/file/download';

const origin = {
  buildingName: null,
  schoolId: null
};

const {
  userInfo: { orgId, orgProperty, orgName }
} = useUserStore();
const { go } = useGo();

const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolRef = ref();
const columns = createColumns((key, row) => onClickBtn(key, row));
const [registerAddModal, { openModal: openAddModel }] = useModal();
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();
const { fetch: getList, loading } = useApi(getBuildingList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

const updateSchool = async () => {
  await nextTick();
  schoolRef.value && schoolRef.value.getOptions();
};
const jumpSchoolDetail = () => {
  go({ name: 'BuildingSchoolInformationDetail', query: { id: orgId } });
};
/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_EDIT:
      openAddModel(true, { key: AC_EDIT, ...row });
      break;
    case AC_DELETE:
      deleteRow(row);
      break;
  }
}
function deleteRow(row) {
  const { id } = row;
  window.$dialogError('是否删除？', () => {
    return deleteBuilding({ id }).then(() => {
      window.$message.success('删除成功');
      onSearch();
    });
  });
}
/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...toRaw(formValue),
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  setCount(~~data.total);
}
const onSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);

async function onExport() {
  const { page: current, pageSize: size } = pagination;
  const { data } = await exportExcelList({ current, size, ...toRaw(formValue), schoolId: orgId });
  data && downloadFile(data.data, '教学楼信息表', 'xlsx');
}

onMounted(() => {
  getDataSource();
  updateSchool();
});

defineOptions({
  name: 'BuildingInformation'
});
</script>
