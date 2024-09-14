<template>
  <n-card title="筛查管理" class="h-full shadow-sm">
    <n-form :model="formValue" label-placement="left" inline @keypress.enter="handleSearch">
      <n-grid cols="4" :x-gap="48" :collapsed="gridCollapsed" responsive="screen">
        <n-gi v-if="showAssociateSchool">
          <n-form-item label="学校名称">
            <n-select
              v-model:value="formValue.schoolName"
              filterable
              clearable
              :options="schoolNameList"
              label-field="schoolName"
              value-field="schoolName"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="年份">
            <n-select v-model:value="formValue.planYear" :options="yearList()" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="筛查模式">
            <n-select v-model:value="formValue.planMode" filterable clearable :options="chooseModeList" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="筛查名称">
            <n-input v-model:value="formValue.planName" placeholder="请输入" />
          </n-form-item>
        </n-gi>
        <!-- <n-gi>
          <n-form-item label="计划类型">
            <n-select v-model:value="formValue.planType" :options="typeList" />
          </n-form-item>
        </n-gi> -->
        <n-gi>
          <n-form-item label="选择日期">
            <n-date-picker v-model:formatted-value="formValue.dateValue" type="daterange" clearable />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="状态">
            <n-select v-model:value="formValue.planStatus" :options="statusList" />
          </n-form-item>
        </n-gi>
        <n-gi suffix #="{ overflow }">
          <n-form-item>
            <search-buttons
              breakpoint="mxxl"
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
      <n-button type="primary" @click="openChooseModal">新增筛查</n-button>
    </n-space>

    <!-- :scroll-x="1500" -->
    <n-data-table
      remote
      striped
      :render-cell="v => v ?? '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
    <Modal
      title="数据设置"
      :use-data="state.useData"
      :is-edit="false"
      @add-success="getDataSource"
      @register="register"
    />
    <ChooseModeModal
      title="请选择筛查模式"
      style="width: 800px"
      @register="registerChooseMode"
      @choose="id => handleChoose(id)"
    />
    <ExportModal title="导出筛查数据" @register="registerExport" />
  </n-card>
</template>

<script setup lang="jsx">
import { ref, reactive, onMounted, onActivated, computed } from 'vue';
import { cloneDeep } from 'lodash-es';

import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore, useApplicationStore } from '@/store';
import { getColumns } from '@common/utils';
import { AC_DETAILS, AC_DELETE, AC_EDIT, AC_EXPORT } from '@common/enum/pageEnum';
import { createColumns, statusList, yearList, chooseModeList } from './index.data';
import ChooseModeModal from './components/chooseModeModal.vue';
import ExportModal from './components/exportModal.vue';
import Modal from './components/modal.vue';

import { planList, planComplete, planDelete, getAssociateAllSchool } from '@common/api/examine/plan';

const { appType } = useApplicationStore();

defineOptions({ name: 'PlanManage' });
let state = reactive({
  useData: {}
});

const { fetch: getListApi, loading } = useApi(planList);
const { go } = useGo();
const [register, { openModal }] = useModal();
const [registerChooseMode, { openModal: openChooseModal }] = useModal();
const [registerExport, { openModal: openExportModal }] = useModal();
const gridCollapsed = ref(true);

const {
  userOrgType: orgType,
  userInfo: { orgId }
} = useUserStore();
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

const originData = {
  planMode: null,
  planYear: null,
  planName: null,
  planType: null,
  appGroupId: null,
  dateValue: null,
  planStatus: null
};
const columns = getColumns(createColumns({ handleTableClick, orgType }));
const dataSource = ref([]);
const formValue = reactive(cloneDeep(originData));
const schoolNameList = ref([]);

const showAssociateSchool = computed(() => ['HOSPITAL', 'SOCIAL'].includes(orgType)); // 医院20和社会机构40才需要查看关联

async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const { dateValue, ...info } = formValue;
  const [startTime, endTime] = dateValue || [];
  const params = {
    ...info,
    appType,
    startTime,
    endTime,
    current,
    size
  };
  const data = await getListApi(params);

  // dataSource.value = data?.records ?? [];
  dataSource.value = data?.list ?? [];
  setCount(+data.total);
}

const getSchoolNameList = async () => {
  schoolNameList.value = await getAssociateAllSchool({ current: 1, pageSize: 100 });
};

onMounted(() => {
  showAssociateSchool.value && getSchoolNameList();
});

onActivated(() => {
  getDataSource();
});

function handleSearch() {
  setPage(1);
  getDataSource();
}
// id 1：计划模式 2： 自动模式
function handleChoose(id) {
  go({ path: '/examine/add-plan', query: { appType, planMode: id } });
}

function handleTableClick(key, row = {}) {
  const { planId, planName, schoolId, planMode } = row;
  const currentPlanName = row.planMode == 2 ? '任务' : '计划';
  state.useData = row;
  switch (key) {
    case 'permission':
      go({ path: '/examine/school-permission', query: { planId } });
      break;
    case 'completePlan': {
      let successMsg = '点击完成后，该任务不得再进行数据录入修改等工作';
      let progessMsg = '有学校未完成筛查任务，点击完成后，任务结束不得在进行操作。';
      let planModeMsg = '计划完成后无法再录入数据。你还要继续吗？';
      let msg = row.rate >= 100 ? successMsg : progessMsg;
      window.$dialogWarning(
        () => {
          return (
            <div className="whitespace-nowrap">
              <div>
                是否完成{currentPlanName}：{planName}，
              </div>
              <div>{row.planMode == 1 ? planModeMsg : msg}</div>
            </div>
          );
        },
        () => {
          return planComplete({ planId }).then(() => {
            getDataSource();
            window.$message.success('操作成功!');
          });
        }
      );
      break;
    }
    case AC_DELETE:
      window.$dialogWarning(
        () => {
          return (
            <>
              <div>
                是否删除{currentPlanName}：{planName}
              </div>
              <div>删除后该{currentPlanName}下的数据将被清除</div>
            </>
          );
        },
        () => {
          return planDelete({ planId }).then(() => {
            getDataSource();
            window.$message.success('操作成功!');
          });
        }
      );
      break;
    case 'sumedit':
      openModal();
      break;
    case AC_DETAILS: {
      let realOrgId = undefined;
      // orgType === 'SCHOOL' && (realOrgId = orgId);
      // ['HOSPITAL', 'SOCIAL'].includes(orgType) && (realOrgId = schoolId);
      go({ path: '/examine/plan-detail', query: { planId, orgId: realOrgId, planMode } });
      break;
    }

    case AC_EDIT:
      go({ path: '/examine/add-plan', query: { planId, edit: 1, appType, planMode } });
      break;

    case 'AC_EDIT_PROVINCEORCITY':
      go({ path: '/examine/edit-plan', query: { planId, edit: 1, appType, planMode } });
      break;
    case AC_EXPORT:
      console.log('导出数据');
      openExportModal(true, { planId });
      break;
  }
}

function onReset() {
  setPage(1);
  Object.assign(formValue, originData);
  getDataSource();
}
</script>
<style scoped></style>
