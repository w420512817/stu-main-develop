<template>
  <div class="indexPage pageCon">
    <div class="left">
      <left #="{ data }">
        <div class="left-top boxStyle">
          <leftTop :data="data" />
        </div>
        <div class="left-mid boxStyle">
          <leftMid :data="data" />
        </div>
      </left>

      <div class="left-bottom boxStyle">
        <leftBot />
      </div>
    </div>
    <div class="mid">
      <div class="mid-map relative">
        <midTop />
      </div>
      <div class="mid-bottom boxStyle largeBoxStyle">
        <midBottom />
      </div>
    </div>
    <div class="right">
      <div class="right-top boxStyle">
        <rightTop />
      </div>
      <div class="right-mid boxStyle">
        <rightMid />
      </div>
      <div class="right-mid2 boxStyle">
        <rightMid2 />
      </div>
      <div class="right-bottom boxStyle">
        <rightBottom />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, provide } from 'vue';
import left from './components/left.vue';
import leftTop from './components/left-top.vue';
import leftMid from './components/left-mid.vue';
import leftBot from './components/left-bot.vue';
import rightTop from './components/right-top.vue';
import rightMid from './components/right-mid.vue';
import rightMid2 from './components/right-mid2.vue';
import rightBottom from './components/right-bottom.vue';
import midTop from './components/mid-top.vue';
import midBottom from './components/mid-bottom.vue';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo } = userStore;

const params = reactive({
  planId: null,
  id: userInfo.areaId,
  level: userInfo.govLevel
});

function paramsChange(key, value) {
  params[key] = value;
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
      height: calc(30%);
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
      height: calc(40% - 10px);
      margin-top: 10px;
      display: flex;
      flex-direction: column;
    }
  }
  .mid {
    height: 100%;
    width: 40vw;
    padding: 0 1.2vw 1.9vw;

    .mid-map {
      width: 100%;
      height: calc(65% - 10px);
    }
    .mid-bottom {
      width: 100%;
      height: 35%;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
  }
  .right {
    height: 100%;
    width: 30vw;
    padding: 0 1.67vw 1.9vw 0;

    .right-top {
      height: 28%;
      display: flex;
      flex-direction: column;
    }
    .right-mid {
      height: 20%;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
    .right-mid2 {
      height: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 10px;
    }

    .right-bottom {
      height: calc(20% - 10px);
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
