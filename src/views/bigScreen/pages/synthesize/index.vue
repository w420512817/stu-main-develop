<template>
  <div class="indexPage pageCon">
    <div class="left">
      <div class="left-top boxStyle">
        <LeftTop />
      </div>
      <div class="left-bottom boxStyle">
        <LeftBot />
      </div>
    </div>
    <div class="mid">
      <div class="mid-title">
        <MidTop />
      </div>
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
      <div class="right-bottom boxStyle">
        <RightBot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, provide } from 'vue';

import LeftTop from './components/left-top.vue';
import LeftBot from './components/left-bot.vue';
import RightTop from './components/right-top.vue';
import RightBot from './components/right-bot.vue';
import MidTop from './components/mid-top.vue';
import MidMap from './components/mid-map.vue';
import MidBot from './components/mid-bot.vue';

import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo } = userStore;

const params = reactive({
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
      height: calc(50% - 10px);
      display: flex;
      flex-direction: column;
    }
    .left-bottom {
      height: calc(50% - 10px);
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
  }
  .mid {
    height: 100%;
    width: 40vw;
    padding: 0 1.67vw 1.9vw 1.67vw;

    .mid-title {
      width: 100%;
      height: 15%;
    }

    .mid-map {
      width: 100%;
      height: calc(55% - 20px);
    }
    .mid-bottom {
      width: 100%;
      height: 30%;
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
      height: calc(50% - 10px);
      display: flex;
      flex-direction: column;
    }
    .right-bottom {
      height: calc(50% - 10px);
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
