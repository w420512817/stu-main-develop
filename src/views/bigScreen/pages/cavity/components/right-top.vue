<template>
  <SubTitle :sub-title="`${areaTitle}患龋率情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { govCariesCondition } from '@/api/bigScreen/cavity';
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
    name: '%'
  },
  legend: {
    show: true
    // data: ['恒牙患龋率', '乳牙患龋率']
  },
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
      name: '恒牙患龋率',
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
      name: '乳牙患龋率',
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
    }
  ]
};

async function getData() {
  try {
    loadingFn(1);
    const res = await govCariesCondition({ planId: params.planId, id: params.id, level: params.level });
    // console.log('right-top', res);

    opts.xAxis.data = res.map(i => i.areaName);
    opts.series[0].data = res.map(i => numToPercent(i.ptCariesRate));
    opts.series[1].data = res.map(i => numToPercent(i.dtCariesRate));

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
