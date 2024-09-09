<template>
  <SubTitle :sub-title="`${areaTitle}筛查情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { screenSituation } from '@/api/bigScreen/phyTest';

import { numToPercent, areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

const areaTitle = computed(() => areaTypeMap[params.level]);

const opts = {
  tooltip: {
    trigger: 'axis',
    valueFormatter: value => value + '%'
  },
  yAxis: {
    name: '%',
    max: 100
  },
  legend: {
    show: true,
    data: ['男生筛查率', '女生筛查率', '总筛查率']
  },
  color: ['#27DDFF', '#F3C549', '#10DB87'],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    splitLine: {
      show: true
    },
    data: []
  },
  series: [
    {
      name: '男生筛查率',
      type: 'line',
      showSymbol: false,
      data: [],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(39, 221, 255, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(39, 221, 255, 0)'
            }
          ],
          global: false // 缺省为 false
        }
      },
      lineStyle: {
        color: '#27DDFF'
      }
    },
    {
      name: '女生筛查率',
      type: 'line',
      lineStyle: {
        color: '#F3C549'
      },
      showSymbol: false,
      data: [],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(243, 197, 73, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(243, 197, 73, 0)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '总筛查率',
      type: 'line',
      lineStyle: {
        color: '#10DB87'
      },
      showSymbol: false,
      data: [],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(16, 219, 135, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(16, 219, 135, 0)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    }
  ]
};

async function getData() {
  loadingFn(1);
  try {
    const res = await screenSituation({ planId: params.planId, id: params.id, level: params.level });
    // console.log('left-mid', res);
    opts.xAxis.data = res.map(item => item.areaName);
    opts.series[0].data = res.map(item => numToPercent(item.maleRate));
    opts.series[1].data = res.map(item => numToPercent(item.femaleRate));
    opts.series[2].data = res.map(item => numToPercent(item.totalRate));

    setOptions(opts);
  } finally {
    loadingFn(-1);
  }
}

watch(
  () => params.planId,
  () => {
    getData();
  }
);

watch(
  () => params.level,
  () => {
    getData();
  }
);
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
}
</style>
