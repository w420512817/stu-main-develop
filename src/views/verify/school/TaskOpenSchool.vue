<template>
  <q-list
    ref="tableElRef"
    scroll-x="1200"
    title="任务开启管理"
    :list-api="taskApplyList"
    :columns="columns"
    :params-cb="tranferDate"
    :form-data="formData"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="4" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="筛查类型：">
            <n-select v-model:value="formData.appType" :options="appNameOpt" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="任务名称：">
            <n-select
              v-model:value="formData.taskId"
              :options="planList"
              :render-option="selectToolTip"
              label-field="taskName"
              value-field="taskId"
              clearable
              filterable
            />
          </n-form-item-gi>

          <n-form-item-gi label="提交审核人：">
            <n-input v-model:value="formData.applicantName" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="提交审核时间：">
            <n-date-picker
              v-model:formatted-value="formData.startTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="审核状态：">
            <n-select v-model:value="formData.approvalStatus" :options="verifyEnum" clearable />
          </n-form-item-gi>
          <n-gi suffix #="{ overflow }">
            <n-form-item>
              <search-buttons
                breakpoint="3xl"
                :overflow="overflow"
                @search="tableElRef?.handleSearch"
                @reset="resetForm"
                @collapse="gridCollapsed = !gridCollapsed"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>
      <n-button type="primary" mb-4 @click="handleClick(AC_ADD)">发起审核</n-button>
    </template>
    <TaskOpenModal @register="register" @success="editSuccess" />
  </q-list>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { taskOpenColumns, verifyEnum, appNameOpt, selectToolTip } from './index.data';
import { taskApplyList, applyDeleted } from '@/api/verify/verifySchool';
import { planSelectBox } from '@/api/verify/verifyGov';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import TaskOpenModal from './components/TaskOpenModal.vue';
import { AC_ADD, AC_DELETE } from '@common/enum/pageEnum';

const {
  userInfo: { orgId }
} = useUserStore();
const [register, { openModal }] = useModal();
const form = {
  taskId: null,
  approvedType: 1,
  approvalStatus: null,
  time: null,
  applicantName: null,
  auditorName: null,
  registerNumber: null,
  startTime: null,
  appType: null
};

const gridCollapsed = ref(true);
const formData = reactive({ ...form });
const planList = ref([]);
const tableElRef = ref(null);

const columns = taskOpenColumns(handleClick);

function tranferDate(formV) {
  let { startTime } = formV;
  let [sTime, eTime] = startTime || [];
  let endTime = eTime ? eTime + ' 23:59:59' : undefined;
  return { ...formV, startTime: sTime, endTime };
}
async function getPlanList() {
  let res = await planSelectBox({ orgId, approvedType: formData.approvedType });
  planList.value = res || [];
}

function editSuccess() {
  tableElRef.value?.handleSearch();
  getPlanList();
}

function resetForm() {
  Object.assign(formData, form);
  tableElRef.value?.handleSearch();
}

function handleClick(key, row) {
  switch (key) {
    case AC_DELETE:
      window.$dialogInfo(`确定撤销【${row.taskName}】的任务开启吗？`, async () => {
        await applyDeleted({ approvalId: row.approvalId });
        editSuccess();
        formData.taskId = null;
        window.$message.success('操作成功');
      });
      break;
    default:
      openModal(true, { key, ...row });
  }
}

onMounted(() => {
  getPlanList();
});
</script>
<style scoped></style>
