<template>
  <basic-modal v-bind="$attrs" class="w-350" :show-ok-btn="false" :show-cancel-btn="false" @register="register">
    <n-data-table
      striped
      :render-cell="v => v ?? '/'"
      :columns="stuColumns"
      :data="notScreenStuList"
      :bordered="false"
    />
    <ClearModal title="清除数据" @register="registerClear" @on-success="clearSuc" />
  </basic-modal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { object } from 'vue-types';
import { useModalInner, useModal } from '@common/components/custom/Modal';

import { getNotScreenStuList } from '@common/api/examine/task';
import { recoveryStuStatus } from '@common/api/examine/task';

import ClearModal from './clearModal.vue';

import { notScreenColumns } from '../index.data.jsx';
import { AC_CLEAR, AC_RESET } from '@common/enum/pageEnum';

// emit
const emit = defineEmits(['onSuccess', 'register']);

const stuColumns = notScreenColumns({ handleTableClick });
const notScreenStuList = ref([]);
const state = reactive({});

defineProps({
  userData: object().def({})
});
// / setProps, closeModal,
const [register, { changeLoading }] = useModalInner(data => {
  if (data) {
    Object.assign(state, data);
    onDataReceive();
  }
});
const [registerClear, { openModal: openModalClear }] = useModal();

async function onDataReceive() {
  const { taskId } = state;
  changeLoading();
  try {
    notScreenStuList.value = await getNotScreenStuList({ taskId });
  } finally {
    changeLoading(false);
  }
}
async function handleTableClick(key, row) {
  const { taskId } = state;
  const { studentId, id, examEyesightId } = row;
  switch (key) {
    case AC_RESET:
      recoveryData(row);
      break;
    case AC_CLEAR:
      openModalClear(true, { taskId, studentId, id, examEyesightId });
      break;
  }
}
const recoveryData = async ({ id }) => {
  changeLoading();
  try {
    await recoveryStuStatus({ id });
    window.$message.success('恢复数据成功');
    emit('onSuccess');
    onDataReceive();
  } finally {
    changeLoading(false);
  }
};
const clearSuc = () => {
  emit('onSuccess');
};
</script>
