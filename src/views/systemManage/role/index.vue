<template>
  <n-card title="角色列表" class="h-full shadow-sm">
    <n-space vertical>
      <n-button v-auth="9386" type="primary" @click="handleClick(AC_ADD)">新增角色</n-button>
      <n-data-table
        :render-cell="v => v ?? '/'"
        remote
        striped
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="dataSource"
      />
    </n-space>

    <Modal @register="register" @on-success="getDataSource" />
  </n-card>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted } from 'vue';
import Modal from './components/modal.vue';

import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';

import { GetRoleList, DeletePermissionRole } from '@/api/systemManage/role';
import { createColumns } from './table.data.jsx';
import { AC_DELETE, AC_EDIT, AC_ADD, AC_DETAILS } from '@common/enum/pageEnum';

defineOptions({
  name: 'RoleManage'
});

const {
  userInfo: { orgId }
} = useUserStore();
const { fetch: getRoleListApi, loading } = useApi(GetRoleList);

const [register, { openModal }] = useModal();

const { pagination, setCount } = usePagination(() => {
  getDataSource();
});

const initForm = { orgId };
const form = reactive({ ...initForm, type: 4 });

const dataSource = ref([]);
const columns = createColumns(handleClick);

async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const data = await getRoleListApi({ current, size, ...form });

  const { records = [], total } = data;
  dataSource.value = records;

  setCount(~~total);
}

function deletePermissionRole({ id, name }) {
  window.$dialogError(`是否确认删除角色【${name}】？删除后将无法恢复，请谨慎操作！`, async () => {
    await DeletePermissionRole({ roleId: id, type: form.type });
    window.$message.success('操作成功!');
    getDataSource();
  });
}

function handleClick(key, row) {
  switch (key) {
    case AC_ADD:
      openModal(true, { key, row });
      break;
    case AC_DELETE:
      deletePermissionRole(row);
      break;
    case AC_EDIT:
      openModal(true, { key, row });
      break;
    case AC_DETAILS:
      openModal(true, { key, row });
      break;
  }
}

onMounted(() => {
  getDataSource();
});
</script>

<style scoped lang="less">
.n-input {
  width: 200px;
}
:deep(.status-label) {
  font-size: 12px;
  .statusClass2 {
    color: #eb7347;
  }
  .statusClass0 {
    color: #c03639;
  }
  .statusClass1 {
    color: var(--primary-color);
  }
}
</style>
