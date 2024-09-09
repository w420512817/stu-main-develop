<template>
  <SubTitle :sub-title="`${areaTitle}脊柱异常结果分析`" />
  <div class="flex-1-hidden overflow-auto">
    <div px-5>
      <LineC :data="data" :show-percent="true" />
    </div>
    <div class="mt-0.5vh px-5">
      <LineC :data="data2" bar2 :show-percent="true" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, inject, computed } from 'vue';
import { spineScreenCurvatureVO } from '@/api/bigScreen/spine';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import LineC from './lineC.vue';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const areaTitle = computed(() => areaTypeMap[params.level]);
let data = reactive([
  {
    n: '脊椎侧弯总数',
    v: 0,
    key: 'abnormalScoliosisSpineStatusCount',
    percentK: 'abnormalScoliosisSpineStatusRate',
    percent: 0,
    tit: true
  },
  {
    n: '脊柱侧弯阳性I度',
    v: 0,
    key: 'abnormalScoliosisICount',
    percentK: 'abnormalScoliosisIRate',
    percent: 0
  },
  { n: '脊柱侧弯阳性II度', v: 0, key: 'abnormalScoliosisIICount', percentK: 'abnormalScoliosisIIRate', percent: 0 },
  { n: '脊柱侧弯阳性III度', v: 0, key: 'abnormalScoliosisIIICount', percentK: 'abnormalScoliosisIIIRate', percent: 0 }
]);

let data2 = reactive([
  {
    n: '脊柱前后弯曲总数',
    v: 0,
    key: 'abnormalCurvatureOfSpineCount',
    percentK: 'abnormalCurvatureOfSpineRate',
    percent: 0,
    tit: true
  },
  {
    n: '脊柱前凸异常阳性',
    v: 0,
    key: 'abnormalLordosisCurvatureOfSpineCount',
    percentK: 'abnormalLordosisCurvatureOfSpineRate',
    percent: 0
  },
  {
    n: '脊柱后凸异常阳性',
    v: 0,
    key: 'abnormalKyphoticCurvatureOfSpineCount',
    percentK: 'abnormalKyphoticCurvatureOfSpineRate',
    percent: 0
  }
]);

async function getSpineScreenCurvatureVO() {
  let { spineScreenCurvatureVO: s1, spineScreenScoliosisVO: s2 } = await spineScreenCurvatureVO(params);
  data.forEach(item => {
    item.v = ~~s2[item.key] || 0;
    item.percent = s2[item.percentK] || 0;
  });
  console.log(data);
  data2.forEach(item => {
    item.v = ~~s1[item.key] || 0;
    item.percent = s1[item.percentK] || 0;
  });
}

watch(params, () => {
  params.planId && getSpineScreenCurvatureVO();
});
</script>

<style lang="less" scoped>
:deep(.tit) {
  color: #f2fcff;
  font-family: YouSheBiaoTiHei;
  position: relative;
  z-index: 2;
  font-size: 1vw;
  &::after {
    content: ' ';
    position: absolute;
    height: 0.7vh;
    width: 100%;
    background: linear-gradient(90deg, rgba(41, 240, 254, 0.7) 0%, rgba(41, 240, 254, 0) 100%);
    left: 0.05vw;
    bottom: 0.5vh;
    z-index: 1;
  }
}
.label {
  font-size: 0.8vw;
  font-weight: 500;
  color: #b7d5f0;
  line-height: 24px;
  width: 42%;
}
.line {
  position: relative;
  &::after {
    content: ' ';
    position: absolute;
    height: 100%;
    width: 0.05vw;
    border: 0.05vw solid;
    border-image: radial-gradient(circle, rgba(55, 96, 130, 1), rgba(4, 14, 48, 0)) 2 2;
    left: 40%;
  }
}
.bar {
  background: linear-gradient(90deg, rgba(67, 85, 164, 0) 0%, #f3c549 100%);
  height: 0.5vh;
  position: relative;
  animation: barW 0.5s ease-in-out;
  &::after {
    content: ' ';
    position: absolute;
    right: 0;
    width: 0.1vw;
    height: 0.4vh;
    background: #ffffff;
    box-shadow: 0 0 0.4vh 0.1vw #ffffff;
  }
}
.num {
  font-size: 0.9vw;
  font-weight: bold;
  color: #ffffff;
  line-height: 21px;
  text-shadow: 0px 0px 7px #5588ff;
  margin-left: 0.4vw;
}

@keyframes barW {
  0% {
    width: 0%;
  }
  100% {
    width: var(--width);
  }
}
</style>
