<template>
  <SubTitle :sub-title="`${areaTitle}各学段筛查情况`" />
  <div class="expand-all relative">
    <div ref="bar" class="h-full"></div>
  </div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';
import { screenPrefix } from '@/api/bigScreen/phyTest';

const bar = ref();
const { setOptions } = useECharts(bar);

const params = inject('params');
const loadingFn = inject('loadingFn');
const areaTitle = computed(() => areaTypeMap[params.level]);

const opts = {
  tooltip: {
    show: false
  },
  legend: {
    // 图例相关
    show: true,
    top: 10,
    left: 20,
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: '#CBE5F4',
      fontSize: '12px'
    },
    data: [
      { name: '应筛查人数', itemStyle: { color: '#27DDFF' } },
      { name: '已筛查人数', itemStyle: { color: '#F3C549' } }
    ]
  },
  grid: {
    // 图形容器
    show: false,
    top: '20%',
    left: '3%',
    right: 20,
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: { show: false }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      color: '#CBE5F4',
      fontSize: '12px',
      margin: 20
    }
  },
  series: [
    {
      name: '应筛查人数',
      type: 'bar',
      barWidth: 8,
      barGap: '100%',
      data: [],
      label: {
        show: true,
        position: 'right',
        color: '#27DDFF'
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
              color: 'rgba(39, 221, 255, 0)'
            },
            {
              offset: 0.8,
              color: 'rgba(39, 221, 255, 1)'
            },
            {
              offset: 1,
              color: 'rgba(39, 221, 255, 1)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    },
    {
      name: '已筛查人数',
      type: 'bar',
      barWidth: 8,
      barGap: '100%',
      data: [],
      label: {
        show: true,
        position: 'right',
        color: '#F3C549'
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
              offset: 0.8,
              color: 'rgba(239, 178, 36, 1)'
            },
            {
              offset: 1,
              color: 'rgba(239, 178, 36, 1)'
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
    const res = await screenPrefix({ planId: params.planId, id: params.id, level: params.level });
    // console.log('left-bottom', res);
    opts.yAxis.data = res.map(i => i.prefixName);
    opts.series[0].data = res.map(i => i.totalCount);
    opts.series[1].data = res.map(i => i.screenCount);

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
  padding: 0 0.8vw 0.8vw 0.8vw;
  .pie-wrap {
    padding: 5% 0;
  }
}
</style>
