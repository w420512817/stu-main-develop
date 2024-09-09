<template>
  <q-list
    ref="tableElRef"
    scroll-x="1200"
    title="学生信息修改管理"
    :list-api="studentEditRecord"
    :columns="columns"
    :params-cb="tranferDate"
    :form-data="formData"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="4" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="姓名：">
            <n-input v-model:value="formData.studentName" clearable />
          </n-form-item-gi>

          <n-form-item-gi label="提交审核人：">
            <n-input v-model:value="formData.applicantName" clearable />
          </n-form-item-gi>

          <n-form-item-gi label="提交审核时间：">
            <n-date-picker
              v-model:formatted-value="formData.time"
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

    <StudentApproveModal @register="register" @success="tableElRef?.handleSearch" />
  </q-list>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { studentApproveColumns, verifyEnum } from './index.data';
import { studentEditRecord, studentEditRecordDe } from '@/api/verify/verifySchool';
import { useModal } from '@common/components/custom/Modal';
import StudentApproveModal from './components/StudentApproveModal.vue';
import { AC_ADD, AC_DETAILS, AC_RESET, AC_DELETE } from '@common/enum/pageEnum';

const [register, { openModal }] = useModal();
const form = {
  applicantName: null,
  auditorName: null,
  studentName: null,
  approvalStatus: null,
  time: null
};

const gridCollapsed = ref(true);
const formData = reactive({ ...form });
const tableElRef = ref(null);

const columns = studentApproveColumns(handleClick);

function tranferDate(formV) {
  let { time } = formV;
  let [sTime, eTime] = time || [];
  let endTime = eTime ? eTime + ' 23:59:59' : undefined;
  return { ...formV, startTime: sTime, endTime };
}

function resetForm() {
  Object.assign(formData, form);
  tableElRef.value?.handleSearch();
}

function handleClick(key, row = {}) {
  switch (key) {
    case AC_ADD:
    case AC_DETAILS:
    case AC_RESET:
      openModal(true, { key, ...row });
      break;
    case AC_DELETE:
      window.$dialogInfo(`确定撤销【${row.studentName}】的信息修改吗？`, async () => {
        await studentEditRecordDe({ approvalId: row.id });
        tableElRef.value?.handleSearch();
        window.$message.success('操作成功');
      });
      break;
  }
}
</script>
<style scoped></style>
