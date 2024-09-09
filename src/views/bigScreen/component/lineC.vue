<template>
  <div class="flex flex-col gap-y-1vh">
    <div v-for="(item, index) in data" :key="index" class="flex items-center">
      <span class="label">{{ item.n }}</span>
      <div class="flex-1">
        <div class="flex items-center h-full">
          <div class="bar" :class="{ bar2: props.bar2 }" :style="`width: ${item.p}%;--w: ${item.p}%`"></div>
          <span class="num">{{ item.v }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { array, bool } from 'vue-types';

let props = defineProps({
  data: array().def([]),
  bar2: bool().def(false)
});

let data = ref([]);

function setRate() {
  data.value = JSON.parse(JSON.stringify(props.data));
  let t = data.value.reduce((pre, item) => {
    return pre + item.v;
  }, 0);
  data.value.forEach(item => {
    item.p = (item.v / t) * 100;
  });
}
setRate();
watch(
  () => props.data,
  // props.data,
  () => {
    setRate();
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
.label {
  font-size: 0.8vw;
  font-weight: 500;
  color: #b7d5f0;
  line-height: 24px;
  width: 20%;
}

.bar {
  background: linear-gradient(90deg, rgba(67, 85, 164, 0) 0%, #f3c549 100%);
  height: 0.8vh;
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
    height: 0.8vh;
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
