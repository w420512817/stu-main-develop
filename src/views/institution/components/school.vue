<template>
  <n-space vertical class="w-full">
    <div>
      <n-form inline :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="学校名称:">
            <n-input v-model:value="formValue.schoolName" type="text" placeholder="请输入学校名称" clearable />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button type="primary" @click="onSearch">查询</n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>

    <n-data-table
      remote
      :render-cell="v => v ?? '/'"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
    />
  </n-space>
</template>

<script setup>
import { ref, onMounted, reactive, inject } from 'vue';
import { string } from 'vue-types';
import { useThrottleFn } from '@vueuse/core';

// static data
import { createColumns } from './compoents.data';
import { AC_DETAILS } from '@common/enum/pageEnum';

// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { associateSchoolPage } from '@/api/institution/school';

const query = inject('query');
const props = defineProps({
  type: string().def('society')
});

// init hooks, static data
const { fetch: getList, loading } = useApi(associateSchoolPage);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();

const columns = createColumns((key, row) => onClickBtn(key, row));

const origin = {
  schoolName: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);

/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...formValue,
    id: query.id,
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  data && setCount(~~data.total);
}

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_DETAILS:
      go({
        name: 'SchoolDetail',
        query: {
          id: row.schoolId,
          orgProperty: row.orgProperty,
          regionId: query.regionId,
          type: props.type
        }
      });
      break;
  }
}

/**
 * 查询
 */
const onSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);

onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
