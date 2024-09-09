<template>
  <SubTitle :sub-title="'筛查数据概览'" />
  <SwitchNav :nav-list="navList" class="mb-8px" @nav-change="navClick" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { watch, ref, inject, onMounted } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SwitchNav from '../../../component/SwitchNav.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { getRegionRate } from '@/api/bigScreen/synthesize';
import { listKeyMap, numToPercent } from '@/views/bigScreen/data/index.data.js';

const chart = ref();
const params = inject('params');
const { setOptions } = useECharts(chart, 'bigScreen');

const screeningType = ref('1');

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
    data: []
  },
  xAxis: {
    type: 'category',
    data: []
  },
  series: []
};

const barOpts = {
  type: 'bar',
  barMaxWidth: 8,
  barGap: '50%'
};

const legendColor = ['#27DDFF', '#F3C549', '#32A4FF', '#10DB87'];

const optSeriesColor = [
  {
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
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(239, 178, 36, 1)'
      },
      {
        offset: 0.5,
        color: 'rgba(239, 178, 36, 1)'
      },
      {
        offset: 1,
        color: 'rgba(243, 197, 73, 0)'
      }
    ],
    global: false
  },
  {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(50, 164, 255, 1)'
      },
      {
        offset: 0.5,
        color: 'rgba(50, 164, 255, 1)'
      },
      {
        offset: 1,
        color: 'rgba(50, 164, 255, 0)'
      }
    ],
    global: false
  },
  {
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
];

// 自定义切换菜单
const navList = ref([
  { name: '视力筛查', type: '1' },
  { name: '龋齿筛查', type: '2' },
  { name: '学生体检', type: '3' },
  { name: '学生体测', type: '4' }
]);

async function getData() {
  const res = await getRegionRate({
    screeningType: screeningType.value,
    id: params.id,
    level: params.level
  });

  const tempList = res[listKeyMap[screeningType.value].key];
  // console.log('res', tempList);

  opts.series = [];
  opts.legend.data = [];
  opts.xAxis.data = tempList.map(i => i.city);

  listKeyMap[screeningType.value].list.forEach((item, idx) => {
    opts.legend.data.push({
      name: item.name,
      itemStyle: {
        color: legendColor[idx]
      }
    });
    opts.series.push({
      ...barOpts,
      name: item.name,
      data: tempList.map(i => numToPercent(i[item.k]) || 0),
      itemStyle: {
        color: optSeriesColor[idx]
      }
    });
  });

  setOptions(opts);
}

function navClick(item) {
  screeningType.value = item.type;
  getData();
}

onMounted(() => {
  getData();
});

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
  :deep(.n-spin-content) {
    width: 100%;
    height: 100%;
  }
}
</style>
