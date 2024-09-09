<template>
  <div
    v-show="screenStore.visible"
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
import { computed, ref, watch } from 'vue';

import { useDraggable, useWindowSize } from '@vueuse/core';
import { useScreenStore } from '@common/store/import';
import { useUserStore } from '@common/store/user';

const elRef = ref();

const userStore = useUserStore();
const { width } = useWindowSize();
const { style } = useDraggable(elRef, {
  initialValue: { x: width.value - 280, y: 170 }
});

const screenStore = useScreenStore();

const statusMap = {
  0: { status: 'info', message: '' },
  1: { status: 'info', message: '导入正在排队' },
  2: { status: 'info', message: '筛查数据正在导入...' },
  3: { status: 'success', message: '筛查数据导入完成' },
  4: { status: 'error', message: '手动中止' },
  5: { state: 'error', message: '异常' }
};

const state = computed(() => {
  return screenStore?.state ?? {};
});
const showResultModal = () => {
  screenStore.jumpPageAndOpenModal();
};
const handleClose = () => {
  screenStore.onClose();
};

watch(
  () => userStore.isLogin,
  val => {
    if (val) {
      screenStore.getData();
    } else {
      screenStore.clearTimer();
    }
  },
  {
    immediate: true
  }
);
</script>
