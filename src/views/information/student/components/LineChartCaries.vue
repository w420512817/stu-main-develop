<template>
  <LineChart v-bind="$attrs" :extend="myExtend" :label-map="labelMap" :chart-data="chartData" />
</template>
<script setup>
import { watch, reactive } from 'vue';
import { array, bool, string } from 'vue-types';
const props = defineProps({
  trendChart: array().def([]),
  loading: bool().def(false),
  label: string().def('')
});
let labelMap = reactive({
  data1: props.label
});
let chartData = reactive({
  columns: ['name', 'data1'],
  rows: [
    // { name: '温州市2021年第一次普查', data1: 0.25, data2: 0.5 },
    // { name: '温州市2021年第二次普查', data1: -0.75, data2: -0.25 }
  ]
});
let myExtend = reactive({
  color: [],
  legend: {
    show: true
  },
  xAxis: {
    show: true,
    boundaryGap: '3%', // 坐标轴两边留白策略
    splitLine: {
      show: false
    }
  },
  yAxis: {
    splitLine: {
      show: true
    },
    axisLine: {
      // 设置轴线的属性
      show: true
    }
  }
});
watch(
  () => props.loading,
  () => {
    let arr = [];
    props.trendChart.forEach(d => {
      arr.push({ name: d.planName, data1: Number(d.number) });
    });
    chartData.rows = arr;
    labelMap.data1 = props.label;
  },
  { immediate: true }
);
</script>
