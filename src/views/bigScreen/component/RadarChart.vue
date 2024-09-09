<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script>
import { object, string } from 'vue-types';
</script>

<script setup>
import { ref, defineProps, computed, watch } from 'vue';
import { useECharts } from '@common/hooks/useECharts';

import { deepMerge } from '@/utils/common/index.js';

// props
const props = defineProps({
  dataset: object().def({}),
  extend: object().def({}),
  width: string().def('80%'),
  height: string().def('60%')
});

// 图表实例属性设置
const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);

// 初始 option
let option = {
  // 雷达坐标系配置
  radar: {
    indicator: [],
    // radar 坐标相隔配置
    splitArea: {
      show: false
    }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '各模块占比评分',
      type: 'radar',
      // 区域填充设置
      areaStyle: {
        color: '#307FFF'
      },
      // 折线设置
      lineStyle: {
        color: '#307FFF'
      },
      // 文本设置
      // 注意：设置文本显示时，拐点图形样式设置不能为 'none'
      label: {
        show: true,
        color: '#A5ABCD'
      },
      // 拐点图形样式设置
      // symbol: 'none',
      // 拐点图形大小设置
      symbolSize: 2,
      data: [
        {
          value: [],
          name: '各模块占比评分'
        }
      ]
    }
  ],
  dataset: props.dataset
};

const getOption = computed(() => deepMerge(option, props.extend));

watch(
  [() => props.dataset, () => props.extend],
  () => {
    setOptions(getOption.value);
  },
  { immediate: true, deep: true }
);
</script>
