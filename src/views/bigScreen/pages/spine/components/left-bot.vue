<template>
  <SubTitle :sub-title="`${areaTitle}脊柱弯曲筛查情况`" />
  <div class="h-80% w-95% mx-auto flex-col relactive">
    <tabBar :data="tabData" @tab-change="handleChange" />
    <div class="mt-1vh flex-1-hidden">
      <ul
        v-show="list.length && tabI == 1"
        flex
        items-center
        class="bg-[rgba(14,62,110,0.65)] text-[#CDEFFB] font-bold whitespace-nowrap bor_b"
      >
        <li class="py-0.5vw w-16.66% text-center">学生姓名</li>
        <li class="py-0.5vw w-16.66% text-center">就读学校</li>
        <li class="py-0.5vw w-16.66% text-center">所在班级</li>
        <li class="py-0.5vw w-16.66% text-center">筛查日期</li>
        <li class="py-0.5vw w-16.66% text-center">筛查人员</li>
        <li class="py-0.5vw w-16.66% text-center">筛查结果</li>
      </ul>
      <div v-show="tabI == 1" class="h-90%">
        <n-carousel
          mousewheel
          autoplay
          slides-per-view="5"
          direction="vertical"
          :show-dots="false"
          :space-between="0"
          loop
          :interval="2000"
        >
          <n-carousel-item v-for="(item, index) in list" :key="item.cityId">
            <ul
              flex
              items-center
              :style="
                'background-color:' + (index % 2 === 0 ? 'rgba(41, 122, 201, 0.03)' : 'rgba(41, 122, 201, 0.13)') + ';'
              "
              class="text-0.62vw text-[#ABDDEF] py-0.5vh h-4.6vh cursor-pointer"
              @click="
                openModal(true, {
                  noPrint: true,
                  noImmPrint: true,
                  planId: params.planId,
                  studentIds: item.studentId,
                  isDesensitization: true
                })
              "
            >
              <li class="py-0.5vw w-16.66% text-center">{{ item.studentName }}</li>
              <li class="py-0.5vw w-16.66% text-center">
                <n-ellipsis>{{ item.schoolName }} </n-ellipsis>
              </li>
              <li class="py-0.5vw w-16.66% text-center">
                <n-ellipsis>{{ item.gradeName + item.className }} </n-ellipsis>
              </li>
              <li class="py-0.5vw w-16.66% text-center whitespace-nowrap">{{ item.createTime || '/' }}</li>
              <li class="py-0.5vw w-16.66% text-center">
                <n-ellipsis class="flex-1">{{ item.creatorName || '/' }}</n-ellipsis>
              </li>
              <li class="py-0.5vw w-16.66% text-center" :class="{ 'text-[#FF4540]': !isErr(item) }">
                {{ isErr(item) ? '正常' : '异常' }}
              </li>
            </ul>
          </n-carousel-item>
        </n-carousel>
        <div v-if="!list.length" class="absolute top-28% w-35% h-65% left-0 right-0 mx-auto">
          <img src="@/assets/image/bigScreen/stu-emp.png" wh-full />
          <div class="text-center text-[#CDEFFB] text-0.8vw -mt-10%">暂无数据</div>
        </div>
      </div>

      <leftBotRight v-if="tabI == 2" :data="data" />
    </div>

    <reportModal title="筛查报告" @register="register" />
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, reactive } from 'vue';
import { getLatestScreeningList, getPrefixCount } from '@/api/bigScreen/spine.js';
import tabBar from './tabbar.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import reportModal from './printFilterListModal.vue';
import leftBotRight from './left-bot-right.vue';
import { numToPercent } from '@common/utils/common';
import { useIntervalFn } from '@vueuse/core';
import { useModal } from '@common/components/custom/Modal';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

useIntervalFn(getList, 1000 * 20);
const [register, { openModal }] = useModal();
const params = inject('params');
const tabData = reactive([
  { id: 1, name: '学生实时筛查情况' },
  { id: 2, name: '各年级异常情况' }
]);
const data = ref([]);
const list = ref([]);
const tabI = ref(1);
const areaTitle = computed(() => areaTypeMap[params.level]);

const handleChange = id => {
  tabI.value = id;
};

async function getCityPrefixResult() {
  let res = await getPrefixCount(params);
  res = dataFormat(res, 'prefixName', ['abnormalSpineRate']);
  data.value = res;
}

async function getList() {
  let res = await getLatestScreeningList({ ...params, top: 50 });
  res ||= [];
  let flag = false;
  if (res?.[0] && list.value[0]) {
    if (res[0].studentId === list.value[0]?.studentId) {
      flag = true;
    }
  }
  if (flag) return;
  list.value = res;
}

function dataFormat(tArr, n, vKs) {
  return tArr?.map(item => {
    let v = vKs.map(key => numToPercent(item[key]));
    return [item[n] || 0, ...v];
  });
}

function isErr(item) {
  return item.bgResult.warning == 0 && item.bfResult.warning == 0;
}

watch([() => params.planId, () => params.level], () => {
  if (params.planId) {
    getCityPrefixResult();
    getList();
  }
});
</script>

<style lang="less" scoped>
.bor_b {
  border-bottom: 2px solid #224d89;
}
</style>
