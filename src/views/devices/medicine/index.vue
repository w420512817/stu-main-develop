<template>
  <n-card title="设备列表" class="h-full shadow-sm">
    <n-space vertical>
      <n-button v-auth="9391" type="primary" @click="handleClick(AC_ADD)">新增设备</n-button>
      <n-data-table remote striped :loading="loading" :columns="columns" :pagination="pagination" :data="dataSource" />
    </n-space>

    <Modal @register="register" @on-success="getDataSource" />
  </n-card>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted, unref } from 'vue';
import { NSpace, NButton } from 'naive-ui';
import Modal from './components/modal.vue';

import { getEquipmentPageList, DeleteEquipment } from '@/api/devices/medicine';
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';

import { createColumns } from './table.data.jsx';
import { AC_DELETE, AC_ADD } from '@common/enum/pageEnum';

defineOptions({
  name: 'DevicesManage'
});

const {
  userInfo: { orgId }
} = useUserStore();
const { fetch: getDevicesListApi, loading } = useApi(getEquipmentPageList);

const [register, { openModal }] = useModal();

const { pagination, setCount } = usePagination(() => {
  getDataSource();
});

const initForm = { user: null, organ: null, status: null };
const form = reactive({ ...initForm });

const dataSource = ref([]);
const columns = createColumns(handleClick);

async function getDataSource() {
  const { page: pageNum, pageSize } = pagination;
  const data = await getDevicesListApi({ pageNum, pageSize, ...unref(form), orgId });

  const { records = [], total } = data;
  dataSource.value = records;
  setCount(~~total);
}

function removeAccount({ equipmentId, equipmentModel }) {
  window.$dialogError(`将删除设备【${equipmentModel}】，是否继续？`, () => {
    return DeleteEquipment(equipmentId).then(res => {
      if (res) {
        window.$message.success('删除成功!');
        getDataSource();
      }
    });
  });
}

function handleClick(key, row) {
  switch (key) {
    case AC_ADD:
      openModal(true, {});
      break;
    case AC_DELETE:
      removeAccount(row);
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
