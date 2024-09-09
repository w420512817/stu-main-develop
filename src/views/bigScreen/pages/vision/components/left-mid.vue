<template>
  <SubTitle :sub-title="`${areaTitle}上报批次对比图`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { batchContrast } from '@/api/bigScreen/vision';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

let tenThousand = false;
const opts = {
  tooltip: {
    trigger: 'axis',
    valueFormatter: v => (tenThousand ? v * 10000 : v) + ' 人'
  },
  yAxis: {
    splitNum: 3
  },
  legend: {
    show: false
  },
  grid: { top: 20, left: 20 },
  color: ['#F3C549'],
  xAxis: {
    type: 'category',
    boundaryGap: true,
    splitLine: {
      show: true
    },
    data: []
  },
  series: [
    {
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
              color: 'rgba(243, 197, 73, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(243, 197, 73, 0)'
            }
          ],
          global: false // 缺省为 false
        }
      },
      lineStyle: {
        color: '#F3C549'
      }
    }
  ]
};

async function getData() {
  try {
    loadingFn(1);
    const res = await batchContrast({ planId: params.planId, areaId: params.id });

    // console.log('left-mid', res);
    let data = res.map(item => item.completionCount);
    let maxCount = Math.max(...data);
    if (maxCount >= 10000) {
      data = data.map(v => v / 10000);
      opts.yAxis.name = '单位：万';
      tenThousand = true;
    } else {
      tenThousand = false;
      opts.yAxis.name = undefined;
    }
    opts.xAxis.data = res.map(item => item.planName);
    opts.series[0].data = data;
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
