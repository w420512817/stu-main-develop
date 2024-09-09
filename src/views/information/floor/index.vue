<template>
  <n-card class="h-full shadow-sm" title="楼层信息">
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
        <n-form-item-gi label="所属教学楼:">
          <n-input v-model:value="formValue.buildingName" type="text" placeholder="请输入教学楼" clearable />
        </n-form-item-gi>
        <n-form-item-gi label="楼层名称:">
          <n-input v-model:value="formValue.floorName" type="text" placeholder="请输入楼层名称" clearable />
        </n-form-item-gi>
        <n-form-item-gi>
          <n-button type="primary" @click="onSearch">查询</n-button>
          <n-button v-auth="9314" type="primary" class="ml-3" @click="openImportModel">导入</n-button>
          <n-button v-auth="9315" type="primary" class="ml-3" @click="onExport">导出</n-button>
          <n-button v-auth="9316" type="primary" class="ml-3" @click="onClickBtn(AC_ADD)">新增</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
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
      type="floor"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, { ...data, orgName })"
    />
    <syncImportResult type="floor" @register="registerResultModal" @on-success="onSearch" />
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
// static data
import { AC_EDIT, AC_DELETE, AC_ADD } from '@common/enum/pageEnum';
// api
import { getFloorList, deleteFloor, exportExcelList } from '@/api/information/floor';
import { schoolSelectBox } from '@/api/information';

import addModal from './components/addModal.vue';
import syncImportModal from '../components/syncImportModal.vue';
import syncImportResult from '../components/syncImportResult.vue';

import { createColumns } from './floor.data';
import { downloadFile } from '@common/utils/file/download';

const origin = {
  buildingName: null,
  schoolId: null,
  floorName: null
};
const {
  userInfo: { orgProperty, orgId }
} = useUserStore();
const schoolRef = ref();
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const columns = createColumns((key, row) => onClickBtn(key, row));
const [registerAddModal, { openModal: openAddModel }] = useModal();
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();
const { fetch: getList, loading } = useApi(getFloorList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_ADD:
      openAddModel(true, { key: AC_ADD });
      break;
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
    return deleteFloor({ id }).then(() => {
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
  const data = await exportExcelList({ current, size, ...toRaw(formValue), schoolId: orgId });
  data && downloadFile(data.data, '楼层信息表', 'xlsx');
}
onMounted(async () => {
  getDataSource();
  await nextTick();
  schoolRef.value && schoolRef.value.getOptions();
});

defineOptions({
  name: 'FloorInformation'
});
</script>
