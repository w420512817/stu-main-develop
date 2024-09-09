<template>
  <basic-modal
    v-bind="$attrs"
    title="查看通知"
    class="w-600px"
    cancel-text="关闭"
    :ok-text="isReceive ? '下一条' : '确定'"
    @ok="nextNotice"
    @register="register"
    @visible-change="visibleChange"
  >
    <n-form
      label-placement="left"
      label-width="90"
      label-align="right"
      require-mark-placement="left"
      :style="{
        maxWidth: '640px'
      }"
    >
      <n-form-item label="通知标题:">
        {{ state.noticeTitle }}
      </n-form-item>
      <!-- <n-form-item label="通知类型:">
        {{ noticeType[state.noticeType]?.label || '-' }}
      </n-form-item> -->
      <n-form-item label="通知机构:">
        {{ state.noticeOrg }}
      </n-form-item>
      <n-form-item label="通知人:">
        {{ state['notifier'] || state['notifiedPerson'] }}
      </n-form-item>
      <n-form-item label="通知内容:">
        {{ state.noticeContent }}
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

import { useModalInner } from '@common/components/custom/Modal';

// import { noticeType } from '../../send/table.data';
import { getAcceptNoticeDetail, noticeNum } from '@/api/notice/receive';
import { SendNoticeDetail } from '@/api/notice/send';
import { useUserStore } from '@/store';
const userStore = useUserStore();

const emit = defineEmits(['onSuccess', 'register']);

const [register, { closeModal, changeLoading }] = useModalInner(data => {
  acceptNoticeDetail(data);
});

const initForm = {
  noticeTitle: null,
  noticeContent: null,
  notifiedPerson: null,
  noticeType: null
};

const state = reactive({ ...initForm });
const notList = ref([]);
const curIndex = ref(0);

async function nextNotice() {
  if (!isReceive.value) {
    closeModal();
    return;
  }
  if (curIndex.value === notList.value.length - 1) {
    curIndex.value = 0;
  } else {
    curIndex.value++;
  }
  acceptNoticeDetail(notList.value[curIndex.value]);
  const noticeSum = await noticeNum();
  userStore.setNoticeSum(noticeSum);
}

function reset() {
  Object.assign(state, initForm);
}

function visibleChange(visible) {
  !visible && reset();
}

async function acceptNoticeDetail({ noticeAcceptId, noticeSendId, noticeState, list }) {
  changeLoading();
  try {
    if (list) {
      notList.value = list;
      curIndex.value = list.findIndex(item => item.noticeAcceptId === noticeAcceptId);
    }
    const func = noticeAcceptId ? getAcceptNoticeDetail({ noticeAcceptId }) : SendNoticeDetail({ noticeSendId });
    const res = await func;
    Object.assign(state, res);
    noticeState === 0 && emit('onSuccess');
  } finally {
    changeLoading(false);
  }
}

const isReceive = computed(() => {
  return notList.value?.length;
});
</script>
