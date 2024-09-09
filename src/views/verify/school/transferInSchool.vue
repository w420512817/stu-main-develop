<template>
  <q-list
    ref="tableElRef"
    scroll-x="1200"
    title="转入管理"
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
          <n-gi suffix #="{ overflow }">
            <n-form-item>
              <search-buttons
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

    <TransferInModal @register="register" @success="tableElRef?.handleSearch" />
  </q-list>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { transferInColumns, sexOpt } from './index.data';
import { studentTransferList } from '@/api/verify/verifySchool';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import TransferInModal from './components/TransferInModal.vue';

const [register, { openModal }] = useModal();
const {
  userInfo: { orgId }
} = useUserStore();
const form = {
  switchType: 1,
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
const columns = transferInColumns(handleClick);

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
  Object.assign(formData, form);
  tableElRef.value?.handleSearch();
}

function handleClick(key, row) {
  openModal(true, { key, ...row });
}

onMounted(() => {
  getPeriodAndGrade();
});
</script>
<style scoped></style>
