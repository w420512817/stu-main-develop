<template>
  <n-card class="h-full shadow-sm" title="教室信息">
    <n-form class="w-full" inline label-placement="left" @keypress.enter="onSearch">
      <n-grid cols="5" :x-gap="20" responsive="screen" :collapsed="gridCollapsed">
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
            @update:value="updateSchool"
          />
        </n-form-item-gi>
        <n-form-item-gi label="所属教学楼:">
          <n-input v-model:value="formValue.buildingName" type="text" placeholder="请输入教学楼" />
        </n-form-item-gi>
        <n-form-item-gi label="所属楼层:">
          <n-input v-model:value="formValue.floorName" type="text" placeholder="请输入楼层" />
        </n-form-item-gi>
        <n-form-item-gi label="教室名称:">
          <n-input v-model:value="formValue.classroomName" type="text" placeholder="请输入教室名称" />
        </n-form-item-gi>
        <n-form-item-gi label="教室编号:">
          <n-input v-model:value="formValue.serialNumber" type="text" placeholder="请输入教室编号" />
        </n-form-item-gi>
        <n-gi suffix #="{ overflow }">
          <search-buttons
            has-collapsed
            :overflow="overflow"
            @search="onSearch"
            @reset="onReset"
            @collapse="gridCollapsed = !gridCollapsed"
          />
        </n-gi>
      </n-grid>
    </n-form>
    <n-space class="mb-4">
      <n-button v-auth="9320" type="primary" @click="openImportModel">导入</n-button>
      <n-button v-auth="9321" type="primary" @click="onExport">导出</n-button>
      <n-button v-auth="9322" type="primary" @click="onClickBtn(AC_ADD)">新增</n-button>
    </n-space>
    <n-data-table
      remote
      :render-cell="v => v || '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
    <syncImportModal
      type="classroom"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, { ...data, orgName })"
    />
    <syncImportResult type="classroom" @register="registerResultModal" @on-success="onSearch" />
  </n-card>
</template>
<script setup>
import { onMounted, ref, reactive, nextTick, toRaw, onActivated } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { useUserStore } from '@/store';
// hooks
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useGo } from '@common/hooks/usePage';
// static data
import { AC_EDIT, AC_DELETE, AC_ADD, AC_DETAILS } from '@common/enum/pageEnum';
// api
import { getClassroomList, deleteClassroom, exportExcelList } from '@/api/information/classroom';
import { schoolSelectBox } from '@/api/information';

import syncImportModal from '../components/syncImportModal.vue';
import syncImportResult from '../components/syncImportResult.vue';

import { createColumns } from './classroom.data';
import { downloadFile } from '@common/utils/file/download';

defineOptions({ name: 'ClassroomInformation' });

const { go } = useGo();
const {
  userInfo: { orgProperty, orgId }
} = useUserStore();

const origin = {
  schoolId: null,
  buildingName: null,
  floorName: null,
  classroomName: null,
  serialNumber: null
};

const schoolRef = ref();
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const columns = createColumns((key, row) => onClickBtn(key, row));
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();
const { fetch: getList, loading } = useApi(getClassroomList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row = {}) {
  const { id } = row;
  switch (key) {
    case AC_ADD:
      go({
        name: 'ClassroomModify',
        query: { id }
      });
      break;
    case AC_EDIT:
      go({
        name: 'ClassroomModify',
        query: { id }
      });
      break;
    case AC_DETAILS:
      go({
        name: 'ClassroomDetail',
        query: { id }
      });
      break;
    case AC_DELETE:
      deleteRow(row);
      break;
  }
}
function deleteRow(row) {
  const { id } = row;
  window.$dialogError('是否删除？', () => {
    return deleteClassroom({ id }).then(() => {
      window.$message.success('删除成功');
      onSearch();
    });
  });
}
/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: pageNum, pageSize } = pagination;
  const params = {
    ...toRaw(formValue),
    pageNum,
    pageSize
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  setCount(~~data.total);
}

onActivated(() => {
  onSearch();
});

const onSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);
function onReset() {
  Object.assign(formValue, origin);
  onSearch();
}
async function onExport() {
  const { page: current, pageSize: size } = pagination;
  const data = await exportExcelList({ current, size, ...toRaw(formValue), schoolId: orgId });
  data && downloadFile(data.data, '教室信息表', 'xlsx');
}
onMounted(async () => {
  getDataSource();
  await nextTick();
  schoolRef.value && schoolRef.value.getOptions();
});
</script>
<style scoped></style>
