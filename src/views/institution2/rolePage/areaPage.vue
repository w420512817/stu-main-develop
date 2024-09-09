<template>
  <n-card class="h-full shadow-sm" title="学校">
    <n-space vertical class="w-full">
      <n-form inline :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="学校名称:">
            <n-input v-model:value="formValue.name" type="text" placeholder="请输入学校名称" />
          </n-form-item-gi>
          <n-form-item-gi label="学校属性:">
            <n-select v-model:value="formValue.orgProperty" :options="schoolAttrOptions" placeholder="请选择学校属性" />
          </n-form-item-gi>
          <n-form-item-gi label="学段:">
            <n-select
              v-model:value="formValue.schoolTypes"
              :options="schoolLearnPeriod"
              multiple
              max-tag-count="responsive"
              placeholder="请选择学段"
            />
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:">
            <area-cascader
              v-model:value="formValue.regionId"
              check-strategy="all"
              placeholder="请选择所属地区"
              @update:val="updateSelect"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学校类型:">
            <n-select v-model:value="formValue.schoolType" :options="schoolTypeOptions" placeholder="请选择学校类型" />
          </n-form-item-gi>
          <n-form-item-gi label="学校级别:">
            <n-select
              v-model:value="formValue.schoolLevel"
              :options="schoolLevelOptions"
              placeholder="请选择学校级别"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学制:">
            <n-select
              v-model:value="formValue.schoolSystemId"
              :list-api="eduListVO"
              label-field="educationalSystem"
              value-field="id"
              placeholder="请选择学制"
              :options="schoolSystemOptions"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学校状态:">
            <n-select v-model:value="formValue.status" :options="schoolStausOptions" placeholder="请选择学校状态" />
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
      <div class="flex mb-4">
        <n-button type="primary" size="small" @click="onClickBtn(AC_ADD)">新增学校</n-button>
      </div>

      <n-data-table remote :loading="loading" :columns="columns" :data="dataSource" :pagination="pagination" />
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import {
  createColumns,
  schoolAttrOptions,
  schoolTypeOptions,
  schoolStausOptions,
  schoolLevelOptions,
  schoolLearnPeriod
} from '../school.data';
import { AC_ADD, AC_DELETE, AC_DETAILS, AC_STOP_START } from '@common/enum/pageEnum';

import { useThrottleFn } from '@vueuse/core';
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

import { getSchoolList, changeSchoolStatus, deleteSchool, eduListVO } from '@/api/institution2';

const { fetch: getList, loading } = useApi(getSchoolList);
const { fetch: getSchoolSystemOptions } = useApi(eduListVO);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();

const columns = createColumns(onClickBtn);

const origin = {
  name: null,
  schoolTypes: null,
  orgProperty: null,
  schoolType: null,
  schoolLevel: null,
  type: null,
  regionId: null,
  regionType: null,
  schoolSystemId: null,
  status: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolSystemOptions = ref([]);

const updateSelect = option => {
  Object.assign(formValue, option);
};

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
    case AC_ADD:
      go({ name: 'SchoolModify' });
      break;
    case AC_DETAILS:
      go({
        name: 'SchoolDetail',
        query: {
          id: row.id,
          orgProperty: row.orgProperty
          // orgType: 9
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
  const { name, status, id } = row;
  const dialogContent = `您正在${status ? '启用' : '停用'}机构【${name}】`;
  window.$dialogWarning(dialogContent, () => {
    return changeSchoolStatus({ id, status: status ? 0 : 1 }).then(() => {
      window.$message.success('操作成功');
      onSearch();
    });
  });
}
function deleteRow(row) {
  const { name, id, orgProperty } = row;
  window.$dialogError(`您正在删除机构【${name}】`, () => {
    return deleteSchool({ id, orgProperty }).then(() => {
      window.$message.success('成功删除');
      onSearch();
    });
  });
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
async function getSchoolSystem() {
  const data = await getSchoolSystemOptions();
  schoolSystemOptions.value = data || [];
}
onMounted(() => {
  getDataSource();
  getSchoolSystem();
});
defineOptions({ name: 'SchoolList' });
</script>

<style scoped></style>
