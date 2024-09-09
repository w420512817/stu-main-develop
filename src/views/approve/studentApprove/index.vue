<template>
  <n-card>
    <n-form ref="formRef" inline :label-width="80" @keypress.enter="onSearch">
      <n-form-item label="申请类型:" label-placement="left" class="mt-xl">
        <n-select v-model:value="formValue.changeType" w-260px :options="changeTypes" placeholder="请选择申请类型" />
      </n-form-item>
      <n-form-item label="状态:" label-placement="left" class="mt-xl">
        <n-select v-model:value="formValue.approvalStatus" w-260px :options="auditStatus" placeholder="请选择状态" />
      </n-form-item>
      <n-form-item>
        <search-buttons ml-6 @search="onSearch" @reset="onReset" />
      </n-form-item>
    </n-form>
    <n-data-table remote :loading="loading" :columns="columns" :data="dataSource" :pagination="pagination" />
    <modal :title="modalTitle" :mask-closable="false" @register="register" @on-success="getDataSource" />
  </n-card>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useThrottleFn } from '@vueuse/core';
// hooks
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
// static data
import { AC_PASS, AC_REJECT, AC_DETAILS } from '@common/enum/pageEnum';
// api
import { pageList } from '@/api/approve/studentApprove';

// modal
import modal from './components/modal.vue';
import { createColumns, auditStatus, changeTypes } from './index.data';

const modalTitle = ref('');

const origin = {
  changeType: null,
  approvalStatus: null
};
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const columns = createColumns((key, row) => onClickBtn(key, row));
const [register, { openModal }] = useModal();
const { fetch: getList, loading } = useApi(pageList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row = {}) {
  const {
    id,
    changeType,
    applicationContent,
    originalField,
    currentField,
    proposerName,
    operatorName,
    approvalStatus
  } = row;
  switch (key) {
    case AC_PASS:
      modalTitle.value = '通过申请';
      openModal(true, {
        key: AC_PASS,
        id,
        changeType,
        applicationContent,
        originalField,
        currentField,
        proposerName,
        approvalStatus: 1
      });
      break;
    case AC_REJECT:
      modalTitle.value = '驳回申请';
      openModal(true, {
        key: AC_REJECT,
        id,
        changeType,
        applicationContent,
        originalField,
        currentField,
        proposerName,
        approvalStatus: 3
      });
      break;
    case AC_DETAILS:
      modalTitle.value = '查看申请';
      openModal(true, {
        key: AC_DETAILS,
        id,
        changeType,
        applicationContent,
        originalField,
        currentField,
        proposerName,
        operatorName,
        approvalStatus
      });
      break;
  }
}
/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...formValue,
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  setCount(~~data.total);
}

/**
 * 查询
 */
const onSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);

function onReset() {
  Object.assign(formValue, origin);
  onSearch();
}

onMounted(() => {
  getDataSource();
});
</script>
