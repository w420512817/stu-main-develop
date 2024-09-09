<template>
  <n-card class="h-full shadow-sm" :title="`${query.regionName} - 学校`">
    <n-space vertical class="w-full">
      <div>
        <n-form inline :model="formValue" label-placement="left" label-width="90" @keypress.enter="onSearch">
          <n-grid cols="2 md:3 xl:4 2xl:4 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
            <n-form-item-gi label="学校名称:">
              <n-input v-model:value="formValue.name" type="text" placeholder="请输入学校名称" />
            </n-form-item-gi>
            <n-form-item-gi label="学校属性:">
              <n-select
                v-model:value="formValue.orgProperty"
                :options="schoolAttrOptions"
                placeholder="请选择学校属性"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学段:">
              <n-select
                v-model:value="formValue.schoolTypes"
                :options="schoolLearnPeriod"
                multiple
                max-tag-count="responsive"
                placeholder="请选择学段"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学校类型:">
              <n-select
                v-model:value="formValue.schoolType"
                :options="schoolTypeOptions"
                placeholder="请选择学校类型"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学校级别:">
              <n-select
                v-model:value="formValue.schoolLevel"
                :options="schoolLevelOptions"
                placeholder="请选择学校级别"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi label="举办者类型:">
              <n-select
                v-model:value="formValue.officeCategory"
                :options="orgType"
                placeholder="请选择举办者类型"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学制:">
              <n-select
                v-model:value="formValue.schoolSystemId"
                :options="schoolSystemOptions"
                label-field="educationalSystem"
                value-field="id"
                placeholder="请选择学制"
                @update:value="onSearch"
              />
            </n-form-item-gi>
            <n-gi suffix #="{ overflow }">
              <n-form-item>
                <search-buttons
                  breakpoint="3xl"
                  :overflow="overflow"
                  @search="onSearch"
                  @reset="onReset"
                  @collapse="gridCollapsed = !gridCollapsed"
                />
              </n-form-item>
            </n-gi>
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
      />
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

// static data
import { createColumns } from './school.data';
import { schoolAttrOptions, schoolTypeOptions, schoolLevelOptions, schoolLearnPeriod, orgType } from '../common.data';
import { AC_DETAILS } from '@common/enum/pageEnum';
import { downloadByData } from '@common/utils/file/download';

// hooks
import { useRoute } from 'vue-router';
import { useThrottleFn } from '@vueuse/core';
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { getSchoolList, eduListVO } from '@/api/institution/school';
import { exportSchoolList } from '@/api/institution';

// init hooks, static data
const { fetch: getList, loading } = useApi(getSchoolList);
const { fetch: eduList } = useApi(eduListVO);
const { fetch: expApi, loading: expLoading } = useApi(exportSchoolList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const { query } = useRoute();

const columns = createColumns((key, row) => onClickBtn(key, row));

const origin = {
  name: null,
  schoolTypes: null,
  orgProperty: null,
  schoolType: null,
  schoolLevel: null,
  regionId: query.regionId || null,
  regionType: 3,
  schoolSystemId: null,
  officeCategory: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolSystemOptions = ref([]);

/**
 * 获取 table 数据
 */
async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  const { schoolTypes } = formValue;
  const schoolTypesSt = schoolTypes?.join(',') ?? null;
  const params = {
    ...formValue,
    schoolTypes: schoolTypesSt,
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
function onReset() {
  Object.assign(formValue, origin);
  onSearch();
}
async function getOptions() {
  const data = await eduList();
  if (!data) return;
  schoolSystemOptions.value = data;
}

async function handleExport() {
  let res = await expApi({ level: 3, areaId: query.regionId });
  let str = res.headers['content-disposition'].split(';')[1].split('=')[1];
  let fileName = decodeURIComponent(str);
  downloadByData(res.data, fileName);
}

onMounted(() => {
  getDataSource();
  getOptions();
});
defineOptions({ name: 'SchoolList' });
</script>

<style scoped></style>
