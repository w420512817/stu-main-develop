<template>
  <n-card class="h-full shadow-sm" title="班级信息">
    <n-form class="w-full" inline label-placement="left" @keypress.enter="onSearch">
      <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen" :collapsed="gridCollapsed">
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
          />
        </n-form-item-gi>
        <n-form-item-gi label="学年:">
          <n-input v-model:value="formValue.studyYear" type="text" placeholder="请输入学年" clearable />
        </n-form-item-gi>
        <!-- <n-form-item-gi label="年级名称:">
          <n-input v-model:value="formValue.gradeName" type="text" placeholder="请输入年级名称" />
        </n-form-item-gi> -->
        <n-form-item-gi label="班级名称:">
          <n-input v-model:value="formValue.className" type="text" placeholder="请输入班级名称" clearable />
        </n-form-item-gi>
        <n-form-item-gi>
          <search-buttons
            breakpoint="2xl"
            has-collapsed
            :overflow="overflow"
            @search="onSearch"
            @reset="onReset"
            @collapse="gridCollapsed = !gridCollapsed"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space class="mb-4">
      <n-button v-auth="[19327, 9327]" type="primary" @click="openImportModel">导入</n-button>
      <n-button v-auth="[19328, 9328]" type="primary" @click="onExport">导出</n-button>
      <n-button v-auth="[19329, 9329]" type="primary" @click="handleAdd">新增</n-button>
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
      type="class"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, { ...data, orgName })"
    />
    <syncImportResult type="class" @register="registerResultModal" @on-success="onSearch" />
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
import { getClassList, deleteClass, exportExcelList } from '@/api/information/class';
import { schoolSelectBox } from '@/api/information';

import syncImportModal from '../components/syncImportModal.vue';
import syncImportResult from '../components/syncImportResult.vue';

import { createColumns } from './class.data';
import { downloadFile } from '@common/utils/file/download';
import { useRoute } from 'vue-router';

const { query } = useRoute();

const origin = {
  schoolId: null,
  studyYear: null,
  gradeName: null,
  className: null
};
const {
  userInfo: { orgProperty },
  userOrgType
} = useUserStore();
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolRef = ref();
const columns = createColumns((key, row) => onClickBtn(key, row));
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();
const { go } = useGo();
const { fetch: getList, loading } = useApi(getClassList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const updateSchool = async () => {
  await nextTick();
  schoolRef.value && schoolRef.value.getOptions();
};

function handleAdd() {
  const url = userOrgType == 'HOSPITAL' ? '/information/class-modify-hospital' : '/information/class-modify';
  go({
    path: url,
    query: {
      schoolId: query.schoolId
    }
  });
}

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  const url = userOrgType == 'HOSPITAL' ? '/information/class-modify-hospital' : '/information/class-modify';
  switch (key) {
    case AC_EDIT:
      go({
        path: url,
        query: {
          id: row.id,
          schoolId: query.schoolId
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
    return deleteClass({ id }).then(() => {
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
    schoolId: query.schoolId,
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  data && setCount(~~data.total);
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
  const data = await exportExcelList({ current, size, ...toRaw(formValue), schoolId: query.schoolId });
  data && downloadFile(data.data, '班级信息表', 'xlsx');
}

onMounted(() => {
  getDataSource();
  updateSchool();
});
defineOptions({
  name: 'ClassInformation'
});
</script>
