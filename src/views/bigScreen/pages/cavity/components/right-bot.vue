<template>
  <SubTitle :sub-title="`${areaTitle}牙周病率情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';

import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { govAbnormalCaries } from '@/api/bigScreen/cavity';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

const dataList = [
  { name: '牙龈炎', key: 'mGingivitisNum', wkey: 'wGingivitisNum' },
  { name: '牙周炎', key: 'mPeriodontitisNum', wkey: 'wPeriodontitisNum' },
  { name: '牙石', key: 'mTartarNum', wkey: 'wTartarNum' },
  { name: '浅牙周袋', key: 'mSuperficialPeriodontalPocketNum', wkey: 'wSuperficialPeriodontalPocketNum' },
  { name: '深牙周袋', key: 'mDeepPeriodontalPocketNum', wkey: 'wDeepPeriodontalPocketNum' },
  { name: '沸斑牙', key: 'mBoilingMottledToothNum', wkey: 'wBoilingMottledToothNum' },
  { name: '错颌', key: 'mMalocclusionNum', wkey: 'wMalocclusionNum' },
  { name: '牙釉质发育不全', key: 'mEnamelHypoplasiaNum', wkey: 'wEnamelHypoplasiaNum' },
  { name: '义齿', key: 'mDentureNum', wkey: 'wDentureNum' }
];

const opts = {
  grid: [
    { top: 30, left: '10%', width: '30%', containLabel: true, bottom: 20 },
    {
      top: 30,
      left: '32%',
      bottom: 20
    },
    { top: 30, right: '10%', width: '30%', containLabel: true, bottom: 20 }
  ],
  tooltip: {
    show: false
  },
  legend: {
    show: true,
    top: 0,
    left: 'center',
    itemGap: 100,
    data: [
      {
        name: '男生',
        itemStyle: {
          color: '#27DDFF'
        }
      },
      {
        name: '女生',
        itemStyle: {
          color: '#EFB224'
        }
      }
    ]
  },
  xAxis: [
    {
      inverse: true,
      gridIndex: 0,
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    {
      inverse: false,
      gridIndex: 1
    },
    {
      inverse: false,
      gridIndex: 2,
      axisLabel: { show: false },
      splitLine: { show: false }
    }
  ],
  yAxis: [
    {
      type: 'category',
      gridIndex: 0,
      position: 'right',
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: ['牙石', '浅牙周袋', '牙周炎', '沸斑牙', '错颌', '牙釉质发育不全', '义齿']
    },
    {
      type: 'category',
      gridIndex: 1,
      position: 'center',
      axisLabel: {
        align: 'center',
        fontSize: 14,
        color: '#E3F7FF'
      },
      axisLine: {
        show: false
      },
      data: ['牙石', '浅牙周袋', '牙周炎', '沸斑牙', '错颌', '牙釉质发育不全', '义齿']
    },
    {
      type: 'category',
      gridIndex: 2,
      position: 'left',
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: ['牙石', '浅牙周袋', '牙周炎', '沸斑牙', '错颌', '牙釉质发育不全', '义齿']
    }
  ],
  series: [
    {
      name: '男生',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      barMaxWidth: 8,
      barGap: '50%',
      data: [],
      label: {
        show: true,
        position: 'left',
        color: '#27DDFF',
        fontSize: 14,
        fontFamily: 'DINAlternate-Bold,DINAlternate'
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(39, 221, 255, 1)'
            },
            {
              offset: 0.5,
              color: 'rgba(39, 221, 255, 1)'
            },
            {
              offset: 1,
              color: 'rgba(39, 221, 255, 0)'
            }
          ],
          global: false
        }
      }
    },
    {
      name: '女生',
      type: 'bar',
      xAxisIndex: 2,
      yAxisIndex: 2,
      barMaxWidth: 8,
      barGap: '50%',
      data: [],
      label: {
        show: true,
        position: 'right',
        color: '#F3C549',
        fontSize: 14,
        fontFamily: 'DINAlternate-Bold,DINAlternate'
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(239, 178, 36, 0)'
            },
            {
              offset: 0.5,
              color: 'rgba(239, 178, 36, 1)'
            },
            {
              offset: 1,
              color: 'rgba(239, 178, 36, 1)'
            }
          ],
          global: false
        }
      }
    }
  ]
};

async function getData() {
  try {
    loadingFn(1);
    const res = await govAbnormalCaries({ planId: params.planId, id: params.id, level: params.level });
    // console.log('right-bottom', res);

    const yAxisData = [];
    const manData = [];
    const womanData = [];

    dataList.forEach(item => {
      yAxisData.push(item.name);
      manData.push(Number(res[item.key]) || 0);
      womanData.push(Number(res[item.wkey]) || 0);
    });

    opts.yAxis[0].data = opts.yAxis[1].data = opts.yAxis[2].data = yAxisData;

    opts.series[0].data = manData;
    opts.series[1].data = womanData;

    setOptions(opts);
  } finally {
    loadingFn(-1);
  }
}
watch([() => params.planId, () => params.level], () => {
  getData();
});
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
}
</style>
