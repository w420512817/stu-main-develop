<template>
  <n-card title="发送通知列表" class="h-full shadow-sm">
    <n-form label-placement="left" label-align="right" label-width="auto" :modal="formValue" @keypress.enter="getList">
      <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen">
        <n-form-item-gi label="通知标题：">
          <n-input v-model:value="formValue.noticeTitle" clearable />
        </n-form-item-gi>

        <n-form-item-gi label="发送状态：">
          <n-select v-model:value="formValue.noticeSendStatus" :options="noticeSendStatues" clearable />
        </n-form-item-gi>

        <n-form-item-gi>
          <n-button type="primary" @click="handleSearch">查询</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-auth="9373" mb-4>
      <n-button type="primary" size="small" @click="handleTableClick(AC_ADD)">新增通知</n-button>
    </n-space>
    <n-data-table
      :columns="columns"
      :data="docList"
      :loading="loading"
      :pagination="pagination"
      striped
      scroll-x="1200"
      remote
      :render-cell="v => v ?? '/'"
    />
    <Modal @register="register" />
  </n-card>
</template>

<script setup>
import { shallowRef, reactive, onMounted } from 'vue';
import Modal from '../receive/components/modal.vue';

import { useGo } from '@common/hooks/usePage.js';
import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
import { useThrottleFn } from '@vueuse/core';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';

import { getSendNoticePageList, SendNoticeSoon, DeleteNotice } from '@/api/notice/send';
import { sendColumns, noticeSendStatues } from './table.data.jsx';
import { AC_ADD, AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';

defineOptions({
  name: 'SendManage'
});

const {
  userInfo: { id: userId }
} = useUserStore();
const [register, { openModal }] = useModal();
const { go } = useGo();
const { pagination, setCount, setPage } = usePagination(() => {
  getList();
});
const { fetch: SendNoticePageListApi, loading } = useApi(getSendNoticePageList);

const formValue = reactive({ userId });

const docList = shallowRef([]);
const columns = sendColumns(handleTableClick);

async function getList() {
  const { pageSize, page: pageNum } = pagination;
  const data = await SendNoticePageListApi({ pageSize, pageNum, ...formValue });
  const { records = [], total } = data;
  docList.value = records;
  setCount(+total);
}

const handleSearch = useThrottleFn(function () {
  setPage(1);
  getList();
}, 800);

async function sendMessage({ noticeSendId }) {
  await SendNoticeSoon(noticeSendId);
  window.$message.success('发送成功');
  getList();
}

function deleteNotice({ noticeSendId }) {
  window.$dialogError('将删除数据，是否继续？', async () => {
    await DeleteNotice(noticeSendId);
    getList();
    window.$message.success('删除成功');
  });
}

function handleTableClick(key, row) {
  switch (key) {
    case AC_ADD:
      go({ name: 'sendModify' });
      break;
    case AC_EDIT:
      go({ name: 'sendModify', query: { noticeSendId: row.noticeSendId } });
      break;
    case 'AC_SEND':
      sendMessage(row);
      break;
    case AC_DELETE:
      deleteNotice(row);
      break;
    case AC_DETAILS:
      openModal(true, row);
  }
}

onMounted(() => {
  getList();
});
</script>

<style scoped></style>
