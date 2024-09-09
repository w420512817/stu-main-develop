<template>
  <n-space vertical>
    <n-card>
      <div class="flex justify-between w-full">
        <h2 class="font-bold text-4">{{ query.orgName || query.name }}</h2>
        <n-button size="small" type="primary" class="ml-16px px-2" @click="back">返回</n-button>
      </div>
    </n-card>
    <n-card class="w-full">
      <n-form inline :model="formValue" label-placement="left" label-width="80" @keypress.enter="onSearch">
        <n-grid cols="2 md:3 xl:4 2xl:5 3xl:6" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="学校名称:">
            <n-input v-model:value="formValue.name" type="text" placeholder="请输入学校名称" clearable />
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:">
            <area-cascader
              v-model:value="formValue.regionId"
              check-strategy="all"
              placeholder="请选择所属地区"
              @update:val="updateSelect"
            />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button type="primary" @click="onSearch">查询</n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <n-data-table
        remote
        :render-cell="v => v ?? '/'"
        :loading="loading"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
      />
    </n-card>
  </n-space>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useThrottleFn } from '@vueuse/core';

// static data
import { createColumns } from './AssociatedSchools.data';
import { AC_DETAILS } from '@common/enum/pageEnum';

// hooks
import useApi from '@common/hooks/business/useApi';
import usePagination from '@common/hooks/business/usePagination';
import { useGo } from '@common/hooks/usePage';

// api
import { getAssociateSchoolList } from '@/api/information/school';

// init hooks, static data
const { fetch: getList, loading } = useApi(getAssociateSchoolList);
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
const { go, route } = useGo();
const { query } = useRoute();

const columns = createColumns((key, row) => onClickBtn(key, row));

const origin = {
  name: null,
  regionId: null,
  regionType: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const dataSource = ref([]);

const back = () => {
  route.go(-1);
};
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
    associateOrgId: query.id,
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
        name: 'SchoolInformationDetail',
        query: {
          id: row.schoolId,
          orgProperty: row.orgProperty
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

onMounted(() => {
  getDataSource();
});
</script>

<style scoped></style>
