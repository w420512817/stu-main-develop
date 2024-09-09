<template>
  <n-card class="h-full shadow-sm" title="学生转出名单">
    <n-form class="w-full" inline label-placement="left" @keypress.enter="onSearch">
      <n-grid cols="2 m:3 l:4 xl:5 2xl:6" :x-gap="20" responsive="screen">
        <n-form-item-gi label="学生姓名:">
          <n-input v-model:value="formValue.studentName" type="text" placeholder="请输入学生姓名" clearable />
        </n-form-item-gi>
        <n-form-item-gi label="性别:">
          <n-select v-model:value="formValue.sex" :options="sexOptions" placeholder="请选择性别" clearable />
        </n-form-item-gi>
        <n-form-item-gi>
          <n-button type="primary" @click="onSearch">查询</n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-data-table
      remote
      :render-cell="v => v || '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
  </n-card>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
// hooks
import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
// static data
import { createTransferOutColumns } from './student.data';
import { sexOptions } from '../common.data';
// api
import { getStudentTransferList } from '@/api/information/student';

const origin = {
  switchType: 2,
  sex: null,
  studentName: null
};

const formValue = reactive({ ...origin });
const dataSource = ref([]);
const columns = createTransferOutColumns();
const { fetch: getList, loading } = useApi(getStudentTransferList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { query } = useRoute();

/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...formValue,
    orgId: query?.orgId ?? null,
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  setCount(~~data.total);
}
function onSearch() {
  setPage(1);
  getDataSource();
}

onMounted(() => {
  getDataSource();
});
</script>
