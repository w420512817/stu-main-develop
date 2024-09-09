<template>
  <div ref="chartRef" :style="{ width, height }">
    <div v-if="props.loading" class="absolute top-0 left-0 z-10 w-full h-full bg-opacity-50 bg-white">
      <n-spin class="absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4" size="small" />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import { bool, object, string } from 'vue-types';
import { useECharts } from '@common/hooks/useECharts';
import { deepMerge } from '@common/utils/common';

// props
const props = defineProps({
  extend: object().def({}),
  labelMap: object().def({}),
  chartData: object().def({}),
  width: string().def('100%'),
  height: string().def('100%'),
  loading: bool().def(false)
});

// 图表实例属性设置
const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);
let option;

// 初始 option
option = {
  title: {
    show: false
  },
  // 提示框设置
  tooltip: {
    trigger: 'axis'
  },
  color: [],
  label: {},
  legend: {
    // 图例相关
    show: true,
    top: 0,
    right: 10,
    textStyle: {
      fontSize: '12px'
    },

    itemHeight: 12,
    itemWidth: 12,
    icon: 'rect'
  },
  // 坐标系显示范围
  // 注意：单个 grid 内，最多只能上下左右 4 个坐标系
  grid: {
    left: 5,
    right: 5,
    bottom: 5,
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      // 坐标轴轴线相关设置
      show: true,
      lineStyle: {}
    },
    axisLabel: {
      // 坐标轴刻度标签
      fontSize: 12,
      interval: 0
    }
  },
  yAxis: {
    type: 'value',
    // 分隔线设置
    splitLine: {
      show: true,
      lineStyle: {}
    },
    // Y 轴文本配置
    axisLabel: {
      fontSize: 12
    }
  },
  series: [],
  dataset: {}
};

function setDataSet() {
  if (!props.chartData.columns) {
    return false;
  }
  let dimensions = dimensionsSet();
  let source = sourceSet();
  seriesSet();
  option.dataset = reactive({
    dimensions: dimensions,
    source: source
  });
}

function dimensionsSet() {
  let columns = props.chartData.columns;
  let dimensions = [];
  columns.forEach((v, i) => {
    if (i >= 1) {
      dimensions.push(props.labelMap[v]);
    } else {
      dimensions.push(v);
    }
  });
  return dimensions;
}

function sourceSet() {
  let source = [];
  props.chartData.rows.forEach(v => {
    let obj = {};
    for (let key in v) {
      if (props.labelMap[key]) {
        obj[props.labelMap[key]] = v[key];
      }
    }
    source.push({ ...v, ...obj });
  });
  return source;
}

function seriesSet() {
  option.series = [];
  let len = props.chartData.columns.length;
  for (let i = 1; i < len; i++) {
    option.series.push({
      type: 'line',
      symbol: 'circle',
      smooth: true
    });
  }
}

watch(
  [() => props.extend, () => props.labelMap, () => props.chartData],
  () => {
    setDataSet();
    setOptions(deepMerge({}, option, props.extend));
  },
  { immediate: true, deep: true }
);
</script>
