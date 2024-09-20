<template>
  <n-spin :show="loadingNum">
    <div class="dashbord">
      <div class="head-wrap relative">
        <div class="absolute mx-auto top-5 title text-38px">
          <n-gradient-text
            gradient="linear-gradient(180deg, #FFFFFF 0%, #E4FBFF 46%, #9BF0FF 77%, #6DE9FF 89%, #00D8FF 100%)"
          >
            {{ manageName }}学生健康平台
          </n-gradient-text>
        </div>
        <div class="head">
          <div class="head-left">
            <img src="@/assets/image/bigScreen/left-arrow.png" class="back-btn" @click="goBack" />
            <div v-auth="9414" :class="{ 'menu-item': true, actived: path === menuList[0].path }">综合展示</div>
            <div v-auth="9410" :class="{ 'menu-item': true, actived: path === menuList[1].path }" @click="menuClick(1)">
              视力筛查
            </div>
            <div v-auth="9455" :class="{ 'menu-item': true, actived: path === menuList[5].path }">脊柱筛查</div>
          </div>
          <div class="head-right">
            <div v-auth="9411" :class="{ 'menu-item': true, actived: path === menuList[2].path }">龋齿筛查</div>
            <div v-auth="9412" :class="{ 'menu-item': true, actived: path === menuList[3].path }">学生体检</div>
            <div v-auth="9413" :class="{ 'menu-item': true, actived: path === menuList[4].path }">学生体测</div>
          </div>
        </div>
      </div>
      <router-view />

      <div class="footer"></div>
    </div>
  </n-spin>
</template>

<script setup>
import { toRef, ref, provide, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import 'echarts-liquidfill';

const menuList = [
  { index: 0, path: '/bigScreen/synthesize' },
  { index: 1, path: '/bigScreen/vision' },
  { index: 2, path: '/bigScreen/cavity' },
  { index: 3, path: '/bigScreen/phyExam' },
  { index: 4, path: '/bigScreen/phyTest' },
  { index: 5, path: '/bigScreen/spine' }
];

const { userInfo, getAreaTree } = useUserStore();
const { push } = useRouter();

const loadingNum = ref(0);
const path = toRef(useRoute(), 'path');
const manageName = computed(() => {
  let stack = [] || [...getAreaTree];

  for (let i = 0; i < stack.length; i++) {
    const item = stack[i];
    if (item.regionId === userInfo.areaId) {
      return item.regionName;
    }

    if (item?.children?.length) {
      stack.push(...item.children);
    }
  }
  return '';
});

function menuClick(index) {
  push(menuList[index].path);
}
function goBack() {
  push('/dashboard/overview');
}

function loadingFn(num) {
  loadingNum.value += num;
}

provide('loadingFn', loadingFn);
</script>

<style lang="less" scoped>
.dashbord {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/image/bigScreen/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  position: relative;

  .head-wrap {
    height: 114px;
    position: relative;
  }

  .head {
    width: 100%;
    height: 147px;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-image: url('@/assets/image/bigScreen/bg-head.png');
    background-repeat: no-repeat;
    background-position: center top;
    // background-size: 100% 100%;

    .head-left {
      height: 100%;
      display: flex;
      overflow: hidden;
      align-items: center;

      .menu-item {
        width: 9vw;
        height: 3.9vw;
        line-height: 3.9vw;
        text-align: center;

        font-size: 1.04vw;
        font-family: YouSheBiaoTiHei;
        margin-top: -1.04vw;

        color: #e3f7ff;
        user-select: none;
        cursor: pointer;

        background-image: url('@/assets/image/bigScreen/menu-left.png');
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
      }

      .actived {
        background-image: url('@/assets/image/bigScreen/menu-left-actived.png');
        background-position: center 2px;
        background-size: 100%;
        background-repeat: no-repeat;
      }

      .back-menu {
        display: flex;
        align-items: center;

        & > img {
          width: 2.91vw;
          height: 2.91vw;
          margin-left: 1.5vw;
        }
      }
    }
    .head-right {
      height: 100%;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: flex-end;

      .menu-item {
        width: 9vw;
        height: 3.9vw;
        line-height: 3.9vw;
        text-align: center;

        font-size: 1.04vw;
        font-family: YouSheBiaoTiHei;
        margin-top: -1.04vw;

        color: #e3f7ff;
        text-shadow: 0px 2px 8px rgba(0, 9, 25, 0.66);
        user-select: none;
        cursor: pointer;

        background-image: url('@/assets/image/bigScreen/menu-right.png');
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
      }

      .actived {
        background-image: url('@/assets/image/bigScreen/menu-right-actived.png');
        background-position: center 2px;
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }

  .footer {
    width: 100%;
    height: 1.6vw;
    position: fixed;
    left: 0;
    bottom: 0;

    background-image: url('@/assets/image/bigScreen/bg-foot.png');
    background-position: center;
    background-repeat: no-repeat;
  }
}
.title {
  left: 50%;
  transform: translateX(-50%) skewX(-6deg);
  z-index: 9;
  letter-spacing: 4px;
}

.back-btn {
  cursor: pointer;
  position: relative;
  top: -1vh;
  left: 1vh;
}
:deep(.n-gradient-text) {
  font-weight: 900;
}
</style>
