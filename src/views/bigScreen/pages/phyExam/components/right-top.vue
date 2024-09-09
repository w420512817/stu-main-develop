<template>
  <SubTitle :sub-title="`${areaTitle}脊柱侧弯筛查情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { getPhysicalSpineVO } from '@/api/bigScreen/phyExam';

import { areaTypeMap, physicalMap, numToPercent } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');

const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

const opts = {
  tooltip: { trigger: 'axis', valueFormatter: value => value + '%' },
  yAxis: {
    name: '%',
    max: 100,
    nameTextStyle: {
      padding: [0, 0, 0, -20],
      color: '#D7DCFC'
    },
    nameGap: 15
  },
  legend: {
    show: true,
    data: ['正常', '异常']
  },
  xAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '正常',
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
      name: '异常',
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
    const res = await getPhysicalSpineVO({
      planId: params.planId,
      id: params.id,
      level: params.level
    });

    // console.log('res', res);

    const xAxisData = [];
    const seriesData0 = [];
    const seriesData1 = [];
    physicalMap.forEach(item => {
      xAxisData.push(item.name);
      seriesData0.push(numToPercent(res[item.key]));
      seriesData1.push(numToPercent(res[item.abKey]));
    });

    opts.xAxis.data = xAxisData;
    opts.series[0].data = seriesData0;
    opts.series[1].data = seriesData1;

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
