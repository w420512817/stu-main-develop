<template>
  <bar-chart v-bind="$attrs" :extend="reportExtend" :label-map="labelMap" :chart-data="chartData" />
</template>

<script setup>
import { deepMerge } from '@common/utils/common';
import { ref, watch } from 'vue';
import { object } from 'vue-types';
import { bar_num, bar_per, bar_base } from '@common/settings/chartSetting';

const props = defineProps({
  extend: object().def({}),
  labelMap: object().def({}),
  chartData: object().def({})
});

const reportExtend = ref({});

const color = {
  1: ['#3E9EFF'],
  2: ['#67A4FE', '#FCB82F'],
  3: ['#447EFF', '#FF68C4', '#FCC40D'],
  4: ['#447EFF', '#FF68C4', '#FCC40D']
};
// 根据ui设计图，维护改造图标样式，因为全部看报告出错几率和工程量比较大，写一个中间层来中转数据，给每一个组件都加上应有的样式
watch(
  [() => props.extend, () => props.labelMap, () => props.chartData],
  () => {
    const labelMapKeys = Object.keys?.(props.labelMap) ?? {};
    const extend = props?.extend ?? {};
    const { series } = extend ?? {};
    const arrLength = series?.length || labelMapKeys?.length;
    extend.color = color?.[arrLength];

    if (props.extend.type == 'bar_num') {
      reportExtend.value = deepMerge({}, bar_num, props.extend);
    } else if (props.extend.type == 'bar_per') {
      reportExtend.value = deepMerge({}, bar_per, props.extend);
    } else {
      reportExtend.value = deepMerge({}, bar_base, props.extend);
    }
  },
  { immediate: true, deep: true }
);
</script>
