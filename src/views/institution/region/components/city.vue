<template>
  <n-space vertical class="w-full">
    <div>
      <n-form inline-block :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="区级名称:">
            <n-input v-model:value="formValue.regionName" type="text" placeholder="请输入区级名称" clearable />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-space>
              <n-button type="primary" @click="onSearch">查询</n-button>
              <n-button type="primary" @click="openModal">批量导出</n-button>
            </n-space>
          </n-form-item-gi>
          <n-gi v-if="props.orgLevel == 1" suffix #="{ overflow }" text-right>
            <n-button type="primary" @click="jumpPre">返回上一页</n-button>
          </n-gi>
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
import { ref, onMounted, reactive, inject, toRaw } from 'vue';
import ExportModal from './ExportModal.vue';
// static data
import { createCityColumns } from '../region.data';
import { AC_SCHOOL, AC_HOSPTIAL, AC_SOCIETY } from '@common/enum/pageEnum';

// hooks
import { useThrottleFn } from '@vueuse/core';
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import { useGo } from '@common/hooks/usePage';

// api
import { getAreaList } from '@/api/institution';

const emits = defineEmits(['toggle']);

// init hooks, static data
const [register, { openModal }] = useModal();
const { fetch: getList, loading } = useApi(getAreaList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const props = inject('state');

const columns = createCityColumns((key, row) => onClickBtn(key, row));

const origin = {
  regionName: null
};

const formValue = reactive({ ...origin });
const dataSource = ref([]);
const gridCollapsed = ref(true);

/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...props,
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
  console.log(row);
  let query = {
    regionId: row.regionId,
    regionName: row.regionName
  };
  switch (key) {
    // AC_SCHOOL, AC_HOSPTIAL, AC_SOCIETY
    case AC_SCHOOL:
      go({
        name: 'SchoolList',
        query
      });
      break;
    case AC_HOSPTIAL:
      go({
        name: 'HosptialList',
        query
      });
      break;
    case AC_SOCIETY:
      go({
        name: 'SocietyList',
        query
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

const jumpPre = () => {
  emits('toggle');
};
onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
