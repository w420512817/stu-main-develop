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
  // tooltip: {
  //   confine: true,
  //   formatter: function (params) {
  //     let str = params[0].axisValue + '<br>';
  //     params.forEach(v => {
  //       str = str + `${v.marker}${v.seriesName}：${(v.value[v.seriesName] * 100).toFixed(2) + '%'}<br>`;
  //     });
  //     return str;
  //   }
  // },
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
    if (
      props.trendChart &&
      props.trendChart[0] &&
      (props.trendChart[0].type == 3 ||
        props.trendChart[0].type == 4 ||
        props.trendChart[0].type == 7 ||
        props.trendChart[0].type == 11)
    ) {
      myExtend['tooltip'] = {
        confine: true,
        formatter: function (params) {
          let str = params[0].axisValue + '<br>';
          params.forEach(v => {
            str =
              str +
              `${v.marker}${v.seriesName}：${Math.floor((v.value[v.seriesName] * 1) / 60)}:${
                (v.value[v.seriesName] * 1) % 60 >= 10
                  ? (v.value[v.seriesName] * 1) % 60
                  : '0' + ((v.value[v.seriesName] * 1) % 60)
              }<br>`;
          });
          return str;
        }
      };
    } else {
      myExtend['tooltip'] = {
        confine: true,
        formatter: function (params) {
          let str = params[0].axisValue + '<br>';
          params.forEach(v => {
            str = str + `${v.marker}${v.seriesName}：${v.value[v.seriesName]}<br>`;
          });
          return str;
        }
      };
    }
    chartData.rows = arr;
    labelMap.data1 = props.label;
  },
  { immediate: true }
);
</script>
