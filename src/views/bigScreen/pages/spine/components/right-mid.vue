<template>
  <SubTitle :sub-title="`${areaTitle}脊柱异常学生男女比例`" />
  <div class="px-1.5vw pt-1vh">
    <div class="whitespace-nowrap flex">
      <div class="font-medium leading-none">
        <div flex>
          <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
            <span class="rhombus"></span>
            <span class="text-[#B7D5F0] ml-[0.5vw]">男生异常</span>
          </div>
          <span class="text-[#29F0FE] font-bold ml-0.7vw">{{ data.manAbnormalSpineCount }}</span>
        </div>
        <div flex mt-1vh>
          <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
            <span class="rhombus !bg-[#FEB040]"></span>
            <span class="text-[#B7D5F0] ml-[0.5vw]">女生异常</span>
          </div>
          <span class="text-[#FEB040] font-bold ml-0.7vw">{{ data.womanAbnormalSpineCount }}</span>
        </div>
      </div>
      <div class="font-medium leading-none ml-24px">
        <div flex>
          <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
            <span class="text-[#B7D5F0]">男生异常率</span>
          </div>
          <div class="text-[#29F0FE] font-bold ml-0.6vw">{{ data.manAbnormalSpineRate }}%</div>
        </div>
        <div flex mt-1vh>
          <div class="text-[0.8vw] text-[#B7D5F0] flex items-center">
            <span class="text-[#B7D5F0]">女生异常率</span>
          </div>
          <div class="text-[#FEB040] font-bold ml-0.6vw">{{ data.womanAbnormalSpineRate }}%</div>
        </div>
      </div>
    </div>
    <div class="bar flex items-center mt-1vh">
      <div
        class="flex-1 h-2.5vh flex justify-between px-0.7vw tran"
        :style="
          showBg
            ? `background: linear-gradient(90deg, #1f56d7 0%, #29f0fe ${data.manAbnormalSpineRate}%, #023668 ${
                data.manAbnormalSpineRate
              }%,#023668 ${data.manAbnormalSpineRate}%,#FEB040 ${data.manAbnormalSpineRate}%, #E18706 ${
                data.manAbnormalSpineRate + data.womanAbnormalSpineRate
              }%, #023668 100%)`
            : `background: #023668`
        "
      >
        <div v-for="i in 19" :key="i" class="bg-[#05144B] h-full w-0.5vw"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { spineScreenSexVO } from '@/api/bigScreen/spine';
import { numToPercent } from '@common/utils/common';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
let data = ref({
  manAbnormalSpineRate: 0,
  womanAbnormalSpineRate: 0
});

const areaTitle = computed(() => areaTypeMap[params.level]);
const showBg = computed(() => {
  let { manAbnormalSpineCount, womanAbnormalSpineCount } = data.value;
  return !!(+manAbnormalSpineCount || +womanAbnormalSpineCount);
});

async function getSpineScreenSexVO() {
  let res = await spineScreenSexVO(params);
  res.manAbnormalSpineRate = numToPercent(res.manAbnormalSpineRate);
  res.womanAbnormalSpineRate = numToPercent(res.womanAbnormalSpineRate);
  data.value = res;
}

watch(params, () => {
  params.planId && getSpineScreenSexVO();
});
</script>

<style lang="less" scoped>
.bar {
  background: rgba(10, 29, 103, 0.5);
  border: 1px solid;
  border-image: radial-gradient(circle, rgba(255, 255, 255, 1), rgba(13, 22, 52, 1)) 1 1;
  padding: 0.4vh 1vh;
}
.tran {
  animation: bgAni 1s;
}
@keyframes bgAni {
  0% {
    background-size: 70% 100%;
  }
  100% {
    background-size: 100% 100%;
  }
}
</style>
