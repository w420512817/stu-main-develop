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
  width: string().def('100%'),
  height: string().def('100%')
});

// 图表实例属性设置
const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);

// 初始 option
let option = {
  title: {
    show: false
  },
  // 提示框设置
  tooltip: {
    trigger: 'axis'
  },
  color: ['rgba(223, 210, 30, 1)', 'rgba(2, 204, 254, 1)'],
  label: {
    show: true,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 1)',
    formatter: function ({ value, seriesName }) {
      return value[seriesName] + '%';
    }
  },
  legend: {
    icon: 'none',
    // 朝向配置 - 竖向
    orient: 'vertical',
    // 显示在右侧
    right: 0,
    top: 'center',
    // 图形标记宽高设置
    itemWidth: 12,
    itemHeight: 3,
    lineStyle: {
      borderType: 'solid'
    },
    textStyle: {
      width: 12,
      overflow: 'break',
      color: '#fff',
      lineHeight: 16,
      padding: [0, 0, 8, 0]
    }
  },
  // 坐标系显示范围
  // 注意：单个 grid 内，最多只能上下左右 4 个坐标系
  grid: {
    left: '3%',
    right: 40,
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      // 坐标轴轴线相关设置
      show: true,
      lineStyle: {
        color: '#2B2D3C'
      }
    },
    axisLabel: {
      // 坐标轴刻度标签
      color: '#D7DCFC',
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    // 分隔线设置
    splitLine: {
      show: true,
      lineStyle: {
        color: '#2B2D3C'
      }
    },
    // Y 轴文本配置
    axisLabel: {
      color: '#D7DCFC',
      fontSize: 12,
      formatter: function (value, index) {
        return index ? `${value}%` : '0';
      }
    }
  },
  series: [
    {
      type: 'line',
      symbol: 'circle' // 拐点图形样式
    },
    {
      type: 'line',
      symbol: 'circle' // 拐点图形样式
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
