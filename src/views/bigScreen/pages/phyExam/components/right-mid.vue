<template>
  <SubTitle :sub-title="'疫苗接种率情况'" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { getPhysicalVaccine } from '@/api/bigScreen/phyExam';
import { physicalVaccineMap, numToPercent } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

const opts = {
  tooltip: { trigger: 'axis', valueFormatter: value => value + '%' },
  yAxis: {
    name: '%',
    max: 100
  },
  legend: {
    show: true,
    data: [
      {
        name: '接种',
        itemStyle: {
          color: '#27DDFF'
        }
      },
      {
        name: '未接种',
        itemStyle: {
          color: '#F3C549'
        }
      },
      {
        name: '漏种',
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
      name: '接种',
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
      name: '未接种',
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
      name: '漏种',
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
    const res = await getPhysicalVaccine({
      planId: params.planId,
      id: params.id,
      level: params.level
    });

    // console.log('res', res);

    const xAxisData = [];
    const seriesData0 = [];
    const seriesData1 = [];
    const seriesData2 = [];
    physicalVaccineMap.forEach(item => {
      xAxisData.push(item.name);
      seriesData0.push(numToPercent(res[item.key]) || 0);
      seriesData1.push(numToPercent(res[item.noneKey]) || 0);
      seriesData2.push(numToPercent(res[item.missKey]) || 0);
    });

    opts.xAxis.data = xAxisData;
    opts.series[0].data = seriesData0;
    opts.series[1].data = seriesData1;
    opts.series[2].data = seriesData2;

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
