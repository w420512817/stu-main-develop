<template>
  <n-card class="h-full shadow-sm" title="教师信息">
    <n-form class="w-full" inline label-placement="left" @keypress.enter="onSearch">
      <n-grid
        :cols="orgProperty == 3 ? '2 md:3 xl:4 2xl:5 3xl:6' : '2 md:3 xl:4 2xl:4 3xl:5'"
        :x-gap="20"
        responsive="screen"
        :collapsed="gridCollapsed"
      >
        <n-form-item-gi v-if="orgProperty == 3" label="学校名称:">
          <dropdown-select
            ref="schoolRef"
            v-model:value="formValue.schoolId"
            :list-api="schoolSelectBox"
            keyword="name"
            label-field="orgName"
            value-field="id"
            filterable
            placeholder="请选择学校"
            @update:value="updateSchool"
          />
        </n-form-item-gi>
        <n-form-item-gi label="教师名称:">
          <n-input v-model:value="formValue.name" type="text" placeholder="请输入教师名称" />
        </n-form-item-gi>
        <n-form-item-gi label="教师编号:">
          <n-input v-model:value="formValue.serialNumber" type="text" placeholder="请输入教师编号" />
        </n-form-item-gi>
        <n-form-item-gi label="教师职位:">
          <dropdown-select
            ref="positionRef"
            v-model:value="formValue.positionId"
            :list-api="positionSelectBox"
            label-field="name"
            value-field="id"
            placeholder="请选择教师职位"
          />
        </n-form-item-gi>
        <n-gi suffix #="{ overflow }">
          <search-buttons
            breakpoint="2xl"
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
      <n-button v-auth="9333" type="primary" @click="openImportModel(true, { orgName })">导入</n-button>
      <n-button v-auth="9334" type="primary" @click="onExport">导出</n-button>
      <n-button v-auth="9335" type="primary" @click="go({ name: 'ModifyTeacherInformation' })">新增</n-button>
    </n-space>
    <n-data-table
      remote
      :loading="loading"
      :render-cell="v => v || '/'"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
    <importModal @register="registerImportModal" @on-success="importSuccess" />
    <importResult @register="registerResultModal" @on-success="onSearch" />
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
import { AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';

// api
import { getTeacherList, deleteTeacher, positionSelectBox, exportExcelList } from '@/api/information/teacher';
import { schoolSelectBox } from '@/api/information';

import importModal from './components/importModal.vue';
import importResult from './components/importResult.vue';

import { createColumns } from './teacher.data';
import { downloadFile } from '@common/utils/file/download';

const origin = {
  positionId: null,
  serialNumber: null,
  name: null,
  schoolId: null
};

const {
  userInfo: { orgProperty, orgName, orgId }
} = useUserStore();

const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolRef = ref();
const positionRef = ref();
const columns = createColumns((key, row) => onClickBtn(key, row));
const { go } = useGo();
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();
const { fetch: getList, loading } = useApi(getTeacherList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const updateSchool = async () => {
  await nextTick();
  schoolRef.value.getOptions();
};
const importSuccess = data => {
  openImportResultModel(true, { ...data.result, type: data.type, orgName });
};
/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_EDIT:
      go({
        path: '/information/teacher-modify',
        query: {
          id: row.id
        }
      });
      break;
    case AC_DETAILS:
      go({
        path: '/information/teacher-detail',
        query: {
          id: row.id
        }
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
    return deleteTeacher({ id }).then(() => {
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
function onReset() {
  Object.assign(formValue, origin);
  onSearch();
}

async function onExport() {
  const { page: current, pageSize: size } = pagination;
  const data = await exportExcelList({ current, size, ...toRaw(formValue), schoolId: orgId });
  data && downloadFile(data.data, '教师信息表', 'xlsx');
}
onMounted(async () => {
  getDataSource();
  await nextTick();
  schoolRef.value && schoolRef.value.getOptions();
  positionRef.value.getOptions();
});

defineOptions({
  name: 'TeacherInformation'
});
</script>
