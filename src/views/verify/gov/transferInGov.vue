<template>
  <q-list
    ref="tableElRef"
    title="转学审核"
    :list-api="studentTransferList"
    :columns="columns"
    :params-cb="tranferDate"
    :form-data="formData"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="4" :x-gap="20" responsive="screen">
          <n-form-item-gi label="提交审核人： ">
            <n-input v-model:value="formData.submitReviewer" clearable />
          </n-form-item-gi>

          <n-form-item-gi label="提交审核时间：">
            <n-date-picker
              v-model:formatted-value="formData.startTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              clearable
            />
          </n-form-item-gi>

          <n-form-item-gi label="审核人：">
            <n-input v-model:value="formData.govAuditorName" clearable />
          </n-form-item-gi>
          <n-gi suffix #="{ overflow }">
            <n-form-item>
              <search-buttons :overflow="overflow" @search="tableElRef?.handleSearch" @reset="resetForm" />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>
    </template>
    <TransferInModal @register="register" @success="tableElRef?.handleSearch" />
  </q-list>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useModal } from '@common/components/custom/Modal';
import TransferInModal from './components/TransferInModal.vue';
import { transferInColumns } from './index.data';
import { studentTransferList, transferCheck } from '@/api/verify/verifyGov';
import { AC_DETAILS } from '@common/enum/pageEnum';

const [register, { openModal }] = useModal();
const form = {
  submitReviewer: undefined,
  startTime: undefined,
  govAuditorName: undefined,
  switchType: 4
};
const formData = reactive({ ...form });
const tableElRef = ref(null);

const columns = transferInColumns(handleClick);

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

function handleClick(key, row) {
  // 如果是首次查看 状态改为审核中
  if (key === AC_DETAILS && row.govApprovalStatus == 0) {
    transferCheck({ approvalId: row.id, approvalStatus: 1 });
    row.approvalStatus = 1;
  }
  openModal(true, { key, ...row });
}
</script>
<style scoped></style>
