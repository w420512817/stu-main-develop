<template>
  <n-select
    v-bind="$attrs"
    :options="options"
    :loading="loading"
    :clear-filter-after-select="false"
    @search="onSearch"
  />
</template>
<script setup>
/**
 * 名称：DropSelect
 * @param API Function
 * @param options array
 * 在 template 中使用，前端直接模糊查询，没有分页
 */
import { ref } from 'vue';
import { bool, string, object, func } from 'vue-types';
import { debouncedWatch } from '@vueuse/core';

// hooks
import useApi from '@common/hooks/business/useApi';

const props = defineProps({
  listApi: func(), // 请求的接口
  params: object().def({}), // 传入的请求参数，除本搜索框外
  keyword: string().def(''), // 输入框 的key
  init: bool().def(true) // 组件一加载就请求数据。
});
const { fetch: getList, loading } = useApi(props.listApi);
const options = ref([]);
const inputVal = ref('');
const onSearch = val => {
  inputVal.value = val;
};
const getSelectData = str => {
  const { params, keyword } = props;
  let apiparam = { ...params };
  if (str) {
    apiparam = str;
  } else {
    apiparam[keyword] = inputVal.value;
  }
  // 用来优化自定义的情况，如果出现其他问题，可以尝试在输入的时候加上{keyword:value}试试看能不能解决掉
  // if (keyword) apiparam[keyword] = str ? str : inputVal.value;
  getList(apiparam).then(data => {
    console.log(data, 'data');
    if (!data || data.code === 'ERR_BAD_REQUEST') return;
    options.value = data || [];
  });
};

if (props.init) {
  getSelectData();
}

debouncedWatch(
  inputVal,
  () => {
    getSelectData();
  },
  { debounce: 500 }
);
defineExpose({
  getSelectData,
  options
});
</script>
