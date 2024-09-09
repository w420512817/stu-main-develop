<template>
  <n-card :title="title" class="h-full shadow-sm">
    <div ref="pageHeaderElRef" class="overflow-auto">
      <slot name="header"></slot>
    </div>
    <n-data-table
      remote
      striped
      :border="false"
      :render-cell="v => v ?? '/'"
      :style="{ height: `calc(100% - ${headerHeight}px)` }"
      flex-height
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="pagination"
      v-bind="getTableProps"
    />
    <slot name="default"></slot>
  </n-card>
</template>

<script setup>
import { ref, toRaw, onMounted, computed, useAttrs } from 'vue';
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import useTableHeaderHeight from '@common/hooks/business/useTableHeaderHeight';
import { object, func, string, array } from 'vue-types';
import { useThrottleFn } from '@vueuse/core';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  title: string(),
  listApi: func(),
  formData: object().def({}),
  columns: array().def([]),
  paginationProps: object().def({}) // 自定义分页
});

const dataSource = ref([]);
const { fetch, loading } = useApi(props.listApi);

const { pageHeaderElRef, headerHeight } = useTableHeaderHeight();

const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
}, props.paginationProps);

const getTableProps = computed(() => {
  const attrs = useAttrs();
  const tableOpts = {
    rowKey: row => row.id,
    ...attrs
  };

  return tableOpts;
});

async function getDataSource() {
  const { page: pageNum, pageSize } = pagination;
  const data = await fetch({ pageNum, pageSize, ...toRaw(props.formData) });

  dataSource.value = data?.list ?? [];
  setCount(~~data.total);
}

onMounted(() => {
  getDataSource();
});

const handleSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);

defineExpose({
  getDataSource,
  handleSearch
});
</script>

<style scoped></style>
