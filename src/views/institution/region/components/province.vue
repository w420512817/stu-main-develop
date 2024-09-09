<template>
  <n-space vertical class="w-full">
    <div>
      <n-form inline :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="市级名称:">
            <n-input v-model:value="formValue.cityName" type="text" placeholder="请输入市级名称" clearable />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-space>
              <n-button type="primary" @click="onSearch">查询</n-button>
              <n-button type="primary" @click="openModal">批量导出</n-button>
            </n-space>
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
    <ExportModal @register="register" />
  </n-space>
</template>

<script setup>
import { ref, onMounted, reactive, toRaw } from 'vue';
import ExportModal from './ExportModal.vue';
// static data
import { createProvinceColumns } from '../region.data';
import { AC_DETAILS } from '@common/enum/pageEnum';

// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import { useThrottleFn } from '@vueuse/core';

// api
import { getCityList } from '@/api/institution';

const emits = defineEmits(['update-city']);

// init hooks, static data
const [register, { openModal }] = useModal();
const { fetch: getList, loading } = useApi(getCityList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});

const columns = createProvinceColumns((key, row) => onClickBtn(key, row));

const origin = {
  cityName: null
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
    ...toRaw(formValue),
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
      emits('update-city', row);
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
