<template>
  <SubTitle :sub-title="`${areaTitle}脊柱异常年龄分布`" />
  <div ref="bar" class="h-75%"></div>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { useECharts } from '@common/hooks/useECharts';
import { object } from 'vue-types';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const bar = ref();
const { setOptions: setOptions1 } = useECharts(bar);

const props = defineProps({
  data: object().def({})
});
const areaTitle = computed(() => areaTypeMap[params.level]);

const data = ref({
  spinalHealthNum: 0, // 脊柱健康人数
  spinalUnHealthNum: '', // 脊柱异常人数
  spinalHealthRate: 10, // 脊柱正常比例
  unusualAgeVOS: [] // 年龄分布
});

async function getUnusualAgeCondition() {
  data.value = props.data;
  setBar();
}

function setBar() {
  let source = [['n', '人数', '背景']];
  let v = data.value.unusualAgeVOS?.map(({ ageScope, unusualNum }) => {
    return [ageScope, unusualNum || 0, 100];
  });
  source = source.concat(v);
  setOptions1({
    legend: {
      show: false
    },
    tooltip: {
      show: true,
      trigger: 'axis', // axis , item
      backgroundColor: 'rgba(0, 49, 85, 1)',
      borderColor: 'rgba(0, 151, 251, 1)',
      borderWidth: 1,
      borderRadius: 0,
      textStyle: {
        color: '#BCE9FC',
        fontSize: 16,
        align: 'left'
      }
    },
    grid: {
      right: '5%',
      top: '30%',
      left: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLabel: {
        // 坐标轴刻度标签的相关设置。
        interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
        //	margin:15,
        color: '#B7D5F0',
        fontStyle: 'normal',
        fontSize: 12
      },
      axisTick: {
        // 坐标轴刻度相关设置。
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      splitLine: {
        // 坐标轴在 grid 区域中的分隔线。
        show: false
      }
    },
    yAxis: [
      {
        name: '人数',
        nameTextStyle: {
          color: '#96B5D0',
          align: 'right'
        },
        type: 'value',
        splitNumber: 2,
        axisLabel: {
          color: '#94ADC4',
          fontStyle: 'normal',
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(95,143,255,0.15)',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        gridIndex: 0,
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
        barWidth: '28%',
        label: {
          show: true,
          position: 'top',
          color: '#FAFFFF',
          fontSize: 14
        },
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
        }
      },
      {
        tooltip: {
          show: false
        },
        type: 'bar',
        barWidth: '40%',
        barGap: '-120%',
        yAxisIndex: 1,
        itemStyle: {
          color: 'rgba(95,143,255,0.1)'
        },
        zlevel: 9
      }
    ],
    dataset: {
      source
    }
  });
}
watch(
  () => props.data,
  () => {
    getUnusualAgeCondition();
  }
);
</script>

<style lang="less" scoped>
.chart {
  width: 9vh;
  height: 9vh;
}
</style>
