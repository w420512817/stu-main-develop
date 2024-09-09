<template>
  <n-grid :cols="3" :y-gap="16" :x-gap="16">
    <n-gi span="3">
      <div class="card">
        <div class="tit">基础信息数据</div>
        <div class="mt-20px flex justify-around">
          <div v-for="item in basicInfo" :key="item.key" class="flex items-center">
            <img :src="item.img" class="w-88px h-88px" />
            <div class="ml-5">
              <div class="text-30px text-[#386FFF] font-bold">
                <n-number-animation :from="0" :to="item.v" show-separator />
              </div>

              <div class="text-14px text-[#6E747D] mt-1">{{ item.tit }}</div>
            </div>
          </div>
        </div>
      </div>
    </n-gi>
    <n-gi>
      <left />
    </n-gi>
    <n-gi class="flex-col">
      <div class="card">
        <div class="tit">{{ orgType == 40 ? '机构' : '医院' }}概况</div>
        <lineC :data="overViewList" />
      </div>
      <midBottom />
    </n-gi>
    <n-gi>
      <rightTop />
      <div class="card mt-4">
        <div class="flex justify-between items-center mb-24px">
          <div class="tit flex-shrink-0">常用功能</div>
        </div>
        <rightMid />
      </div>
      <div class="card mt-4">
        <div class="flex justify-between items-center mb-15px">
          <div class="tit flex-shrink-0">待办事项</div>
        </div>
        <rightBottom />
      </div>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { reactive, ref, provide, onMounted } from 'vue';
import left from './components/left/left.vue';
import midBottom from './components/mid/midBottom.vue';
import lineC from './components/lineC.vue';
import rightTop from './components/right/rightTop.vue';
import rightMid from './components/right/rightMid.jsx';
import rightBottom from './components/right/rightBottom.vue';
import { baseInfo, overView, getScreeningTypeList } from '@/api/dashbord/hosptial';
import { useUserStore } from '@/store';

const {
  userInfo: { orgId, orgType }
} = useUserStore();
const screenTypeList = ref([]);
const overViewList = reactive([
  { name: '学生总数', v: 0, key: 'studentCount' },
  { name: '关联学校', v: 0, key: 'schoolCount' },
  { name: '筛查员人数', v: 0, key: 'scrennerCount' }
]);
const basicInfo = reactive([
  { img: getImg('basic-1.png'), v: 0, key: 'totalCount', tit: '累计筛查学生' },
  { img: getImg('basic-2.png'), v: 0, key: 'validCount', tit: '有效筛查学生' },
  { img: getImg('basic-3.png'), v: 0, key: 'completedPlanCount', tit: '计划完成总数' },
  { img: getImg('basic-4.png'), v: 0, key: 'completedTaskCount', tit: '任务完成总数' },
  { img: getImg('basic-5.png'), v: 0, key: 'deviceCount', tit: '设备总数' }
]);
provide('screenTypeList', screenTypeList);
provide('orgId', orgId);

async function getBaiscInfo() {
  let res = await baseInfo();
  basicInfo.forEach(item => {
    item.v = res[item.key];
  });
}

async function getOverView() {
  let res = await overView();
  overViewList.forEach(item => {
    item.v = res[item.key];
  });
}

async function getTypeList() {
  screenTypeList.value = await getScreeningTypeList();
}

function getImg(v) {
  return new URL(`../../../assets/image/dashbord/${v}`, import.meta.url).href;
}

onMounted(() => {
  getBaiscInfo();
  getOverView();
  getTypeList();
});
</script>

<style scoped lang="less">
:deep(.card) {
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(110, 116, 125, 0.1);
  border-radius: 7px;
  padding: 20px;
  & .tit {
    font-size: 16px;
    color: #222;
    font-weight: bold;
    line-height: 1;
    padding-left: 8px;
    position: relative;
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #386fff;
    }
  }
  & .tit2 {
    font-size: 14px;
    color: #222;
    font-weight: bold;
    position: relative;
    z-index: 2;
    &::before {
      content: ' ';
      width: 100%;
      height: 5px;
      background: linear-gradient(270deg, rgba(31, 108, 255, 0) 10%, #1f6cff 100%);
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: -1;
    }
  }
}
</style>
