<template>
  <n-card class="h-full shadow-sm" title="学生转入名单">
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
import { AC_PASS, AC_REJECT } from '@common/enum/pageEnum';
import { createTransferInColumns } from './student.data';
import { sexOptions } from '../common.data';
// api
import { getStudentTransferList, studentTransferCheck } from '@/api/information/student';

const origin = {
  switchType: 1,
  sex: null,
  studentName: null
};

const formValue = reactive({ ...origin });
const dataSource = ref([]);
const columns = createTransferInColumns((key, row) => onClickBtn(key, row));
const { fetch: getList, loading } = useApi(getStudentTransferList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { query } = useRoute();

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_REJECT:
      studentTransfer(row, 0);
      break;
    case AC_PASS:
      studentTransfer(row, 1);
      break;
  }
}
function studentTransfer(row, pass) {
  const { id: studentTransferId } = row;
  const str = pass ? '通过转入申请' : '驳回转入申请';
  const approvalStatus = pass ? 1 : 3;
  window.$dialogWarning(str, () => {
    return studentTransferCheck({ studentTransferId, approvalStatus }).then(() => {
      window.$message.success('操作成功');
      onSearch();
    });
  });
}

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
