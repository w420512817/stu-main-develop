<template>
  <n-card title="接收通知列表" class="h-full shadow-sm">
    <n-form label-placement="left" label-align="right" label-width="auto" :modal="formValue" @keypress.enter="getList">
      <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen">
        <n-form-item-gi label="通知标题：">
          <n-input v-model:value="formValue.noticeTitle" clearable />
        </n-form-item-gi>

        <!-- 政府账号下，不需要通知类型 -->
        <n-form-item-gi v-if="userOrgType !== 'GOVERMENT'" label="通知类型：">
          <n-select v-model:value="formValue.noticeType" clearable :options="enumNoticeType" />
        </n-form-item-gi>

        <n-form-item-gi label="通知状态：">
          <n-select v-model:value="formValue.noticeState" clearable :options="noticeStates" />
        </n-form-item-gi>

        <n-form-item-gi>
          <n-space>
            <n-button type="primary" @click="handleSearch">查询</n-button>
            <!-- <n-button @click="handleReset">重置</n-button> -->
          </n-space>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space mb-4>
      <n-button v-auth="2083" type="primary" size="small" :disabled="!selectArr.length" @click="handleClick(AC_PASS)">
        标记已读
      </n-button>
      <n-button v-auth="2084" type="error" size="small" :disabled="!selectArr.length" @click="handleClick(AC_DELETE)"
        >删除</n-button
      >
    </n-space>
    <n-data-table
      v-model:checked-row-keys="selectArr"
      :columns="columns"
      :data="docList"
      :row-key="({ noticeAcceptId, noticeState }) => JSON.stringify({ noticeAcceptId, noticeState })"
      :loading="loading"
      :pagination="pagination"
      striped
      remote
    />

    <detailModal @register="register" @on-success="getList" />
  </n-card>
</template>

<script setup>
import { shallowRef, reactive, onMounted } from 'vue';
import detailModal from './components/modal.vue';

import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
import { useModal } from '@common/components/custom/Modal';
import { useThrottleFn } from '@vueuse/core';
import { useUserStore } from '@/store';

import { getAcceptNoticePageList, ReadMessages, DeleteAcceptNotice, noticeNum } from '@/api/notice/receive';
import { receiveColumns, noticeStates, enumNoticeType } from './table.data';
import { AC_DELETE, AC_DETAILS, AC_PASS } from '@common/enum/pageEnum';

defineOptions({
  name: 'ReceiveManage'
});

const {
  userInfo: { id: userId },
  userOrgType
} = useUserStore();
const userStore = useUserStore();
const [register, { openModal }] = useModal();
const { pagination, setCount, setPage } = usePagination(() => {
  getList();
});
const { fetch: AcceptNoticePageListApi, loading } = useApi(getAcceptNoticePageList);

const initForm = {
  noticeTitle: null,
  noticeType: null,
  noticeState: null,
  userId
};
const formValue = reactive({ ...initForm });
const docList = shallowRef([]);
const selectArr = shallowRef([]);

const columns = receiveColumns(handleClick, userOrgType);

async function getList() {
  const { pageSize, page: pageNum } = pagination;
  const data = await AcceptNoticePageListApi({ pageSize, pageNum, ...formValue });
  const { records = [], total } = data;
  docList.value = records;
  setCount(~~total);
  selectArr.value = [];
}

// const handleReset = useThrottleFn(function () {
//   Object.assign(formValue, initForm);
//   handleSearch();
// }, 800);

const handleSearch = useThrottleFn(function () {
  setPage(1);
  getList();
}, 800);

async function readSingleMessage(row) {
  // 0代表已读 1代表未读
  if (row?.noticeState === 1) return;
  handleReadMessage([row?.noticeAcceptId]);
}

async function readPointMessages() {
  const noticeAcceptIdList = selectArr.value.reduce((pre, next) => {
    let { noticeState, noticeAcceptId } = JSON.parse(next) ?? {};
    if (noticeState === 0) {
      pre.push(noticeAcceptId);
    }
    return pre;
  }, []);

  if (!noticeAcceptIdList.length) return;
  handleReadMessage(noticeAcceptIdList, () => {
    window.$message.success('操作成功');
  });
}

async function handleReadMessage(noticeAcceptIdList, callback) {
  await ReadMessages({ noticeAcceptIdList });
  callback && callback();
  getList();
  const noticeSum = await noticeNum();
  userStore.setNoticeSum(noticeSum);
}

function deleteAcceptNotice() {
  window.$dialogError('将删除数据，是否继续？', async () => {
    const noticeAcceptIdList = selectArr.value.map(v => {
      let { noticeAcceptId } = JSON.parse(v);
      return noticeAcceptId;
    });
    await DeleteAcceptNotice({ noticeAcceptIdList });
    window.$message.success('删除成功');
    getList();
  });
}

function handleNoticeModal() {
  let noticeId = localStorage.getItem('noticeAcceptId');
  if (noticeId) {
    localStorage.removeItem('noticeAcceptId');
    openModal(true, { noticeAcceptId: noticeId });
    handleReadMessage([noticeId]);
  }
  return !noticeId;
}

function handleClick(key, row) {
  switch (key) {
    case AC_PASS:
      readPointMessages();
      break;
    case AC_DETAILS:
      openModal(true, { ...row, list: docList.value });
      readSingleMessage(row);
      break;
    case AC_DELETE:
      deleteAcceptNotice();
  }
}

onMounted(() => {
  let isList = handleNoticeModal();
  if (isList) {
    getList();
  }
});
</script>

<style scoped></style>
