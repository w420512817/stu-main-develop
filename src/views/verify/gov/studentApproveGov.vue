<template>
  <q-list
    ref="tableElRef"
    scroll-x="1200"
    title="学生信息修改管理"
    :list-api="studentEditList"
    :columns="columns"
    :params-cb="tranferDate"
    :form-data="formData"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="4" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
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

          <n-form-item-gi label="审核人：">
            <n-input v-model:value="formData.auditorName" clearable />
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
    </template>

    <StudentApproveModal @register="register" @success="tableElRef?.handleSearch" />
  </q-list>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { studentApproveColumns, verifyEnum } from './index.data';
import { studentEditList, studentEditCheck } from '@/api/verify/verifyGov';
import { useModal } from '@common/components/custom/Modal';
import StudentApproveModal from './components/StudentApproveModal.vue';
import { AC_DETAILS, AC_PASS, AC_REJECT } from '@common/enum/pageEnum';

const [register, { openModal }] = useModal();
const form = {
  applicantName: null,
  auditorName: null,
  studentName: null,
  approvalStatus: null,
  startTime: null,
  planId: null
};
const enumName = {
  [AC_DETAILS]: '查看',
  [AC_PASS]: '通过',
  [AC_REJECT]: '驳回',
  CANCEL_REJECT: '撤销驳回',
  CANCEL_PASS: '撤销通过'
};

const enumStatus = {
  [AC_DETAILS]: 1,
  [AC_PASS]: 2,
  [AC_REJECT]: 3,
  CANCEL_REJECT: 5,
  CANCEL_PASS: 4
};

const gridCollapsed = ref(true);
const formData = reactive({ ...form });
const tableElRef = ref(null);

const columns = studentApproveColumns(handleClick);

function tranferDate(formV) {
  let { startTime } = formV;
  let [sTime, eTime] = startTime || [];
  let endTime = eTime ? eTime + ' 23:59:59' : undefined;
  return { ...formV, startTime: sTime, endTime };
}

function resetForm() {
  Object.assign(formData, form);
  tableElRef.value?.handleSearch();
}

function handleClick(key, row = {}) {
  // 如果是首次查看 状态改为审核中
  if (key === AC_DETAILS && row.approvalStatus == 0) {
    studentEditCheck({ approvalId: row.id, approvalStatus: 1 });
    row.approvalStatus = 1;
  }
  switch (key) {
    case AC_PASS:
    case AC_REJECT:
    case AC_DETAILS:
      openModal(true, { key, ...row });
      break;
    default:
      window.$dialogWarning(`是否确认${enumName[key]}？`, async () => {
        await studentEditCheck({ approvalId: row.id, approvalStatus: enumStatus[key] });
        tableElRef.value?.handleSearch();
        window.$message.success('操作成功');
      });
  }
}
</script>
<style scoped></style>
