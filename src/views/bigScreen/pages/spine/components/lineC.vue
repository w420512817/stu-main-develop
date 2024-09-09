<template>
  <div class="flex flex-col gap-y-0.5vh line">
    <div v-for="(item, index) in data" :key="index" class="flex items-centet">
      <div class="label">
        <div class="w-80%" :class="{ tit: item.tit }">{{ item.n }}</div>
      </div>
      <div class="flex-1 flex-center">
        <div class="flex items-center wh-full bar_bg">
          <div class="bar" :class="{ bar2: props.bar2 }" :style="`width: ${item.p}%;--w: ${item.p}%`">
            <span
              v-if="props.showPercent"
              class="text-white text-0.7vw absolute right-10% top-50% -translate-y-2/4 tr leading-none text-right"
              :class="{ 'translate-x-130%': item.p < 25 }"
            >
              {{ numToPercent(item.p / 100) }}%
            </span>
          </div>
        </div>
        <span ref="label" class="num whitespace-nowrap flex-shrink-0 text-right">
          <span>{{ item.v }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { array, bool } from 'vue-types';
import { numToPercent } from '@common/utils/common';

let props = defineProps({
  data: array().def([]),
  bar2: bool().def(false),
  showPercent: bool().def(false)
});

let data = ref([]);
let label = ref();

function setRate() {
  data.value = JSON.parse(JSON.stringify(props.data));
  let t = data.value.reduce((pre, item) => {
    return pre + item.v;
  }, 0);
  data.value.forEach(item => {
    item.p = item.percent * 100 || (item.v / t) * 100 || 0;
  });
  setWidth();
}
setRate();

function setWidth() {
  if (!label.value) return;
  // 数字动画 拿不到dom宽度 canvas measureTex方法拿宽度
  let canEle = document.createElement('canvas');
  let ctx = canEle.getContext('2d');
  ctx.font = '16px bold';
  let wids = data.value.map(item => {
    return ctx.measureText(item.v)?.width;
  });
  let maxW = Math.max(...wids);
  label.value.forEach(ele => {
    ele.style.width = maxW + 'px';
  });
}

watch(
  props.data,
  () => {
    setRate();
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
@bar-height: 1.2vh;
.tit::after {
  content: none !important;
}
.bar_bg {
  height: @bar-height;
  background: linear-gradient(90deg, rgba(28, 59, 196, 0) 0%, rgba(23, 43, 104, 0.83) 100%);
}
.label {
  font-size: 0.8vw;
  font-weight: 500;
  color: #b7d5f0;
  width: 42%;
}
.line {
  position: relative;
  &::after {
    content: ' ';
    position: absolute;
    height: 100%;
    width: 0.05vw;
    border: 0.05vw solid;
    border-image: radial-gradient(circle, rgba(55, 96, 130, 1), rgba(4, 14, 48, 0)) 2 2;
    left: 40%;
  }
}
.bar {
  background: linear-gradient(90deg, rgba(67, 85, 164, 0) 0%, #f3c549 100%);
  height: @bar-height;
  position: relative;
  animation: wAni 1s ease-in-out;
  &.bar2 {
    background: linear-gradient(90deg, rgba(67, 85, 164, 0) 0%, #29f0fe 100%);
  }
  &::after {
    content: ' ';
    position: absolute;
    right: 0;
    width: 0.1vw;
    height: @bar-height;
    background: #ffffff;
    box-shadow: 0 0 0.4vh 0.1vw #ffffff;
  }
}
.num {
  font-size: 0.9vw;
  font-weight: bold;
  color: #ffffff;
  line-height: 21px;
  text-shadow: 0px 0px 7px #5588ff;
  margin-left: 0.4vw;
}

@keyframes wAni {
  0% {
    width: 0;
  }
  100% {
    width: var(--w);
  }
}
</style>
