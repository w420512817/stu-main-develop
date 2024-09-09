<template>
  <n-card title="评分规则管理" class="h-full shadow-sm">
    <n-form label-placement="left" label-align="right" label-width="auto" :modal="formValue" @keypress.enter="getList">
      <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen">
        <n-form-item-gi label="应用名称：">
          <n-select
            v-model:value="state.appId"
            :options="state.appsSelects"
            clearable
            value-field="appId"
            label-field="appNameVersion"
          />
        </n-form-item-gi>

        <n-form-item-gi>
          <n-button type="primary" @click="handleSearch">查询</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space v-auth="9398" mb-4>
      <n-button type="primary" size="small" @click="handleTableClick(AC_ADD)">新增规则</n-button>
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
    <Modal @register="register" @on-success="onSuccess" />
  </n-card>
</template>

<script setup>
import { shallowRef, reactive, onMounted } from 'vue';
import Modal from './modal.vue';

import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
import { useThrottleFn } from '@vueuse/core';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';

import { SendNoticeSoon } from '@/api/notice/send';
import { getRulesList, getAppList, deleteRules } from '@/api/scoreRule/index.js';
import { sendColumns } from './table.data';
import { AC_ADD, AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';

defineOptions({
  name: 'SendManage'
});

const {
  userInfo: { id: userId, orgId }
} = useUserStore();
const [register, { openModal }] = useModal();
const { pagination, setCount, setPage } = usePagination(() => {
  getList();
});
const { fetch: PageListApi, loading } = useApi(getRulesList);

const formValue = reactive({ userId });

const docList = shallowRef([]);
const columns = sendColumns(handleTableClick);
let state = reactive({
  appsSelects: [],
  appId: null
});
getAppList({ orgId }).then(d => {
  const res = d.map(item => {
    return {
      ...item,
      appId: `${item.appId}-${item.appVersion}`,
      appNameVersion: `${item.appName}-${item.appVersion}`
    };
  });
  state.appsSelects = res;
});
async function getList() {
  const { pageSize, page: pageNum } = pagination;
  let appId = state.appId?.split('-')[0];
  const data = await PageListApi({ pageSize, pageNum, appId });
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

function deleteNotice({ rulesId }) {
  window.$dialogError('将删除数据，是否继续？', async () => {
    await deleteRules({ rulesId });
    getList();
    window.$message.success('删除成功');
  });
}

function handleTableClick(key, row) {
  switch (key) {
    case AC_ADD:
      openModal(true, { type: 0 });
      break;
    case AC_EDIT:
      openModal(true, { ...row, type: 2 });
      break;
    case 'AC_SEND':
      sendMessage(row);
      break;
    case AC_DELETE:
      deleteNotice(row);
      break;
    case AC_DETAILS:
      openModal(true, { ...row, type: 1 });
  }
}

onMounted(() => {
  getList();
});
function onSuccess() {
  getList();
}
</script>

<style scoped></style>
