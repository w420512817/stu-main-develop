<template>
  <div class="indexPage pageCon">
    <div class="left">
      <div class="left-top boxStyle">
        <LeftTop />
      </div>
      <div class="left-mid boxStyle">
        <LeftMid />
      </div>
      <div class="left-bottom boxStyle">
        <LeftBot />
      </div>
    </div>
    <div class="mid">
      <div class="mid-map">
        <MidMap />
      </div>
      <div class="mid-bottom boxStyle largeBoxStyle">
        <MidBot />
      </div>
    </div>
    <div class="right">
      <div class="right-top boxStyle">
        <RightTop />
      </div>
      <div class="right-mid boxStyle">
        <RightMid />
      </div>
      <div class="right-bottom boxStyle">
        <RightBot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, provide } from 'vue';

import LeftTop from './components/left-top.vue';
import LeftMid from './components/left-mid.vue';
import LeftBot from './components/left-bot.vue';
import RightTop from './components/right-top.vue';
import RightMid from './components/right-mid.vue';
import RightBot from './components/right-bot.vue';
import MidBot from './components/mid-bot.vue';
import MidMap from './components/mid-map.vue';

import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo } = userStore;

const params = reactive({
  planId: '',
  level: userInfo.govLevel,
  id: userInfo.areaId
});

function paramsChange(key, value) {
  params[key] = value;
  // console.log(`${key}:${value}发生变化，需要重新请求页面`);
}

provide('params', params);
provide('paramsChange', paramsChange);
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/common.less';
.indexPage {
  position: relative;
  z-index: 2;
  .sub-title {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #fff;
    span {
      font-size: 14px;
      &:first-child {
        margin-right: 20px;
      }
    }
  }
  .left {
    height: 100%;
    width: 30vw;
    padding: 0 0 1.9vw 1.67vw;

    .left-top {
      height: calc(40% - 10px);
      display: flex;
      flex-direction: column;
    }
    .left-mid {
      height: calc(30% - 10px);
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
    .left-bottom {
      height: calc(30%);
      margin-top: 10px;
      display: flex;
      flex-direction: column;
    }
  }
  .mid {
    height: 100%;
    width: 40vw;
    padding: 0 1.67vw 1.9vw 1.67vw;

    .mid-map {
      width: 100%;
      height: calc(65% - 10px);
    }
    .mid-bottom {
      width: 100%;
      height: calc(35% - 10px);
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }
  }
  .right {
    height: 100%;
    width: 30vw;
    padding: 0 1.67vw 1.9vw 0;

    .right-top {
      height: calc(33% - 10px);
      display: flex;
      flex-direction: column;
    }
    .right-mid {
      height: calc(33% - 10px);
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
    .right-bottom {
      height: calc(34%);
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
  }
}
</style>
