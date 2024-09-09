<template>
  <n-card :title="title" class="h-full shadow-sm">
    <div ref="pageHeaderElRef" class="overflow-auto">
      <slot name="header"></slot>
    </div>
    <slot name="center"></slot>
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
import { cloneDeep } from 'lodash-es';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  title: string(),
  listApi: func(),
  formData: object().def({}),
  columns: array().def([]),
  paginationProps: object().def({}), // 自定义分页
  paginationKey: object().def({ pageKey: 'current', pageSizeKey: 'size', list: 'records' }),
  paramsCb: func()
});

const dataSource = ref([]);
const { fetch, loading } = useApi(props.listApi);

const { pageHeaderElRef, headerHeight } = useTableHeaderHeight();

const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
}, props.paginationProps);

const getTableProps = computed(() => {
  const attrs = useAttrs();
  console.log(attrs);
  const tableOpts = {
    rowKey: row => row.id,
    ...attrs
  };

  return tableOpts;
});

async function getDataSource() {
  let { page: pageNum, pageSize } = pagination;
  let { pageKey, pageSizeKey, list } = props.paginationKey;
  const params = props.paramsCb?.(cloneDeep(props.formData)) || props.formData;
  const data = await fetch({ [pageKey]: pageNum, [pageSizeKey]: pageSize, ...toRaw(params) });
  dataSource.value = data?.[list] ?? [];
  setCount(~~data.total);
}

onMounted(() => {
  getDataSource();
});

const handleSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 600);

defineExpose({
  getDataSource,
  handleSearch
});
</script>

<style scoped></style>
