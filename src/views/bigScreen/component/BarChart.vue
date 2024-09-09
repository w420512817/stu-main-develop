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
  grid: {
    // 图形容器
    show: false,
    top: 70,
    left: 10,
    right: 20,
    bottom: 30,
    containLabel: true
  },
  legend: {
    // 图例相关
    show: true,
    top: 10,
    left: 20,
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: '#CBE5F4',
      fontSize: '12px'
    }
  },
  tooltip: {
    // 提示框组件
    trigger: 'axis'
  },
  xAxis: {
    // x轴相关
    show: true,
    type: 'category',
    boundaryGap: true, // 坐标轴两边留白策略
    splitLine: {
      // 坐标轴在 grid 区域中的分隔线
      show: false
    },
    axisTick: {
      // 坐标轴刻度相关设置。
      show: true,
      inside: true,
      alignWithLabel: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.25)'
      }
    },
    axisLine: {
      // 坐标轴轴线相关设置
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.25)',
        width: 1
      }
    },
    axisLabel: {
      // 坐标轴刻度标签
      color: '#CBE5F4',
      fontSize: '12px'
    }
  },
  yAxis: {
    // y轴相关
    name: '', // 刻度标题
    nameLocation: 'end',
    nameTextStyle: {
      padding: [0, 0, 0, 30],
      color: '#D7DCFC'
    },
    nameGap: 15,
    splitLine: {
      // 坐标轴在 grid 区域中的分隔线
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
        type: 'dashed'
      }
    },
    axisLine: {
      // 坐标轴轴线相关设置
      show: false
    },
    axisLabel: {
      // 坐标轴刻度标签
      color: '#D7DCFC',
      fontSize: '12px'
    }
  },
  color: ['#27DDFF', '#F3C549', '#32A4FF', '#10DB87'],
  series: [{ type: 'bar' }],
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
