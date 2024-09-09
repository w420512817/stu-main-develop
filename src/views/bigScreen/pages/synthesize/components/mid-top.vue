<template>
  <div class="wh-full flex justify-around items-center">
    <div
      v-for="item in titleList"
      :key="item.key"
      class="h-full w-7.3vw flex-col items-center justify-center title-item"
    >
      <div class="num">
        <n-number-animation :to="item.num">
          {{ item.num }}
        </n-number-animation>
        {{ item.key === 'screenRate' ? '%' : '' }}
      </div>
      <div class="text whitespace-nowrap">{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getBaseScreen } from '@/api/bigScreen/synthesize';

import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const { userInfo } = userStore;

const titleList = reactive([
  { id: 1, num: 0, text: '筛查计划总数(次)', key: 'allCount' },
  { id: 2, num: 0, text: '视力筛查(次)', key: 'visionCount' },
  { id: 3, num: 0, text: '龋齿筛查(次)', key: 'cariesCount' },
  { id: 4, num: 0, text: '学生体测(次)', key: 'examCount' },
  { id: 5, num: 0, text: '学生体检(次)', key: 'testCount' }
]);

async function getData() {
  // 地图上方数据不受计划和区域切换影响
  const res = await getBaseScreen({ id: userInfo.areaId, level: userInfo.govLevel });
  titleList.forEach(item => {
    if (item.key === 'screenRate') {
      item.num = numToPercent(Number(res[item.key])) || 0;
    } else {
      item.num = Number(res[item.key]) || 0;
    }
  });
}

onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped>
.title-item {
  background-image: url('@/assets/image/bigScreen/title-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  .num {
    position: relative;
    font-size: 28px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 4px 8px #00153a, 0px 0px 1px #00d8ff;
  }
  .text {
    position: relative;
    top: 30px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #e3f7ff;
  }
}
</style>
