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
  legend: {
    show: false
  },
  xAxis: {
    show: false
  },
  yAxis: {
    show: false
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '--',
      type: 'pie',
      // 圆半径占视图的比例
      radius: '95%',
      // 视觉引导线设置
      labelLine: {
        lineStyle: {
          color: '#01F4FF',
          cap: 'square'
        }
      },
      // 文本设置
      label: {
        formatter: '{a|{b} {d}%}\n{dot|}',
        // 文本颜色
        color: '#A5ABCD',
        rich: {
          // 圆点
          dot: {
            backgroundColor: '#01F4FF',
            borderRadius: 3,
            width: 3,
            height: 3,
            padding: [3, 3, 0, -12],
            // 添加阴影，类似 box-shadow
            shadowBlur: 4,
            shadowColor: '#01F4FF'
          },
          // 文本
          a: {
            padding: [-15, 8, -20, 8]
          }
        }
      }
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
