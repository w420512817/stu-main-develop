<template>
  <div class="mt-10px">
    <div>
      <span class="tit2">各区县{{ params.scTypeName }}</span>
    </div>
    <div class="legend mt-20px flex gap-x-18px">
      <div v-for="item in barData" :key="item.name" class="flex">
        <img :src="item.icon" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">{{ item.name }}</span>
      </div>
    </div>
    <div ref="barRef" class="h-192px mt-9px"></div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { regionRate } from '@/api/dashbord/hosptial';
import { numToPercent } from '@common/utils/common';

const dataList = ref([]);
const params = inject('params');
const barRef = ref();
const prefixArr = ['幼儿园', '小学', '初中'];
// , '职高', '普高', '大学专科', '大学本科' 再联络
let paramsDataMap = {
  1: {
    vKey: 'myopiaVOList',
    rateKey: 'myopiaRate'
  },
  2: {
    vKey: 'cariesVOList',
    rateKey: 'cariesRate'
  },
  3: {
    vKey: 'physicalObesityVOList',
    rateKey: 'obesityRate'
  },
  4: {
    vKey: 'physicalTestVOList',
    rateKey: 'outstandingRate'
  }
};
const barData = ref([
  {
    icon: getImg(`ratio-6.png`),
    barColor: '#FFB52F',
    name: null
  },
  {
    icon: getImg(`ratio-4.png`),
    barColor: '#00CD7E',
    name: null
  },
  {
    icon: getImg(`ratio-1.png`),
    barColor: '#386FFF',
    name: null
  }
]);
const { setOptions } = useECharts(barRef);

async function getRegionRate() {
  let res = await regionRate({ ...params, scTypeName: undefined });
  let vKey = paramsDataMap[params.screeningType].vKey;
  dataFormat(res[vKey]);
  dataList.value = res[vKey];
  setBar();
}

function dataFormat(res) {
  let rateKey = paramsDataMap[params.screeningType].rateKey;
  let prefixName = prefixArr;
  // 不找所有的学段了 暂时三个
  // res.forEach(item => {
  //   item.list?.forEach(v => {
  //     let i = prefixArr.indexOf(v.prefixName);
  //     if (i !== -1 && !prefixName[i]) {
  //       prefixName[i] = v.prefixName;
  //     }
  //   });
  // });
  // prefixName = prefixName.filter(Boolean);
  res.forEach(item => {
    item.list = prefixName.map(item2 => {
      let res = {
        rate: 0,
        prefixName: item2
      };
      let v = item.list.find(item3 => item3.prefixName === item2);
      if (v) {
        res.rate = v[rateKey];
      }
      return res;
    });
  });
  prefixName.forEach((item, i) => {
    barData.value[i].name = item;
  });
}

function setBar() {
  let xData = [];
  let bars = barData.value
    .filter(item => item.name)
    .map(item => {
      return {
        type: 'bar',
        name: item.name,
        barWidth: 16,
        stack: 'tol',
        itemStyle: {
          color: item.barColor
        },
        data: []
      };
    });
  let maxArr = [];
  dataList.value.forEach(item => {
    xData.push(item.region);
    let total = 0;
    item.list.forEach((item2, i) => {
      let v = numToPercent(item2.rate);
      bars[i].data.push(v);
      total += v;
    });

    maxArr.push(total);
  });
  let maxV = Math.ceil(Math.max(...maxArr) / 100) * 100;
  let pictorialBarV = xData.map(_ => maxV);
  let option = {
    grid: {
      top: '10%',
      right: '5%',
      bottom: '14%'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter(v) {
        console.log(v);
        let str = v.map(item => {
          return `<div class="flex items-center">
            <span class="w-12px h-5px" style="box-shadow: 0 2px 6px ${item.color};background: ${item.color}"></span>
            <span class="ml-6px flex">
              <span class="w-55px">${item.seriesName}</span>
              <span class="font-bold text-[#333]"> ${item.value}%</span>
            </span>
          </div>`;
        });
        return str.join('');
      }
    },
    series: [
      ...bars,
      {
        // 分隔
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        symbolRepeat: 'fixed',
        symbolMargin: 1,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [18, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: pictorialBarV,
        emphasis: {
          disabled: true
        },
        width: 2,
        z: 0,
        zlevel: 1,
        animation: false
      },
      {
        // 背景
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        emphasis: {
          disabled: true
        },
        symbolRepeat: 'fixed',
        symbolMargin: 0,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [24, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: pictorialBarV,
        width: 4,
        z: 0,
        zlevel: 0
      }
    ],
    legend: { show: false },
    yAxis: {
      axisLine: { show: false },
      axisLabel: { color: '#777777' },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      minInterval: 25,
      offset: 5,
      max: maxV
    },
    xAxis: {
      axisLine: { color: 'rgba(255, 255, 255, 0.25)', lineStyle: { color: '#EEEEEE' } },
      axisLabel: { color: '#777777' },
      axisTick: { show: false },
      data: xData
    }
  };
  setOptions(option);
}

function getImg(v) {
  return new URL(`../../../../../assets/image/dashbord/${v}`, import.meta.url).href;
}

watch(
  () => params.planId,
  () => {
    params.planId && getRegionRate();
  }
);
</script>

<style lang="less" scoped></style>
