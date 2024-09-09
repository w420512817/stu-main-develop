<template>
  <div v-if="props.data.length" ref="chart" class="w-full h-full"></div>
  <div v-else class="absolute top-25% w-35% h-50% left-0 right-0 mx-auto">
    <img src="@/assets/image/bigScreen/stu-emp.png" />
    <div class="text-center text-[#CDEFFB] text-0.8vw -mt-20%">暂无数据</div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { array } from 'vue-types';
const chart = ref();
const { setOptions } = useECharts(chart);

const props = defineProps({
  data: array().def([])
});
const init = () => {
  let source = [['n', '异常比例', '背景']];
  source = source.concat(props.data);
  source.forEach((item, i) => {
    i && item.push(100);
  });
  const option = {
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(0, 49, 85, 1)',
      borderColor: 'rgba(0, 151, 251, 1)',
      borderWidth: 1,
      borderRadius: 0,
      textStyle: {
        color: '#BCE9FC',
        fontSize: 16,
        align: 'left'
      },
      valueFormatter: v => v + '%'
    },
    grid: {
      top: '20%',
      right: '0%',
      left: '10%',
      bottom: '15%'
    },
    dataZoom: {
      type: 'inside',
      maxValueSpan: 10,
      minValueSpan: 2
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#B7D5F0',
          fontSize: 12,
          interval: 0
        }
      }
    ],
    yAxis: [
      {
        name: '%',
        nameTextStyle: {
          align: 'right',
          padding: [0, 10, 5, 0],
          color: '#94ADC4'
        },
        nameGap: 10,
        axisLabel: {
          formatter: '{value}',
          color: '#94ADC4'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0)'
          }
        }
      },
      {
        max: 100,
        splitNumber: 12,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitArea: {
          show: false
        }
      }
    ],
    series: [
      {
        type: 'bar',
        barMaxWidth: 25,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(41, 240, 254, .8)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(41, 240, 254, 0)' // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          } // 渐变颜色
        },
        label: {
          show: true,
          position: 'top',
          color: '#FAFFFF',
          fontSize: 14,
          formatter: '{@1}%'
        }
      },
      {
        tooltip: {
          show: false
        },
        type: 'bar',
        barMaxWidth: 35,
        barGap: '-120%',
        yAxisIndex: 1,
        itemStyle: {
          color: 'rgba(95,143,255,0.1)'
        },
        zlevel: 9
      }
    ],
    dataset: {
      source: source
    }
  };
  setOptions(option);
};

watch(
  () => props.data,
  () => {
    init();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped></style>
