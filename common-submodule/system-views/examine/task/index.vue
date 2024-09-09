<template>
  <n-card title="任务管理" class="h-full shadow-sm">
    <n-form :model="formValue" label-placement="left" inline @keypress.enter="handleSearch">
      <n-grid cols="2 md:2 xl:3 2xl:4 3xl:5" :x-gap="48" :collapsed="gridCollapsed" responsive="screen">
        <n-gi>
          <n-form-item label="年份">
            <n-select v-model:value="formValue.planYear" :options="yearList()" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="任务名称">
            <n-input v-model:value="formValue.taskName" placeholder="请输入" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="任务类型">
            <n-select v-model:value="formValue.taskType" :options="typeList" />
          </n-form-item>
        </n-gi>
        <!-- <n-gi>
          <n-form-item label="应用组名称">
            <n-select
              v-model:value="formValue.appGroupId"
              :options="appsList"
              label-field="appGroupName"
              value-field="appGroupId"
            />
          </n-form-item>
        </n-gi> -->
        <n-gi>
          <n-form-item label="所属计划">
            <n-input v-model:value="formValue.planName" placeholder="请输入" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="选择日期">
            <n-date-picker
              v-model:formatted-value="formValue.dateValue"
              type="daterange"
              clearable
              @update:formatted-value="handleSearch"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="状态">
            <n-select v-model:value="formValue.taskStatus" :options="statusList" @update:value="handleSearch" />
          </n-form-item>
        </n-gi>
        <n-gi v-if="govLevel <= 2 && userOrgType !== 'SCHOOL'">
          <n-form-item label="所属地区">
            <n-cascader
              v-model:value="formValue.areaId"
              placeholder="请选择所属地区"
              :options="addressData"
              label-field="areaName"
              value-field="id"
              check-strategy="all"
              children-field="childAreas"
            />
          </n-form-item>
        </n-gi>

        <n-gi v-if="userOrgType !== 'SCHOOL'">
          <n-form-item label="所属学校">
            <n-input v-model:value="formValue.taskOrgName" placeholder="请输入" />
          </n-form-item>
        </n-gi>

        <n-gi suffix #="{ overflow }">
          <n-form-item>
            <search-buttons
              breakpoint="3xl"
              :overflow="overflow"
              @search="handleSearch"
              @reset="onReset"
              @collapse="gridCollapsed = !gridCollapsed"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
    <n-space mb-4>
      <!-- v-auth="2063" -->
      <!-- v-auth="2064" -->
      <n-button
        v-auth="[9019, 9067, 9115, 1163]"
        attr-type="button"
        type="primary"
        @click="handleTableClick('BTN_ADD', { addType: 101 })"
      >
        新增筛查任务
      </n-button>
      <n-button
        v-auth="[9020, 9068, 9116, 9164]"
        attr-type="button"
        type="primary"
        @click="handleTableClick('BTN_ADD', { addType: 104 })"
      >
        新增自查任务
      </n-button>
      <!-- <n-button attr-type="button" type="primary" @click="handleTableClick(AC_IMPORT)">导入</n-button>
      <n-button attr-type="button" type="primary" @click="handleTableClick(AC_EXPORT)">导出</n-button> -->
    </n-space>
    <n-data-table
      remote
      striped
      :render-cell="v => v ?? '/'"
      :loading="loading"
      :scroll-x="1500"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
    <ExportModal title="导出数据" @register="register" />
    <ImportModal title="导入数据" @register="registerImport" />
    <ImportResult @register="registerResultModal" />
    <PrintModal title="打印登记表" @register="registerPrint" />
    <CreateReviewModal title="创建复查任务" @register="registerCreate" @on-success="getDataSource" />
  </n-card>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onActivated } from 'vue';
import { cloneDeep } from 'lodash-es';
// import { NButton, NDivider, NEl, NDropdown } from 'naive-ui';

import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import { useScreenStore, useApplicationStore } from '@/store';

import ExportModal from './components/exportModal.vue';
import ImportModal from './components/import/importModal.vue';
import PrintModal from './components/print/printModal.vue';
import ImportResult from './components/import/importResult.vue';
import CreateReviewModal from './components/createReviewModal.vue';

import {
  getTaskList,
  deleteTask,
  completeTask,
  uploadTask,
  openTask,
  consentStatusUpdate,
  getSubordinateRegion
} from '@common/api/examine/task';
import { getApplicationList } from '@common/api/common';
import { createColumns, statusList } from './index.data';
import { yearList, typeList } from '../common.data';
import { getColumns } from '@common/utils/index';

import {
  AC_ADD,
  AC_EDIT,
  AC_DETAILS,
  AC_IMPORT,
  AC_EXPORT,
  AC_DELETE,
  AC_COMPLETE,
  AC_UP_REPORT,
  AC_PRINT,
  AC_OPEN
} from '@common/enum/pageEnum';
const { appType } = useApplicationStore();

