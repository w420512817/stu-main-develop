<template>
  <n-space vertical w-full h-full>
    <!--集团医院-->
    <n-card v-if="orgProperty == 5" vertical class="w-full shadow-sm" title="医院信息">
      <n-form inline :model="formValue" label-placement="left" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="医院名称:">
            <n-input v-model:value="formValue.name" type="text" placeholder="请输入医院名称" />
          </n-form-item-gi>
          <n-form-item-gi label="医院属性:">
            <n-select
              v-model:value="formValue.orgProperty"
              :options="hosptialAttrOptions"
              placeholder="请选择医院属性"
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
          <n-form-item-gi label="医院类型:">
            <n-select v-model:value="formValue.hospType" :options="hosptialTypesOptions" placeholder="请选择医院类型" />
          </n-form-item-gi>
          <n-form-item-gi label="医院级别:">
            <n-select
              v-model:value="formValue.hospLevel"
              :options="hosptialLevelOptions"
              placeholder="请选择医院级别"
            />
          </n-form-item-gi>
          <n-gi suffix #="{ overflow }">
            <search-buttons
              breakpoint="3xl"
              :overflow="overflow"
              @search="onSearch"
              @reset="onReset"
              @collapse="gridCollapsed = !gridCollapsed"
            />
          </n-gi>
        </n-grid>
      </n-form>

      <n-data-table
        remote
        :loading="loading"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :row-key="row => row.id"
      />
    </n-card>
    <!--独立医院-->
    <n-card v-else header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <div flex justify-between>
          <span text-18px>医院信息</span>
          <n-button v-auth="9356" type="primary" @click="jumpAssociatedSchools(orgId, orgName)">关联学校</n-button>
        </div>
      </template>

      <DetailForm :id="orgId" :org-property="orgProperty" />
    </n-card>
  </n-space>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useThrottleFn } from '@vueuse/core';

import DetailForm from './components/DetailForm.vue';

// static data
import { createColumns } from './hosptial.data';
import { AC_DETAILS, AC_ASSOCITED } from '@common/enum/pageEnum';
import { hosptialAttrOptions, hosptialTypesOptions, hosptialLevelOptions } from '../common.data';

// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { getHosptialList } from '@/api/information/hosptial';

import { useUserStore } from '@/store';

// init hooks, static data

const { fetch: getList, loading } = useApi(getHosptialList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const columns = computed(() => {
  return createColumns((key, row) => onClickBtn(key, row));
});
const {
  userInfo: { orgId, orgProperty, orgName }
} = useUserStore();

const origin = {
  name: null,
  orgProperty: null,
  regionType: null,
  regionId: null,
  hospType: null,
  hospLevel: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);

const updateSelect = option => {
  Object.assign(formValue, option);
};
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
        name: 'HosptialDetail',
        query: {
          id: row.id,
          orgProperty: row.orgProperty,
          name: row.name
        }
      });
      break;
    case AC_ASSOCITED:
      jumpAssociatedSchools(row.id, row.name);
      break;
  }
}
function jumpAssociatedSchools(id, name) {
  console.log('点击点击');
  go({
    name: 'AssociatedSchools',
    query: {
      id,
      name
    }
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
onMounted(() => {
  getDataSource();
});
defineOptions({ name: 'HosptialList' });
</script>

<style scoped></style>
