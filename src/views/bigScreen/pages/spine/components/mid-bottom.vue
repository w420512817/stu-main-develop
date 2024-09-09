<template>
  <SubTitle is-large :sub-title="`${areaTitle}实时筛查情况`" />
  <div class="flex">
    <div class="flex items-center">
      <span class="text-0.8vw tit text-[#B7D5F0] mx-0.5vw">累计筛查人次</span>
      <span class="text-1vw text-[#29F0FE] font-bold">{{ data.totalUpNum }}</span>
    </div>
    <div class="flex items-center text-[#B7D5F0] text-0.7vw ml-1.8vw">
      <span class="ml-0.5vw tit">各学段学校数</span>
      <span v-for="item in data.prefxUpOrgVOS" :key="item.prefxName" class="ml-0.5vw">
        <span class="text-0.78vw">{{ item.prefxName }}</span>
        <span class="text-[#CDEFFB] text-0.9vw mx-0.4vw">
          <n-number-animation :to="item.orgNum">{{ item.orgNum }}</n-number-animation>
        </span>
      </span>
    </div>
  </div>
  <div class="mt-0.5vh">
    <ul flex items-center class="bg-[rgba(14,62,110,0.65)] text-[#CDEFFB] font-bold text-center bor_b text-3">
      <li class="px-0.5vw w-12%">{{ cityName }}名称</li>
      <li class="px-0.5vw w-13%">筛查进度</li>
      <li class="px-0.5vw w-12%">脊柱健康</li>
      <div class="w-30%" style="border-left: 1px solid #224d89">
        <div class="w-full py-0.3vw" style="border-bottom: 1px solid #224d89">异常男女比例</div>
        <div class="flex justify-between mt-0.2vh">
          <li class="px-0.5vw py-0.3vw w-33%" style="border-right: 1px solid #224d89">全部</li>
          <li class="px-0.5vw py-0.25vw w-33% whitespace-nowrap" style="border-right: 1px solid #224d89">男生</li>
          <li class="px-0.5vw py-0.25vw w-33% whitespace-nowrap">女生</li>
        </div>
      </div>
      <div class="w-33%" style="border-left: 1px solid #224d89">
        <div class="w-full py-0.3vw" style="border-bottom: 1px solid #224d89">异常结果比例</div>
        <div class="flex justify-between mt-0.2vh text-0.7vw">
          <li class="px-0.5vw py-0.3vw w-45%" style="border-right: 1px solid #224d89">脊柱侧弯</li>
          <li class="px-0.5vw py-0.25vw w-55% whitespace-nowrap">脊柱前后弯曲异常</li>
        </div>
      </div>
    </ul>
    <div class="h13.6vh">
      <n-carousel
        slides-per-view="3"
        autoplay
        direction="vertical"
        :show-dots="false"
        :space-between="0"
        loop
        :interval="2000"
      >
        <n-carousel-item v-for="(item, index) in data.realTimeCityUpVOS" :key="item.cityId" style="height: 4.3vh">
          <ul
            flex
            items-center
            class="text-3 text-[#ABDDEF] py-0.5vh h-4.3vh text-center"
            :class="index % 2 === 0 ? 'bg-[#050D2F]' : 'bg-[#071E3E]'"
          >
            <li class="px-0.5vw w-12%">{{ item.cityName }}</li>
            <li class="px-0.5vw w-13% flex items-center">
              <div class="w-48% flex-center flex-shrink-0">
                <n-progress
                  type="line"
                  processing
                  rail-color="#253A54"
                  :border-radius="2"
                  :fill-border-radius="2"
                  :percentage="item.completionRate"
                  indicator-text-color="#2ED98E"
                  :show-indicator="false"
                />
              </div>
              <span class="text-[#1A9367] ml-0.2vw">{{ item.completionRate }}%</span>
            </li>
            <li class="px-0.5vw w-12%">{{ item.spinalHealthRate }}%</li>
            <li class="px-0.5vw w-11% text-[#FF4540]">{{ item.spinalUnHealthRate }}%</li>
            <li class="px-0.5vw text-center text-[#FF4540] w-10%">{{ item.manUnusualRate }}%</li>
            <li class="px-0.5vw text-center text-[#FF4540] w-9%">{{ item.womanUnusualRate }}%</li>
            <li class="px-0.5vw w-17%">{{ item.scoliosisRate }}%</li>
            <li class="px-0.5vw w-17%">{{ item.spinalFlexionRate }}%</li>
          </ul>
        </n-carousel-item>
      </n-carousel>
      <div v-if="!data.realTimeCityUpVOS.length" class="absolute top-52% w-20% h-40% left-0 right-0 mx-auto">
        <img src="@/assets/image/bigScreen/stu-emp.png" wh-full />
        <div class="text-center text-[#CDEFFB] text-0.8vw -mt-10%">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, watch, ref, computed } from 'vue';
import { realTimeUpCondition } from '@/api/bigScreen/spine';
import { numToPercent } from '@common/utils/common';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const areaTitle = computed(() => areaTypeMap[params.level]);
const data = ref({
  realTimeCityUpVOS: [],
  prefxUpOrgVOS: [],
  totalUpNum: 0
});

const cityName = computed(() => {
  let nameMap = {
    1: '省市',
    2: '区县',
    3: '学校'
  };
  return nameMap[params.level];
});

async function getRealTimeUpCondition() {
  let res = await realTimeUpCondition(params);
  res.realTimeCityUpVOS.forEach(item => {
    item.completionRate = numToPercent(item.completionRate, 'noMax');
    item.spinalUnHealthRate = numToPercent(item.spinalUnHealthRate);
    item.manUnusualRate = numToPercent(item.manUnusualRate);
    item.womanUnusualRate = numToPercent(item.womanUnusualRate);
    item.spinalHealthRate = numToPercent(item.spinalHealthRate);
    item.scoliosisRate = numToPercent(item.scoliosisRate);
    item.spinalFlexionRate = numToPercent(item.spinalFlexionRate);
  });
  data.value = res;
}

watch(params, () => {
  params.planId && getRealTimeUpCondition();
});
</script>

<style lang="less" scoped>
.bor_b {
  border-bottom: 2px solid #224d89;
}
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
:deep(.n-progress.n-progress--line .n-progress-custom-content) {
  margin-left: 0.3vw;
}
:deep(.n-progress .n-progress-graph .n-progress-graph-line .n-progress-graph-line-rail .n-progress-graph-line-fill) {
  background: linear-gradient(270deg, #15e687 0%, #1a9367 100%) !important;
}
:deep(.n-progress-graph-line-rail) {
  height: 1vh !important;
}
</style>
