<template>
  <n-select
    v-bind="$attrs"
    remote
    filterable
    :options="options"
    :loading="loading"
    :clear-filter-after-select="false"
    :reset-menu-on-options-change="false"
    :label-field="labelField"
    :value-field="valueField"
    :placeholder="placeholder"
    @scroll="handleScroll"
    @search="handleSearch"
  />
</template>
<script setup>
import { ref, reactive } from 'vue';
import { object, string, func } from 'vue-types';
import { useThrottleFn } from '@vueuse/core';

// hooks
import useApi from '@common/hooks/business/useApi';

const props = defineProps({
  listApi: func(), // 请求的接口
  params: object().def({}), // // 传入的请求参数，除本搜索框外
  keyword: string().def('name'), // 本搜索框请求参数键值名
  labelField: string().def('name'),
  valueField: string().def('id'),
  placeholder: string().def('请输入关键词')
});

const { fetch: getList, loading } = useApi(props.listApi);

const options = ref([]);
const inputVal = ref('');
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

const handleScroll = e => {
  const tar = e.currentTarget;
  if (tar.scrollTop + tar.offsetHeight >= tar.scrollHeight - 10) {
    if (options.value.length < pagination.total) {
      getOptions();
    }
  }
};
const handleSearch = val => {
  inputVal.value = val;
  getOptions();
};
const getOptions = useThrottleFn(async clear => {
  if (clear) {
    pagination.current = 1;
  }
  const { current, size } = pagination;
  let data = { current, size, [props.keyword]: inputVal.value, ...props.params };
  const { records = [], total = 0 } = await getList(data);
  if (!records.length) return;
  pagination.total = total * 1;

  if (pagination.current == 1) {
    options.value = records || [];
  } else {
    options.value = options.value.concat(records);
  }

  pagination.current += 1;
});

defineExpose({
  getOptions
});
</script>