defineOptions({ name: 'TaskList' });

const { fetch: consentStatusUpdateApi, loading: consentStatusLoading } = useApi(consentStatusUpdate);
const { fetch: getListApi, loading } = useApi(getTaskList);
const { go } = useGo();
const [register, { openModal }] = useModal();
const [registerImport, { openModal: openModalImport }] = useModal();
const [registerPrint, { openModal: openModalPrint }] = useModal();
const [registerResultModal, { openModal: openModalResult, closeModal: closeModalResult }] = useModal();
const [registerCreate, { openModal: openModalCreate }] = useModal();

const gridCollapsed = ref(true);
const addressData = ref([]);

const screenStore = useScreenStore();
const {
  userInfo: { orgId, areaId, govLevel },
  userOrgType
} = useUserStore();
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

const originData = {
  planYear: null,
  taskName: null,
  taskType: null,
  appGroupId: null,
  taskStatus: null,
  planName: null,
  dateValue: null,
  taskOrgName: null,
  areaId: null
};
const columns = getColumns(createColumns({ handleTableClick }));
const dataSource = ref([]);
const formValue = reactive(cloneDeep(originData));
const appsList = ref([]);

watch(
  () => screenStore.showResultModal,
  () => {
    if (screenStore.showResultModal) {
      openModalResult();
    } else {
      closeModalResult();
    }
  }
);

async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const { dateValue, ...info } = formValue;
  const [startTime, endTime] = dateValue || [];
  const params = {
    ...info,
    startTime,
    endTime,
    appType,
    current,
    size
  };
  const data = await getListApi(params);

  dataSource.value = data?.records ?? [];
  setCount(+data.total);
}
const getAppsList = async () => {
  appsList.value = await getApplicationList({ orgId, appType });
};

async function getRegion() {
  addressData.value = await getSubordinateRegion({ areaId });
}

function onReset() {
  setPage(1);
  Object.assign(formValue, originData);
  getDataSource();
}

function handleSearch() {
  setPage(1);
  getDataSource();
}

async function consentStatusChange(row) {
  if (consentStatusLoading.value) return;
  await consentStatusUpdateApi({ taskId: row.taskId, status: !row.consentSwitch });
  row.consentSwitch = !row.consentSwitch;
}

function handleTableClick(key, row = {}) {
  const { taskId, taskName, addType, appGroupId, planId, taskOrgName, planName, taskOrgId, endTime, range } = row;
  switch (key) {
    case 'BTN_ADD':
      go({
        name: 'TaskModify',
        query: { type: addType, appType }
      });
      break;
    case AC_ADD:
      openModalCreate(true, { id: taskId, orgName: taskOrgName, time: endTime });

      break;
    case AC_OPEN:
      window.$dialogWarning(`是否打开任务：${taskName}`, () => {
        return openTask({ taskId }).then(() => {
          getDataSource();
          window.$message.success('打开任务成功!');
        });
      });
      break;
    case AC_DETAILS:
      go({
        name: 'TaskDetail',
        query: { id: taskId, planMode: row.planMode }
      });
      break;
    case AC_DELETE:
      window.$dialogError(`将删除数据，是否继续？`, () => {
        return deleteTask({ taskId }).then(() => {
          getDataSource();
          window.$message.success('删除成功!');
        });
      });
      break;
    case AC_PRINT:
      openModalPrint(true, { taskId, appGroupId, planId });
      break;
    case AC_EXPORT:
      openModal(true, { taskId, range, planId, planName, schoolId: taskOrgId, taskName, taskOrgName });
      break;
    case AC_IMPORT:
      screenStore.resetData();
      openModalImport(true, { taskId, taskOrgName, planName, taskName, type: appType });
      break;
    case AC_UP_REPORT:
      window.$dialogWarning(`确定要上报任务【${taskName}】吗？`, () => {
        return uploadTask(row).then(() => {
          getDataSource();
          window.$message.success('上报成功');
        });
      });
      break;
    case AC_COMPLETE:
      window.$dialogWarning(`确定要操作完成任务【${taskName}】吗？`, async () => {
        await completeTask(row);
        getDataSource();
        window.$message.success('操作成功');
      });
      break;
    case AC_EDIT:
      go({
        name: 'TaskConfiguration',
        query: { taskId }
      });
      break;
    case 'AC_CONSENTSWITCH':
      consentStatusChange(row);
      break;
  }
}

onMounted(() => {
  getAppsList();
  govLevel && govLevel <= 2 && userOrgType !== 'SCHOOL' && getRegion();
});

onActivated(() => {
  getDataSource();
});
</script>
<style scoped></style>
