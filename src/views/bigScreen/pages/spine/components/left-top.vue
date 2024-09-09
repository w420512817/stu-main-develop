<template>
  <SubTitle :sub-title="`${areaTitle}筛查学生基础信息`" />
  <div class="flex-center wh-full">
    <box2>
      <div ref="chart" class="chart"></div>
    </box2>
    <div class="ml-2vw">
      <div class="font-medium leading-none flex items-end mb-1.2vh">
        <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
          <span class="rhombus"></span>
          <span class="ml-[0.5vw]">脊柱健康学生</span>
        </div>
        <span class="text-[1vw] text-[#29F0FE] font-bold ml-[0.7vw]">{{ data.spinalHealthNum || '0' }}</span>
        <span class="text-[0.8vw] text-[#CDEFFB]">人</span>
      </div>
      <div class="font-medium leading-none flex items-end mb-1.2vh">
        <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
          <span class="rhombus"></span>
          <span class="ml-[0.5vw]">脊柱健康率</span>
        </div>
        <span class="text-[1vw] text-[#29F0FE] font-bold ml-[0.7vw]">{{ data.spinalHealthRate || '0' }}%</span>
      </div>
      <div class="font-medium leading-none flex items-end mb-1.2vh">
        <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
          <span class="rhombus s2"></span>
          <span class="ml-[0.5vw]">脊柱异常学生</span>
        </div>
        <span class="text-[1vw] text-[#F3C549] font-bold ml-[0.7vw]">{{ data.spinalUnHealthNum || '0' }}</span>
        <span class="text-[0.8vw] text-[#CDEFFB]">人</span>
      </div>
      <div class="font-medium leading-none flex items-end">
        <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
          <span class="rhombus s2"></span>
          <span class="ml-[0.5vw]">脊柱异常率</span>
        </div>
        <span class="text-[1vw] text-[#F3C549] font-bold ml-[0.7vw]">{{ data.spinalUnHealthRate || '0' }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue';
import box2 from './box2.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { useECharts } from '@common/hooks/useECharts';
import { object } from 'vue-types';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart);

const props = defineProps({
  data: object().def({})
});

const data = ref({
  spinalHealthNum: 0, // 脊柱健康人数
  spinalUnHealthNum: '', // 脊柱异常人数
  spinalHealthRate: 0 // 脊柱正常比例
});

async function getUnusualAgeCondition() {
  data.value = props.data;
  setPie();
}

function setPie() {
  setOptions({
    title: {
      text: [`${data.value.spinalHealthRate}%`, '{t|健康学生}'].join('\n'),
      textStyle: {
        color: '#F0FCFF',
        fontSize: 16,
        rich: {
          t: {
            fontSize: 13,
            color: '#CDEFFB',
            lineHeight: 30
          }
        }
      },

      left: 'center',
      top: 'center'
    },
    angleAxis: {
      max: 100,
      clockwise: false, // 逆时针
      // 隐藏刻度线
      show: false
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    polar: [
      {
        center: ['50%', '50%'], // 中心点位置
        radius: '176%' // 图形大小
      }
    ],
    series: [
      {
        type: 'bar',
        z: 10,
        data: [data.value.spinalUnHealthRate],
        showBackground: false,
        coordinateSystem: 'polar',
        hoverAnimation: false,
        roundCap: true,
        barWidth: 6,
        itemStyle: {
          color: '#F3C549'
        }
      },
      {
        type: 'pie',
        name: '内层细圆环',
        center: ['50%', '50%'],
        radius: ['90%', '83%'],
        hoverAnimation: false,
        clockwise: true,
        itemStyle: {
          color: '#29F0FE'
        },
        tooltip: {
          show: false
        },
        label: {
          show: false
        },
        data: [1]
      }
    ]
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
  width: 5.5vw;
  height: 5.5vw;
}
</style>
