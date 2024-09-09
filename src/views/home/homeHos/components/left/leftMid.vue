<template>
  <div class="mt-10px">
    <div>
      <span class="tit2">各学段{{ params.scTypeName }}</span>
    </div>
    <div class="legend mt-20px flex gap-x-18px">
      <div class="flex">
        <img src="@/assets/image/dashbord/ratio-6.png" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">总计</span>
      </div>
      <div class="flex">
        <img src="@/assets/image/dashbord/ratio-2.png" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">女生</span>
      </div>
      <div class="flex">
        <img src="@/assets/image/dashbord/ratio-1.png" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">男生</span>
      </div>
    </div>
    <div ref="lineRef" class="h-192px mt-9px"></div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { prefixRate } from '@/api/dashbord/hosptial';
import { numToPercent } from '@common/utils/common';
import ratio6 from '@/assets/image/dashbord/ratio-6.png';
import ratio2 from '@/assets/image/dashbord/ratio-2.png';
import ratio1 from '@/assets/image/dashbord/ratio-1.png';

const params = inject('params');
const lineRef = ref();
const { setOptions: setOptLine } = useECharts(lineRef);
const dataList = ref([]);
let paramsDataMap = {
  1: {
    vKey: 'myopiaVOList',
    abnormalManRate: 'manMyopiaRate',
    abnormalWomanRate: 'womanMyopiaRate',
    abnormalRate: 'myopiaRate'
  },
  2: {
    vKey: 'cariesVOList',
    abnormalManRate: 'manCariesRate',
    abnormalWomanRate: 'womanCariesRate',
    abnormalRate: 'abnormalRate'
  },
  3: {
    vKey: 'physicalObesityVOList',
    abnormalManRate: 'manObesityRate',
    abnormalWomanRate: 'womanObesityStdCount',
    abnormalRate: 'obesityRate'
  },
  4: {
    vKey: 'outstandingRate',
    abnormalManRate: 'manOutstandingRate',
    abnormalWomanRate: 'womanOutstandingRate',
    abnormalRate: 'physicalTestVOList'
  }
};

function setLine() {
  let { abnormalManRate, abnormalWomanRate, abnormalRate } = paramsDataMap[params.screeningType];
  let xAxisData = [];
  let data = {
    man: [],
    woman: [],
    total: []
  };
  dataList.value.forEach(item => {
    xAxisData.push(item.prefixName);
    data.man.push(numToPercent(item[abnormalManRate]));
    data.woman.push(numToPercent(item[abnormalWomanRate]));
    data.total.push(numToPercent(item[abnormalRate]));
  });
  let lineSer = {
    type: 'line',
    smooth: true,
    showSymbol: false,
    symbolSize: 8
  };
  let option = {
    grid: {
      top: '10%',
      right: '5%',
      bottom: '14%'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#1F6CFF',
          type: 'dashed'
        }
      },
      formatter(v) {
        return `
          <div class="flex">
            <img src="${ratio6}" class="w-24px h-24px" />
            <span>总计 <span class="font-bold">${v[2].value}%</span></span>
          </div>
          <div class="flex">
            <img src="${ratio2}" class="w-24px h-24px" />
            <span>女生 <span class="font-bold">${v[1].value}%</span></span>
          </div>
          <div class="flex">
            <img src="${ratio1}" class="w-24px h-24px" />
            <span>男生 <span class="font-bold">${v[0].value}%</span></span>
          </div>
        `;
      }
    },
    legend: { show: false },
    yAxis: {
      axisLine: { show: false },
      axisLabel: { color: '#777777' },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      max: 100,
      minInterval: 25,
      offset: 5
    },
    xAxis: {
      axisLine: { color: 'rgba(255, 255, 255, 0.25)', lineStyle: { color: '#EEEEEE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      axisLabel: { color: '#777777' },
      axisTick: { show: false },
      data: xAxisData,
      boundaryGap: false
    },
    series: [
      {
        ...lineSer,
        itemStyle: {
          color: '#386FFF'
        },
        data: data.man,
        lineStyle: {
          shadowColor: '#386FFF',
          shadowOffsetX: 0,
          shadowOffsetY: 5,
          shadowBlur: 10
        }
      },
      {
        ...lineSer,
        itemStyle: {
          color: '#9483F2'
        },
        data: data.woman,
        lineStyle: {
          shadowColor: '#9483F2',
          shadowOffsetX: 0,
          shadowOffsetY: 5,
          shadowBlur: 10
        }
      },
      {
        ...lineSer,
        itemStyle: {
          color: '#FFCF77'
        },
        data: data.total,
        lineStyle: {
          shadowColor: '#FFCF77',
          shadowOffsetX: 0,
          shadowOffsetY: 5,
          shadowBlur: 10
        }
      }
    ]
  };
  setOptLine(option);
}

async function getPrefixRate() {
  let res = await prefixRate(params);
  let vKey = paramsDataMap[params.screeningType].vKey;
  dataList.value = res[vKey];
  setLine();
}

watch(
  () => params.planId,
  () => {
    if (params.planId && params.screeningType) {
      getPrefixRate();
    }
  }
);
</script>

<style lang="less" scoped></style>
