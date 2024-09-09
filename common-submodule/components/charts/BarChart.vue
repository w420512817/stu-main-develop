<template>
  <div ref="chartRef" :style="{ width, height }" class="relative">
    <div v-if="props.loading" class="absolute top-0 left-0 z-10 w-full h-full bg-opacity-50 bg-white">
      <n-spin class="absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4" size="small" />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import { object, string, bool } from 'vue-types';
import { useECharts } from '@common/hooks/useECharts';
import { deepMerge } from '@common/utils/common';

const props = defineProps({
  labelMap: object().def({}),
  chartData: object().def({}),
  extend: object().def({}),
  width: string().def('100%'),
  height: string().def('100%'),
  loading: bool().def(false),
  stack: bool().def(false) // 是否是堆叠图
});

const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);
let option;

// 初始 option
option = {
  grid: {
    // 图形容器
    show: false,
    top: '10%',
    left: 10,
    right: 10,
    bottom: '3%',
    containLabel: true
  },
  legend: {
    // 图例相关
    show: true,
    top: 0,
    right: 12,
    textStyle: {
      fontSize: '12px'
    },
    itemHeight: 12,
    itemWidth: 12,
    icon: 'rect'
  },
  tooltip: {
    // 提示框组件
    trigger: 'axis'
  },
  xAxis: {
    // x轴相关
    show: true,
    type: 'category',
    boundaryGap: '3%', // 坐标轴两边留白策略
    splitLine: {
      // 坐标轴在 grid 区域中的分隔线
      show: false
    },
    axisTick: {
      // 坐标轴刻度相关设置。
      show: false,
      inside: false,
      lineStyle: {}
    },
    axisLine: {
      // 坐标轴轴线相关设置
      show: true,
      lineStyle: {
        width: 1
      }
    },
    axisLabel: {
      // 坐标轴刻度标签
      fontSize: '12px',
      interval: 0
    }
  },
  yAxis: {
    // y轴相关
    name: '', // 刻度标题
    nameLocation: 'end',
    nameTextStyle: {
      padding: [0, 0, 0, 30]
    },
    nameGap: 15,
    splitLine: {
      // 坐标轴在 grid 区域中的分隔线
      show: true,
      lineStyle: {}
    },
    axisLine: {
      // 坐标轴轴线相关设置
      show: true,
      lineStyle: {
        width: 1
      }
    },
    axisLabel: {
      // 坐标轴刻度标签
      fontSize: '12px'
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
      type: 'bar',
      barMaxWidth: 15,
      stack: props.stack ? 'stack' : ''
    });
  }
}

watch(
  [() => props.extend, () => props.labelMap, () => props.chartData],
  () => {
    setDataSet();
    console.log(option, 'option');
    setOptions(deepMerge({}, option, props.extend));
  },
  { immediate: true, deep: true }
);
</script>
