<template>
  <n-card class="h-full shadow-sm" title="学校">
    <n-space vertical class="w-full">
      <div>
        <n-form inline :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
          <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
            <n-form-item-gi label="学校名称:">
              <n-input v-model:value="formValue.name" type="text" placeholder="请输入学校名称" />
            </n-form-item-gi>
            <n-form-item-gi label="学校属性:">
              <n-select
                v-model:value="formValue.orgProperty"
                :options="schoolAttrOptions"
                placeholder="请选择学校属性"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi label="学段:">
              <n-select
                v-model:value="formValue.schoolTypes"
                :options="schoolLearnPeriod"
                multiple
                clearable
                max-tag-count="responsive"
                placeholder="请选择学段"
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="isGoverOrg" label="所属地区:">
              <area-cascader
                v-model:value="formValue.regionId"
                check-strategy="all"
                clearable
                :options="authAreaList"
                placeholder="请选择所属地区"
                @update:val="updateSelect"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学校类型:">
              <n-select
                v-model:value="formValue.schoolType"
                :options="schoolTypeOptions"
                clearable
                placeholder="请选择学校类型"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学校级别:">
              <n-select
                v-model:value="formValue.schoolLevel"
                :options="schoolLevelOptions"
                clearable
                placeholder="请选择学校级别"
              />
            </n-form-item-gi>
            <n-form-item-gi label="学制:">
              <n-select
                v-model:value="formValue.schoolSystem"
                :options="schoolSystemOptions"
                clearable
                label-field="educationalSystem"
                value-field="id"
                placeholder="请选择学制"
              />
            </n-form-item-gi>
            <n-gi suffix #="{ overflow }">
              <search-buttons
                breakpoint="3xl"
                has-collapsed
                :overflow="overflow"
                @search="onSearch"
                @reset="onReset"
                @collapse="gridCollapsed = !gridCollapsed"
              />
            </n-gi>
          </n-grid>
        </n-form>
      </div>
      <div class="flex gap-x-12px mb-4">
        <n-button v-auth="19309" type="primary" size="small" @click="onClickBtn(AC_ADD)">新增学校</n-button>
        <n-button v-auth="19310" size="small" type="primary" @click="openImportModel">批量导入</n-button>
        <!--TODO 新的权限组-->
      </div>

      <n-data-table
        remote
        :render-cell="v => v || '/'"
        :loading="loading"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
      />
    </n-space>
    <syncImportModal
      type="school"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, data)"
    />
    <syncImportResult type="school" @register="registerResultModal" @on-success="onSearch" />
  </n-card>
</template>

<script setup>
import { ref, onMounted, reactive, computed, onActivated } from 'vue';
import { useThrottleFn } from '@vueuse/core';

// static data
import {
  createColumns,
  schoolAttrOptions,
  schoolTypeOptions,
  schoolLevelOptions,
  schoolLearnPeriod
} from './school.data';

import { AC_DETAILS, AC_CLASS_MANAGER, AC_ADD, AC_EDIT } from '@common/enum/pageEnum';

// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';
import { useUserStore } from '@/store';
import { useModal } from '@common/components/custom/Modal';

// api
import { getSchoolList, eduSelectBox, authArea } from '@/api/information/school';

import syncImportModal from './components/syncImportModal.vue';
import syncImportResult from './components/syncImportResult.vue';

const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();

// init hooks, static data
const { fetch: getList, loading } = useApi(getSchoolList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const { userOrgType } = useUserStore();

const isGoverOrg = computed(() => userOrgType === 'GOVERMENT');

const columns = computed(() => {
  return createColumns((key, row) => onClickBtn(key, row));
});

const origin = {
  name: null,
  schoolTypes: null,
  orgProperty: null,
  schoolType: null,
  schoolLevel: null,
  type: null,
  regionId: null,
  regionType: null,
  schoolSystem: null,
  status: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const schoolSystemOptions = ref([]);
const authAreaList = ref([]);

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

async function getAuthArea() {
  const data = await authArea();
  authAreaList.value = [data];
}

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_ADD:
      go({ name: 'SchoolInformationModify' });
      break;
    case AC_EDIT:
      go({
        name: 'SchoolInformationModify',
        query: {
          id: row.id,
          orgProperty: row.orgProperty
        }
      });
      break;
    case AC_DETAILS:
      go({
        name: 'SchoolInformationDetail',
        query: {
          id: row.id
        }
      });
      break;
    case AC_CLASS_MANAGER:
      console.log('点击了班级管理');
      go({
        path: '/information/class-hospital',
        query: {
          schoolId: row.id
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
async function geteduSelectBox() {
  const data = await eduSelectBox();
  if (!data) return;
  schoolSystemOptions.value = data;
}
onMounted(() => {
  geteduSelectBox();
  getDataSource();
  isGoverOrg.value && getAuthArea();
});

onActivated(() => {
  getDataSource();
});

defineOptions({
  name: 'SchoolInformation'
});
</script>

<style scoped></style>
