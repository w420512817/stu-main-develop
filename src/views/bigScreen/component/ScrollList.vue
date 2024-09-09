<template>
  <div class="wh-full">
    <div class="w-full h-36px flex-y-center justify-around title-head whitespace-nowrap">
      <span v-for="i in scrollColumns" :key="i.key" class="title-text" :style="{ width: i.width }">
        {{ i.title }}
      </span>
    </div>
    <Vue3SeamlessScroll
      :list="scrollList"
      :hover="scrollOptions.hover"
      :limit-scroll-num="scrollOptions.limitScrollNum"
      :single-height="scrollOptions.singleHeight"
      :single-wait-time="scrollOptions.singleWaitTime"
      class="overflow-hidden scroll-wrap"
    >
      <div
        v-for="(it, ix) in scrollList"
        :key="ix"
        :class="['h-36px', 'flex-y-center', 'justify-around', 'content-row', { 'title-text-bg': (ix + 1) % 2 === 0 }]"
      >
        <span
          v-for="(itm, idx) in scrollColumns"
          :key="idx"
          class="content-text"
          :style="{ width: itm.width }"
          :title="it[itm.key]"
        >
          {{ it[itm.key] }}
        </span>
      </div>
    </Vue3SeamlessScroll>
  </div>
</template>

<script setup>
import { array } from 'vue-types';
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

const scrollOptions = {
  hover: false,
  limitScrollNum: 5,
  singleHeight: 36,
  singleWaitTime: 2000
};

defineProps({
  scrollColumns: array().def([]),
  scrollList: array().def([])
});
</script>

<style lang="less" scoped>
.title-head {
  background: rgba(14, 62, 110, 0.65);
  border-radius: 8px 8px 0px 0px;
  span {
    box-sizing: border-box;
    padding-left: 10px;
  }

  & > span:nth-child(1) {
    padding-left: 20px;
  }

  & > span:last-child {
    padding-left: 20px;
  }
}

.content-row {
  background: rgba(41, 122, 201, 0.03);

  span {
    box-sizing: border-box;
    padding-left: 10px;
  }

  & > span:nth-child(1) {
    padding-left: 20px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & > span:last-child {
    padding-left: 20px;
  }
}
.title-text {
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: 500;
  color: #e3f7ff;
}
.content-text {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #adc3d2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll-wrap {
  height: calc(100% - 1vw);
}
.title-text-bg {
  background: rgba(41, 122, 201, 0.09);
}
</style>
