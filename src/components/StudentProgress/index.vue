<template>
  <div
    v-show="studentStore.visible"
    ref="elRef"
    :style="style"
    rounded-12
    flex
    items-center
    border-gray
    border
    py-1px
    fixed
    z-1100
    bg-white
    cursor-move
  >
    <n-progress
      :stroke-width="10"
      style="width: 48px"
      type="circle"
      :status="state?.state < 4 ? 'info' : 'error'"
      :percentage="100"
    >
      <p text-success text-12px scale-70 w-34px>{{ state.completion }}</p>
    </n-progress>

    <div ml-2 flex items-center cursor-pointer justify-between>
      <div @click="showResultModal">
        <p text-4 font-bold mr-2>{{ statusMap[state?.state ?? 0].message }}</p>
        <p text-2>新增{{ state.successCount }},失败{{ state.failCount }}</p>
      </div>

      <icon-carbon:close text-5 cursor-pointer text-error @click="handleClose" />
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, computed, ref } from 'vue';
import { useDraggable, useWindowSize } from '@vueuse/core';

import { useStudentStore } from '@/store';

const elRef = ref();

const { width } = useWindowSize();
const { style } = useDraggable(elRef, {
  initialValue: { x: width.value - 280, y: 140 }
});

const studentStore = useStudentStore();

const statusMap = {
  0: { status: 'info', message: '' },
  1: { status: 'info', message: '导入正在排队' },
  2: { status: 'info', message: '学生正在导入...' },
  3: { status: 'success', message: '学生导入完成' },
  4: { status: 'error', message: '手动中止' },
  5: { state: 'error', message: '异常' }
};
const state = computed(() => {
  return studentStore?.state ?? {};
});
const showResultModal = () => {
  studentStore.jumpPageAndOpenModal();
};
const handleClose = () => {
  studentStore.onClose();
};

onMounted(() => {
  studentStore.getData();
});

onBeforeUnmount(() => {
  studentStore.clearTimer();
});
</script>
