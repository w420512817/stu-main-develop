<template>
  <SubTitle :sub-title="`${areaTitle}优秀率情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';

import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { sexOutstanding } from '@/api/bigScreen/phyTest';
import { numToPercent, areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

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
    data: [
      {
        name: '男生优秀率',
        itemStyle: {
          color: '#27DDFF'
        }
      },
      {
        name: '女生优秀率',
        itemStyle: {
          color: '#EFB224'
        }
      },
      {
        name: '优秀率',
        itemStyle: {
          color: '#10DB87'
        }
      }
    ]
  },
  xAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '男生优秀率',
      type: 'bar',
      barMaxWidth: 8,
      barGap: '50%',
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
      },
      data: []
    },
    {
      name: '女生优秀率',
      type: 'bar',
      barMaxWidth: 8,
      barGap: '50%',
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
              color: 'rgba(243, 197, 73, 1)'
            },
            {
              offset: 0.5,
              color: 'rgba(243, 197, 73, 1)'
            },
            {
              offset: 1,
              color: 'rgba(243, 197, 73, 0)'
            }
          ],
          global: false
        }
      },
      data: []
    },
    {
      name: '优秀率',
      type: 'bar',
      barMaxWidth: 8,
      barGap: '50%',
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
              color: 'rgba(16, 219, 135, 1)'
            },
            {
              offset: 0.5,
              color: 'rgba(16, 219, 135, 1)'
            },
            {
              offset: 1,
              color: 'rgba(16, 219, 135, 0)'
            }
          ],
          global: false
        }
      },
      data: []
    }
  ]
};
async function getData() {
  try {
    loadingFn(1);
    const res = await sexOutstanding({ planId: params.planId, id: params.id, level: params.level });
    // console.log('right-mid', res);
    opts.xAxis.data = res.map(i => i.areaName);
    opts.series[0].data = res.map(i => numToPercent(i.manOutstandingRate));
    opts.series[1].data = res.map(i => numToPercent(i.womanOutstandingRate));
    opts.series[2].data = res.map(i => numToPercent(i.outstandingRate));
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
