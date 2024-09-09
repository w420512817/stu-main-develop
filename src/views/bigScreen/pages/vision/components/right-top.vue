<template>
  <SubTitle :sub-title="'视力情况'" />
  <div class="expand-all flex-col flex-1">
    <div class="flex-col h-45%">
      <SwitchNav :nav-list="navList1" @nav-change="navClick1" />
      <div ref="bar" class="flex-1"></div>
    </div>
    <div class="flex-col h-55%">
      <SwitchNav :nav-list="navList2" @nav-change="navClick2" />
      <div ref="line" class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch, ref, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SwitchNav from '../../../component/SwitchNav.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getMyopiaRate, getPrefixRate, getMyopiaLevel, getPrefixlevel } from '@/api/bigScreen/vision';

const params = inject('params');
const loadingFn = inject('loadingFn');

const bar = ref();
const line = ref();
const { setOptions: setBar } = useECharts(bar, 'bigScreen');
const { setOptions: setLine } = useECharts(line, 'bigScreen');

const prefixName = computed(() => {
  let namePrefixMap = {
    1: '各市',
    2: '各区',
    3: '各学校'
  };
  return namePrefixMap[params.level];
});
const navList1 = computed(() => [
  { name: `${prefixName.value}近视情况`, type: '1' },
  { name: `不同学段近视情况`, type: '2' }
]);

const navList2 = computed(() => [
  { name: `${prefixName.value}近视程度`, type: '3' },
  { name: `不同学段近视程度`, type: '4' }
]);

const nav1 = ref('1');
const nav2 = ref('3');

const navClick1 = item => {
  nav1.value = item.type;
  getTopData();
};
const navClick2 = item => {
  nav2.value = item.type;
  getBotData();
};

const barOpts = {
  tooltip: {
    trigger: 'axis',
    valueFormatter: value => value + '%'
  },
  yAxis: {
    name: '%',
    max: 100
  },
  grid: {
    top: 35,
    left: 20
  },
  legend: {
    show: false
  },
  xAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '近视率',
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
    }
  ]
};
const lineOpts = {
  tooltip: {
    trigger: 'axis',
    valueFormatter: value => value + '%'
  },
  yAxis: {
    name: '%'
  },
  color: ['#27DDFF', '#F3C549', '#EF47BB'],
  legend: {
    show: true,
    right: 20,
    data: ['低度', '中度', '高度']
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: true
    },
    data: ['杭州', '湖州', '嘉兴', '绍兴', '宁波', '金华', '台州']
  },
  series: [
    {
      name: '高度',
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#EF47BB'
      },
      showSymbol: false,
      data: [66, 76, 90, 86, 96, 80, 77],
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
              color: 'rgba(236, 51, 183, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(236, 51, 183, 0)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '中度',
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#F3C549'
      },
      showSymbol: false,
      data: [90, 86, 96, 80, 77, 66, 76],
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
      name: '低度',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [76, 90, 86, 96, 80, 77, 66],
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
    }
  ]
};

async function getData() {
  try {
    loadingFn(1);
    await getTopData();
    await getBotData();
  } finally {
    loadingFn(-1);
  }
}

async function getTopData() {
  if (nav1.value === '1') {
    const res = await getMyopiaRate({ planId: params.planId, areaId: params.id });
    // console.log('right-top1', res);
    if (params.level == 3) {
      res.splice(0, 1);
    }
    barOpts.xAxis.data = res?.map(i => i.areaName);
    barOpts.series[0].data = res?.map(i => numToPercent(i.myopiaRate));
    setBar(barOpts);
  } else {
    const res = await getPrefixRate({ planId: params.planId, areaId: params.id });
    // console.log('right-top2', res);

    barOpts.xAxis.data = res?.map(i => i.prefixName);
    barOpts.series[0].data = res?.map(i => numToPercent(i.myopiaRate));
    setBar(barOpts);
  }
}
async function getBotData() {
  if (nav2.value === '3') {
    let res = await getMyopiaLevel({ planId: params.planId, areaId: params.id });
    res ||= [];
    // console.log('right-top3', res);
    if (params.level == 3) {
      res.splice(0, 1);
    }
    lineOpts.xAxis.data = res?.map(i => i.areaName);
    lineOpts.series[0].data = res?.map(i => numToPercent(i.highMyopiaRate));
    lineOpts.series[1].data = res?.map(i => numToPercent(i.mediumMyopiaRate));
    lineOpts.series[2].data = res?.map(i => numToPercent(i.lowMyopiaRate));
    setLine(lineOpts);
  } else {
    const res = await getPrefixlevel({ planId: params.planId, areaId: params.id });
    // console.log('right-top4', res);

    lineOpts.xAxis.data = res.map(i => i.prefixName);
    lineOpts.series[0].data = res?.map(i => numToPercent(i.highMyopiaRate));
    lineOpts.series[1].data = res?.map(i => numToPercent(i.mediumMyopiaRate));
    lineOpts.series[2].data = res?.map(i => numToPercent(i.lowMyopiaRate));
    setLine(lineOpts);
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
  :deep(.n-spin-content) {
    width: 100%;
    height: 100%;
  }
}
</style>
