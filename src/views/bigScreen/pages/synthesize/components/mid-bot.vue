<template>
  <SubTitle is-large :sub-title="`${areaTitle}筛查数据实时展示`" />
  <div class="flex h-40px">
    <div class="flex items-center ml-0.5vw">
      <span class="text-0.8vw tit text-[#B7D5F0] whitespace-nowrap">累计筛查人数</span>
      <span class="text-1vw text-[#29F0FE] font-bold">{{ allCount }}</span>
    </div>
    <div class="flex items-center text-[#B7D5F0] text-0.7vw ml-1vw">
      <!-- <span class="tit mr-0.5vw">各学段学校数</span> -->
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
import { reactive, inject, watch, ref, computed, onMounted } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import ScrollList from '@/views/bigScreen/component/ScrollList.vue';
import { areaChildMap, numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getScreenPrefixCountVO, getRegionBaseVO } from '@/api/bigScreen/synthesize';

const params = inject('params');

const areaTitle = computed(() => areaChildMap[params.level]);

const state = reactive({
  columns: [
    { key: 'city', title: '省市名称', width: '20%' },
    { key: 'allCount', title: '筛查人数', width: '16%' },
    { key: 'myopiaRate', title: '近视情况', width: '16%' },
    { key: 'cariesRate', title: '患龋情况', width: '16%' },
    { key: 'outstandingRate', title: '体测优秀率', width: '16%' },
    { key: 'normalRate', title: '体检正常率', width: '16%' }
  ],
  dataList: []
});

const allCount = ref(0);
const prefxUpOrgVOS = ref([]);

const namePrefix = computed(() => {
  let nameMap = {
    1: '省市',
    2: '区县',
    3: '学校'
  };
  return nameMap[params.level];
});

async function getData() {
  const res = await getRegionBaseVO({
    planId: '',
    id: params.id,
    level: params.level
  });
  state.dataList = res.map(item => {
    return {
      city: item.city,
      allCount: item.allCount,
      cariesRate: numToPercent(item.cariesRate) + '%',
      myopiaRate: numToPercent(item.myopiaRate) + '%',
      normalRate: numToPercent(item.normalRate) + '%',
      outstandingRate: numToPercent(item.outstandingRate) + '%'
    };
  });

  const { allScreenCount, list } = await getScreenPrefixCountVO({
    planId: '',
    id: params.id,
    level: params.level
  });

  allCount.value = Number(allScreenCount);
  list.forEach(item => {
    item.screenCount = Number(item.screenCount) || 0;
  });
  prefxUpOrgVOS.value = list;
}

onMounted(() => {
  getData();
});

watch(
  () => params.level,
  () => {
    state.columns[0].title = `${namePrefix.value}名称`;
    getData();
  }
);
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
