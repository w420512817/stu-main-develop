<template>
  <div v-for="item in dataList" :key="item.name" class="item">
    <div class="text-14px text-[#222]">{{ item.name }}</div>
    <div class="flex mt-2 h-5">
      <div class="rounded-3 bg-[#F7F9FE] p-1 flex-1">
        <div class="bar-bg" :style="`--wid: ${item.rate * 100}%;`"></div>
      </div>
      <span ref="label" class="text-4 text-right text-[#333] leading-tight font-bold ml-3">
        <n-number-animation show-separator :from="0" :to="item.v" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { array, string } from 'vue-types';

let props = defineProps({
  data: array().def([]),
  numKey: string().def('v')
});

const label = ref();
let dataList = ref([]);

function setList() {
  let numFormat = new Intl.NumberFormat('en-US');
  let totalV = dataList.value.reduce((perv, item) => {
    return ~~item[props.numKey] + perv;
  }, 0);
  dataList.value.forEach(item => {
    item.rate = item[props.numKey] / totalV || 0;
    item.numFormat = numFormat.format(item[props.numKey]);
  });

  setWidth();
}

function setWidth() {
  if (!label.value) return;
  // 数字动画 拿不到dom宽度 canvas measureTex方法拿宽度
  let canEle = document.createElement('canvas');
  let ctx = canEle.getContext('2d');
  ctx.font = '16px bold';
  let wids = dataList.value.map(item => {
    return ctx.measureText(item.numFormat)?.width;
  });
  let maxW = Math.max(...wids);
  label.value.forEach(ele => {
    ele.style.width = maxW + 'px';
  });
}

watch(
  () => props.data,
  () => {
    dataList.value = JSON.parse(JSON.stringify(props.data));
    setList();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="less" scoped>
.item {
  margin-top: 16px;

  .bar-bg {
    height: 12px;
    background: linear-gradient(270deg, #386fff 0%, rgba(56, 111, 255, 0) 100%);
    border-radius: 8px;
    position: relative;
    min-width: 12px;
    width: var(--wid);
    animation: widAni 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    &::after {
      content: ' ';
      position: absolute;
      right: 0;
      width: 12px;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: #3577f6;
    }
  }
}

@keyframes widAni {
  0% {
    width: 0;
  }
  100% {
    width: var(--wid);
  }
}
</style>
