<template>
  <div class="mt-10px">
    <div class="flex justify-between items-center">
      <span class="tit2 leading-tight">各班级{{ params.scTypeName }}</span>
      <n-select
        v-model:value="gradeId"
        class="w-30%"
        :options="gradeIdList"
        value-field="gradeId"
        label-field="gradeName"
      />
    </div>
    <div class="legend mt-20px flex gap-x-18px">
      <div class="flex">
        <img src="@/assets/image/dashbord/ratio-4.png" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">女生</span>
      </div>
      <div class="flex">
        <img src="@/assets/image/dashbord/ratio-1.png" class="w-24px h-24px" />
        <span class="text-14px text-[#333] ml-6px">男生</span>
      </div>
    </div>
    <div ref="barRef" class="h-192px mt-9px"></div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { planGradeList, classAbnormalRate } from '@/api/dashbord/school';
import { numToPercent } from '@common/utils/common';

const gradeId = ref(null);
const gradeIdList = ref([]);
const dataList = ref([]);
const params = inject('params');
const barRef = ref();
const { setOptions } = useECharts(barRef);

async function getPlanGradeList() {
  let res = await planGradeList(params);
  gradeIdList.value = res;
  if (gradeId.value == res[0]?.gradeId) {
    gradeId.value && getClassAbnormalRate();
  }
  gradeId.value = res[0]?.gradeId || null;
}

async function getClassAbnormalRate() {
  let res = await classAbnormalRate({ ...params, gradeId: gradeId.value });
  dataList.value = res;
  setBar();
}

function setBar() {
  let xData = [];
  let data = {
    man: [],
    woman: []
  };
  let maxArr = [];
  dataList.value.forEach(item => {
    xData.push(item.className);
    let manV = numToPercent(item.abnormalManRate);
    let womanV = numToPercent(item.abnormalWomanRate);
    let total = manV + womanV;
    data.man.push(manV);
    data.woman.push(womanV);
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
        return `
          <div class="flex items-center">
            <span class="w-12px h-5px bg-[#00CD7E]" style="box-shadow: 0 2px 6px #00CD7E"></span>
            <span class="ml-6px">女生 <span class="font-bold text-[#333]">${v[0].value}%</span></span>
          </div>
          <div class="flex items-center">
            <span class="w-12px h-5px bg-[#386FFE]" style="box-shadow: 0 2px 6px #3577F6"></span>
            <span class="ml-6px">男生 <span class="font-bold text-[#333]">${v[1].value}%</span></span>
          </div>
        `;
      }
    },
    series: [
      {
        name: '女生',
        type: 'bar',
        barWidth: 16,
        stack: 'tol',
        itemStyle: {
          color: '#00CD7E'
        },
        data: data.woman
      },
      {
        name: '男生',
        type: 'bar',
        barWidth: 16,
        stack: 'tol',
        itemStyle: {
          color: '#386FFF'
        },
        data: data.man
      },
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

watch(
  () => params.planId,
  () => {
    if (params.planId && params.screeningType) {
      getPlanGradeList();
    } else {
      dataList.value = [];
    }
  }
);

watch(gradeId, () => {
  if (gradeId.value) {
    getClassAbnormalRate();
  } else {
    dataList.value = [];
  }
});
</script>

<style lang="less" scoped></style>
