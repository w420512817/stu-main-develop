<template>
  <n-space vertical w-full h-full>
    <n-card v-if="orgProperty == 7" class="w-full" title="社会机构信息">
      <n-form inline :model="formValue" label-placement="left" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" responsive="screen">
          <n-form-item-gi label="社会机构名称:">
            <n-input v-model:value="formValue.name" type="text" placeholder="请输入机构名称" />
          </n-form-item-gi>
          <n-form-item-gi label="社会机构属性:">
            <n-select
              v-model:value="formValue.orgProperty"
              :options="societyAttrOptions"
              placeholder="请选择机构属性"
            />
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:">
            <area-cascader
              v-model:value="formValue.regionId"
              placeholder="请选择所属地区"
              check-strategy="all"
              @update:val="updateSelect"
            />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button type="primary" mr-3 @click="onSearch">查询</n-button>
            <n-button type="primary" ghost @click="onReset">重置</n-button>
          </n-form-item-gi>
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
    <n-card v-else header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <div flex justify-between>
          <span text-18px>社会机构信息</span>
          <n-button v-auth="9360" type="primary" @click="jumpAssociatedSchools(orgId, orgName)">关联学校</n-button>
        </div>
      </template>
      <DetailForm :id="orgId" />
    </n-card>
  </n-space>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useThrottleFn } from '@vueuse/core';

import DetailForm from './components/DetailForm.vue';

// static data
import { createColumns } from './society.data';
import { AC_DETAILS, AC_ASSOCITED } from '@common/enum/pageEnum';
import { societyAttrOptions } from '../common.data';
// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { getsocietyList } from '@/api/information/society';

import { useUserStore } from '@/store';

const {
  userInfo: { orgId, orgProperty, orgName }
} = useUserStore();

// init hooks, static data
const { fetch: getList, loading } = useApi(getsocietyList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go } = useGo();
const columns = computed(() => {
  return createColumns((key, row) => onClickBtn(key, row));
});

const origin = {
  name: null,
  orgProperty: null,
  status: null,
  regionType: null,
  regionId: null
};
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
  console.log(key, row);
  switch (key) {
    case AC_DETAILS:
      go({
        name: 'SocietyDetail',
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
function jumpAssociatedSchools(id, orgName) {
  go({
    name: 'AssociatedSchools',
    query: {
      id,
      orgName
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

defineOptions({ name: 'SocietyList' });
</script>

<style scoped></style>
