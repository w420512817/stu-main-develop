<template>
  <n-card class="h-full shadow-sm">
    <n-space vertical>
      <n-form inline :model="formValue" label-placement="left" label-width="auto" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen">
          <n-form-item-gi label="机构名称:" label-align="left">
            <n-input v-model:value="formValue.orgName" type="text" placeholder="请输入" clearable flex-1 />
          </n-form-item-gi>

          <n-gi>
            <search-buttons @search="onSearch" @reset="onReset" />
          </n-gi>
        </n-grid>
      </n-form>
      <div class="flex mb-4">
        <n-button type="primary" size="small" @click="handleClick(AC_ADD)">新增机构</n-button>
      </div>
      <n-data-table
        :render-cell="v => v ?? '/'"
        remote
        striped
        :row-key="v => v.orgId"
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="dataSource"
        @load="onLoad"
      />
    </n-space>
  </n-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';
import { useGo } from '@common/hooks/usePage';

import { getAreaOrg, changeGovernmentStatus, deleteGovernment } from '@/api/institution2';
import { createColumns } from '../index.data';
import { AC_STOP_START, AC_DELETE, AC_DETAILS, AC_ADD } from '@common/enum/pageEnum';

const { go } = useGo();
const { userInfo } = useUserStore();
const origin = {
  orgName: null,
  manageAreaId: userInfo.manageAreaId
};
const formValue = reactive({ ...origin });

const { fetch: getAreaOrgApi, loading } = useApi(getAreaOrg);

const { pagination, setCount } = usePagination(() => {
  getDataSource();
});

const dataSource = ref([]);
const columns = createColumns(handleClick);

async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const data = await getAreaOrgApi({ current, size, ...formValue });
  const { list = [], total } = data;
  list.forEach(item => {
    item.isLeaf = item.level >= 3 || item.orgId === userInfo.orgId;
  });
  dataSource.value = list;
  setCount(~~total);
}

async function onLoad(row) {
  let res = await getAreaOrgApi({ manageAreaId: row.manageAreaId, current: 1, size: 999 });
  res.list = res.list || [];
  res.list.forEach(item => {
    item.isLeaf = item.level >= 3;
  });
  row.children = res.list;
}

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function handleClick(key, row) {
  switch (key) {
    case AC_ADD:
      go('/institution/gov-modify');
      break;
    case AC_DETAILS:
      go({
        name: 'GovDetail',
        query: {
          id: row.orgId,
          orgProperty: 8
        }
      });
      break;
    case AC_DELETE:
      deleteRow(row);
      break;
    case AC_STOP_START:
      changeStatusModel(row);
      break;
  }
}
function changeStatusModel(row) {
  const { orgName, orgId: id, status } = row;
  const dialogContent = `您正在${status ? '启用' : '停用'}机构【${orgName}】`;
  window.$dialogWarning(dialogContent, () => {
    return changeGovernmentStatus({ id, status: status ? 0 : 1 }).then(() => {
      window.$message.success('操作成功');
      onSearch();
    });
  });
}
function deleteRow(row) {
  const { orgName, orgId: id } = row;
  window.$dialogError(`您正在删除机构【${orgName}】`, () => {
    return deleteGovernment({ id }).then(() => {
      window.$message.success('操作成功');
      onSearch();
    });
  });
}

const onSearch = () => {
  getDataSource();
};
const onReset = () => {
  Object.assign(formValue, { ...origin });
  getDataSource();
};

onMounted(async () => {
  getDataSource();
});
</script>

<style scoped lang="less"></style>
