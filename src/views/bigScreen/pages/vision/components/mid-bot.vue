<template>
  <SubTitle is-large :sub-title="'实时上报数据展示'" />
  <div class="flex h-40px">
    <div class="flex items-center ml-0.5vw">
      <span class="text-0.8vw tit text-[#B7D5F0]">累计筛查人数</span>
      <span class="text-1vw text-[#29F0FE] font-bold">{{ allCount }}</span>
    </div>
    <div class="flex items-center text-[#B7D5F0] text-0.7vw ml-1vw">
      <span class="tit mr-0.5vw">各学段学校数</span>
      <span v-for="item in prefxUpOrgVOS" :key="item.prefixName" class="">
        <span class="text-0.78vw">{{ item.prefixName }}</span>
        <span class="text-[#00D8FF] text-0.9vw mx-0.4vw">
          <n-number-animation :to="item.screenCount">{{ item.screenCount }}</n-number-animation>
        </span>
      </span>
    </div>
  </div>
  <div class="expand-all overflow-hidden">
    <ScrollList :scroll-columns="state.columns" :scroll-list="state.dataList" />
  </div>
</template>

<script setup>
import { reactive, inject, watch, ref, computed } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getCurrentReport } from '@/api/bigScreen/vision';

const params = inject('params');
const loadingFn = inject('loadingFn');

const state = reactive({
  columns: [
    { key: 'areaName', title: '省市名称', width: '12.5%' },
    { key: 'completionRate', title: '上报率', width: '12.5%' },
    { key: 'myopiaRate', title: '近视情况', width: '12.5%' },
    { key: 'boyMyopiaRate', title: '男生', width: '12.5%' },
    { key: 'girlMyopiaRate', title: '女生', width: '12.5%' },
    { key: 'highMyopiaRate', title: '高度', width: '12.5%' },
    { key: 'mediumMyopiaRate', title: '中度', width: '12.5%' },
    { key: 'lowMyopiaRate', title: '低度', width: '12.5%' }
  ],
  dataList: []
});

const allCount = ref(0);
const prefxUpOrgVOS = reactive([
  { prefixName: '幼儿园', screenCount: 0, key: 'kindergartenOrgNum' },
  { prefixName: '小学', screenCount: 0, key: 'primaryOrgNum' },
  { prefixName: '初中', screenCount: 0, key: 'juniorOrgNum' },
  { prefixName: '高中', screenCount: 0, key: 'highOrgNum' }
]);
const namePrefix = computed(() => {
  let nameMap = {
    1: '省市',
    2: '区县',
    3: '学校'
  };
  return nameMap[params.level];
});

async function getData() {
  try {
    loadingFn(1);
    const res = await getCurrentReport({ planId: params.planId, areaId: params.id });
    // console.log('mid-bottom', res);
    allCount.value = res?.completionCount || 0;
    prefxUpOrgVOS.forEach(i => {
      i.screenCount = res?.[i.key];
    });
    state.dataList = res?.childMyopia.map(item => {
      return {
        areaName: item.areaName,
        completionRate: numToPercent(item.completionRate) + '%',
        myopiaRate: numToPercent(item.myopiaRate) + '%',
        boyMyopiaRate: numToPercent(item.boyMyopiaRate) + '%',
        girlMyopiaRate: numToPercent(item.girlMyopiaRate) + '%',
        highMyopiaRate: numToPercent(item.highMyopiaRate) + '%',
        mediumMyopiaRate: numToPercent(item.mediumMyopiaRate) + '%',
        lowMyopiaRate: numToPercent(item.lowMyopiaRate) + '%'
      };
    });
  } finally {
    loadingFn(-1);
  }
}

watch([() => params.planId, () => params.level], () => {
  state.columns[0].title = `${namePrefix.value}名称`;
  getData();
});
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0.8vw 1vw 0.8vw;
}
.tit {
  color: #f2fcff;
  font-family: titleBlack;
  position: relative;
  z-index: 2;
  font-size: 1vw;
  &::after {
    content: ' ';
    position: absolute;
    height: 0.7vh;
    width: 3vw;
    background: linear-gradient(90deg, rgba(41, 240, 254, 0.7) 0%, rgba(41, 240, 254, 0) 100%);
    left: 0.05vw;
    bottom: 0.5vh;
    z-index: 1;
  }
}
</style>
