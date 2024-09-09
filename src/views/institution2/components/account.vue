<template>
  <n-space vertical>
    <n-button
      :disabled="maxLimited"
      class="mb-20px"
      type="primary"
      @click="openModal(true, { key: AC_ADD, orgId: query.id, orgType: query.orgProperty })"
    >
      新增机构账号
    </n-button>
    <n-data-table remote :loading="loading" :columns="columns" :data="dataSource" :pagination="pagination" />
    <AddAccount @register="register" @on-success="onSearch" />
    <ResetPasswd @register="registerReset" />
  </n-space>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { number } from 'vue-types';
import { DeleteUser } from '@/api/systemManage/account';
import { GetAccountList } from '@/api/systemManage/account';
// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';

// static data
import { createAccountColumns } from './components.data';
import { AC_EDIT, AC_DELETE, AC_ADD, AC_RESET } from '@common/enum/pageEnum';

import AddAccount from '../modal/AddAccount.vue';
import ResetPasswd from '../modal/ResetPasswd.vue';
import { useModal } from '@common/components/custom/Modal';

const query = inject('query');
const props = defineProps({
  max: number().def(10)
});

const maxLimited = computed(() => {
  return props.max <= itemCount.value;
});
const dataSource = ref([]);
const columns = createAccountColumns((key, row) => onClickBtn(key, row));
const [register, { openModal }] = useModal();
const [registerReset, { openModal: openModalReset }] = useModal();
const { fetch: getList, loading } = useApi(GetAccountList);
const { itemCount, pagination, setCount, setPage } = usePagination(
  () => {
    getDataSource();
  },
  { pageSizes: [5], pageSize: 5 }
);
function onClickBtn(key, row) {
  switch (key) {
    case AC_DELETE:
      secondConfirm(row);
      break;
    case AC_EDIT:
      openModal(true, { key: AC_EDIT, ...row, orgType: query.orgProperty, orgId: query.id });
      break;
    case AC_RESET:
      openModalReset(true, row);
  }
}
function secondConfirm({ id }) {
  window.$dialogError('是否删除？', () => {
    return DeleteUser({ userId: id }).then(() => {
      window.$message.success('删除成功');
      setPage(1);
      getDataSource();
    });
  });
}

/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    orgId: query.id,
    current,
    size
  };
  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  data && setCount(~~data.total);
}
function onSearch() {
  setPage(1);
  getDataSource(0);
}
onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
