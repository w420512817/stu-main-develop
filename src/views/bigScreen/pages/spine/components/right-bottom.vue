<template>
  <SubTitle :sub-title="`${areaTitle}脊柱异常处理分析`" />
  <div class="flex-1-hidden overflow-auto px-5">
    <LineC :data="data" />
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from 'vue';
import { spineScreenSugestionVO } from '@/api/bigScreen/spine';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import LineC from './lineC.vue';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const areaTitle = computed(() => areaTypeMap[params.level]);
const data = ref([
  { n: '建议改正不良习惯人数', v: 0, key: 'changeAttitudeSuggestionCount' },
  { n: '建议派发科普手册人数', v: 0, key: 'handbookSuggestionCount' },
  { n: '建议专科门诊就诊定期随访人数', v: 0, key: 'hospitalSuggestionCount' }
]);

async function getSpineScreenSugestionVO() {
  let res = await spineScreenSugestionVO(params);
  data.value.forEach(item => {
    item.v = ~~res[item.key] || 0;
  });
}
watch(params, () => {
  params.planId && getSpineScreenSugestionVO();
});
</script>

<style lang="less" scoped>
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
