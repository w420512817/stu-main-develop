<template>
  <n-card class="h-full shadow-sm" :title="`${query.regionName} - 社会机构`">
    <n-space vertical class="w-full">
      <div>
        <n-form inline :model="formValue" label-placement="left" @keypress.enter="onSearch">
          <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
            <n-form-item-gi label="社会机构名称:">
              <n-input v-model:value="formValue.name" type="text" placeholder="请输入机构名称" clearable />
            </n-form-item-gi>
            <n-form-item-gi label="社会机构属性:">
              <n-select
                v-model:value="formValue.orgProperty"
                :options="societyAttrOptions"
                placeholder="请选择机构属性"
                clearable
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi>
              <n-button type="primary" @click="onSearch">查询</n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
      <n-button type="primary" class="mb-2" :loading="expLoading" @click="handleExport">批量导出</n-button>
      <n-data-table
        remote
        :render-cell="v => v ?? '/'"
        :loading="loading"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :row-key="row => row.id"
      />
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useThrottleFn } from '@vueuse/core';

// static data
import { createColumns } from './society.data';
import { AC_DETAILS } from '@common/enum/pageEnum';
import { societyAttrOptions } from '../common.data';
import { downloadByData } from '@common/utils/file/download';
// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { getsocietyList } from '@/api/institution/society';
import { exportSocialList } from '@/api/institution';

// init hooks, static data
const { fetch: expApi, loading: expLoading } = useApi(exportSocialList);
const { fetch: getList, loading } = useApi(getsocietyList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const { query } = useRoute();
const columns = createColumns((key, row) => onClickBtn(key, row));

const origin = {
  name: null,
  orgProperty: null,
  status: null,
  regionType: 3,
  regionId: query.regionId || null
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
        name: 'SocietyDetail',
        query: {
          id: row.id,
          orgProperty: row.orgProperty,
          ...query
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

async function handleExport() {
  let res = await expApi({ level: 3, areaId: query.regionId });
  let str = res.headers['content-disposition'].split(';')[1].split('=')[1];
  let fileName = decodeURIComponent(str);
  downloadByData(res.data, fileName);
}

onMounted(() => {
  getDataSource();
});

defineOptions({ name: 'SocietyList' });
</script>

<style scoped></style>
