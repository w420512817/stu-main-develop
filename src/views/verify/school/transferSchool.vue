<template>
  <q-list
    ref="tableElRef"
    scroll-x="1200"
    title="转学申请管理"
    :list-api="studentTransferList"
    :columns="columns"
    :form-data="formData"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="4" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="姓名：">
            <n-input v-model:value="formData.studentName" clearable />
          </n-form-item-gi>

          <n-form-item-gi label="性别：">
            <n-select v-model:value="formData.sex" :options="sexOpt" clearable />
          </n-form-item-gi>

          <n-form-item-gi label="学段：">
            <n-select
              v-model:value="formData.schoolTypes"
              :options="periodOpt"
              label-field="schoolTypes"
              value-field="schoolTypesId"
              clearable
              @update:value="changePeriod"
            />
          </n-form-item-gi>
          <n-form-item-gi label="年级：">
            <n-select
              v-model:value="formData.gradeId"
              :options="gradeOpt"
              label-field="gradeName"
              value-field="gradeId"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="学籍号码">
            <n-input v-model:value="formData.registerNumber" clearable />
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
      <n-button type="primary" mb-4 @click="handleClick(AC_ADD)">转学申请</n-button>
    </template>

    <transfer-out-modal @register="register" @success="tableElRef?.handleSearch" />
    <TranferOutDetailModal @register="register2" />
  </q-list>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { transferColumns, sexOpt } from './index.data';
import { AC_ADD, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';
import { studentTransferList, studentTransferDetele } from '@/api/verify/verifySchool';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import TransferOutModal from './components/TransferOutModal.vue';
import TranferOutDetailModal from '../gov/components/TransferInModal.vue';

const {
  userInfo: { orgId }
} = useUserStore();
const [register, { openModal }] = useModal();
const [register2, { openModal: openModal2 }] = useModal();
const form = {
  switchType: 2,
  studentName: null,
  sex: null,
  schoolTypes: null,
  gradeId: null,
  registerNumber: null
};

const gridCollapsed = ref(true);
const formData = reactive({ ...form });
const tableElRef = ref(null);
const periodOpt = ref([]);
const gradeOpt = ref([]);

const columns = transferColumns(handleClick);

async function getPeriodAndGrade() {
  let res = await schoolTypesGradeClassTree({ orgId });
  periodOpt.value = res;
}

function changePeriod(_, opt) {
  formData.gradeId = null;
  getGrade(opt);
}

function getGrade(opt) {
  gradeOpt.value = opt.gradeTree;
}

function resetForm() {
  gradeOpt.value = [];
  Object.assign(formData, form);
  tableElRef.value?.handleSearch();
}

function handleClick(key, row) {
  switch (key) {
    case AC_ADD:
      openModal(true, { key });
      break;
    case AC_DETAILS:
      openModal2(true, { key, ...row });
      break;
    case AC_DELETE:
      window.$dialogInfo(`确定撤销【${row.studentName}】的转学申请吗？`, async () => {
        await studentTransferDetele({ approvalId: row.id });
        tableElRef.value?.handleSearch();
        window.$message.success('操作成功');
      });
  }
}

onMounted(() => {
  getPeriodAndGrade();
});
</script>
<style scoped></style>
