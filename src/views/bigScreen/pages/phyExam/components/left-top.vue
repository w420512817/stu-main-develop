<template>
  <n-select
    v-model:show="selectShow"
    v-model:value="currentBatch"
    class="batch-select"
    label-field="planName"
    value-field="planId"
    :options="selectOptions"
    @update:value="handleUpdateValue"
  >
    <template #arrow>
      <img v-if="selectShow" src="@/assets/image/bigScreen/arrow-top.png" alt="" class="w-full" />
      <img v-else src="@/assets/image/bigScreen/arrow-bottom.png" alt="" class="w-full" />
    </template>
  </n-select>
  <SubTitle :sub-title="`${areaTitle}体检筛查情况`" />
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { useECharts } from '@common/hooks/useECharts';
import { ref, onMounted, inject, watch, computed } from 'vue';
import { screenTypeMap, areaTypeMap } from '@/views/bigScreen/data/index.data.js';

import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { planList } from '@common/api/examine/plan';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getRegionPhysicalScreenRate } from '@/api/bigScreen/phyExam';

const params = inject('params');
const paramsChange = inject('paramsChange');
const loadingFn = inject('loadingFn');

const currentBatch = ref('');
const selectShow = ref(false);
const selectOptions = ref([]);
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

let chartOption = {
  tooltip: { trigger: 'axis', valueFormatter: value => value + '%' },
  legend: { show: false },
  grid: {
    // 图形容器
    show: false,
    top: 40,
    left: 10,
    right: 20,
    bottom: 5,
    containLabel: true
  },
  yAxis: {
    name: '%',
    max: 100,
    nameTextStyle: {
      padding: [0, 0, 0, -20],
      color: '#D7DCFC'
    },
    nameGap: 15
  },
  xAxis: {
    show: true,
    type: 'category',
    boundaryGap: true, // 坐标轴两边留白策略
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.25)',
        width: 1
      }
    },
    axisLabel: {
      color: '#CBE5F4',
      fontSize: '12px'
      // rotate: 45,
      // align: 'center',
      // margin: 16
    },
    data: []
  },
  series: [
    {
      name: '筛查率',
      type: 'bar',
      barWidth: 16,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          global: false,
          colorStops: [
            {
              offset: 0,
              color: '#3FE1FF'
            },
            {
              offset: 0.5,
              color: '#3FE1FF'
            },
            {
              offset: 1,
              color: '#F3C549'
            }
          ]
        }
      },
      data: []
    },
    {
      // 分隔
      tooltip: { show: false },
      type: 'pictorialBar',
      itemStyle: {
        color: '#112E4B'
      },
      symbolRepeat: 'fixed',
      symbolMargin: 1,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [16, 3],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      data: [],
      width: 2,
      z: 0,
      zlevel: 1
    },
    {
      // 背景
      tooltip: { show: false },
      type: 'pictorialBar',
      itemStyle: {
        color: '#112E4B'
      },
      symbolRepeat: 'fixed',
      symbolMargin: 0,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [24, 3],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      data: [],
      width: 4,
      z: 0,
      zlevel: 0
    }
  ]
};

function handleUpdateValue(val) {
  paramsChange('planId', val);
}

async function getPlanList() {
  const { records } = await planList({ appType: screenTypeMap['体检'] });

  // console.log('planList', records);

  if (!records.length) return;
  selectOptions.value = records;
  currentBatch.value = records[0].planId;
  paramsChange('planId', currentBatch.value);
}

async function setBar() {
  try {
    loadingFn(1);
    let res = await getRegionPhysicalScreenRate({ planId: currentBatch.value, id: params.id, level: params.level });
    res ||= [];
    const xAxisData = res.map(item => item.regionName);
    const seriesData = res.map(item => numToPercent(item.screenRate));

    chartOption.xAxis.data = xAxisData;
    chartOption.series[0].data = seriesData;
    chartOption.series[1].data = seriesData;
    chartOption.series[2].data = Array(res.length).fill(100);

    setOptions(chartOption);
  } finally {
    loadingFn(-1);
  }
}

onMounted(() => {
  getPlanList();
});

watch([() => params.planId, () => params.level], () => {
  setBar();
});
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/batch-select.less';
.batch-select {
  width: 60%;
  height: 2.2vw;
  padding-left: 0.5vw;
}
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 0.8vw 0.8vw;
}
</style>
