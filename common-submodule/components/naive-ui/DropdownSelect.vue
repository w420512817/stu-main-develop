<template>
  <n-select
    v-bind="$attrs"
    :options="options"
    :loading="loading"
    :label-field="labelField"
    :value-field="valueField"
    :placeholder="placeholder"
    remote
    @search="getOptions"
  />
</template>
<script setup>
import { ref, toRaw } from 'vue';
import { string, object, func } from 'vue-types';
import { useThrottleFn } from '@vueuse/core';

// hooks
import useApi from '@common/hooks/business/useApi';

const props = defineProps({
  listApi: func(), // 请求的接口
  params: object().def({}), // 传入的请求参数，除本搜索框外
  keyword: string().def('name'), // 输入框 的key
  labelField: string().def('name'),
  valueField: string().def('id'),
  placeholder: string().def('请输入关键词')
});
const { fetch: getList, loading } = useApi(props.listApi);

const options = ref([]);

const getOptions = useThrottleFn(async val => {
  const data = await getList({ [props.keyword]: val || '', ...toRaw(props.params) });

  options.value = data || [];
}, 500);

defineExpose({
  getOptions,
  options
});
</script>
