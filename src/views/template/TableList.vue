<template>
  <page-table-container
    ref="tableElRef"
    title="账户列表2"
    :list-api="getAccountList"
    :columns="columns"
    :form-data="formData"
    @update:checked-row-keys="keys => (checkedRowKeys = keys)"
  >
    <template #header>
      <n-form label-placement="left" inline @keypress.enter="tableElRef?.handleSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="姓名">
            <n-input v-model:value="formData.name" />
          </n-form-item-gi>

          <n-form-item-gi label="开启状态">
            <n-select
              v-model:value="formData.status"
              :options="[
                { label: 'Drive My Car', value: 'song1' },
                { label: 'Norwegian Wood', value: 'song2' }
              ]"
            />
          </n-form-item-gi>

          <n-form-item-gi label="姓名">
            <n-input />
          </n-form-item-gi>

          <n-form-item-gi label="状态">
            <n-select :options="[]" />
          </n-form-item-gi>

          <n-form-item-gi label="状态">
            <n-select :options="[]" />
          </n-form-item-gi>

          <n-gi suffix #="{ overflow }">
            <n-form-item>
              <search-buttons
                breakpoint="3xl"
                :overflow="overflow"
                @search="tableElRef?.handleSearch"
                @reset="resetForm"
                @collapse="gridCollapsed = !gridCollapsed"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>

      <n-space mb-4>
        <n-button type="primary" size="small" secondary>开启</n-button>
        <n-button type="warning" size="small" secondary>关闭</n-button>
        <n-button type="error" size="small" secondary @click="handleTableClick(AC_DELETE)">删除</n-button>
      </n-space>
    </template>

    <Modal title="基础示例" :user-data="{ filed: 1111 }" @register="register" />
    <Modal2 title="动态数据重置" @register="register2" />
  </page-table-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Modal from './components/modal.vue';
import Modal2 from './components/modal2.vue';
import { createColumns } from './table.data';
import { useModal } from '@common/components/custom/Modal';
import { getAccountList /* AccountBusinessList */ } from '@common/api/system/common';

import { AC_DETAILS, AC_DELETE, AC_CANCEL } from '@common/enum/pageEnum';

const form = {
  name: null,
  status: null
};

const formData = reactive({ ...form });
const tableElRef = ref(null);
const checkedRowKeys = ref([]);

const [register, { openModal }] = useModal();
const [register2, { openModal: openModal2 }] = useModal();

const gridCollapsed = ref(true);

const columns = createColumns({
  handleTableClick
});

function handleTableClick(key, row = {}) {
  switch (key) {
    case AC_DETAILS: // 查看
      showDetail(row);
      break;
    case AC_DELETE: // 删除
      window.$dialogError('是否删除？', () => {
        return deleteItem(row).then(() => {
          tableElRef.value.getDataSource();
          window.$message.success('成功删除');
        });
      });
      break;
    case AC_CANCEL: // 取消
      // ...
      break;
  }
}

function deleteItem() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({});
    }, 1000);
  });
}

function resetForm() {
  Object.assign(formData, form);
  tableElRef.value.handleSearch();
}

function showDetail(row) {
  console.log(row);
  // openModal(true, {
  //   data: 'content',
  //   info: 'Info'
  // });

  openModal();
  openModal2();
}
</script>
<style scoped></style>
