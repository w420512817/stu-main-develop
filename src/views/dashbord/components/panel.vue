<template>
  <div
    class="box h-210px flex items-center justify-center text-24px rd-15px"
    :style="{ color, backgroundImage: `url(${bgImage})` }"
    @click="handleClick"
  >
    <span
      class="title"
      :style="{ background: `linear-gradient(to right, ${lineColor},rgba(255, 126, 32, 0))  no-repeat left bottom` }"
    >
      {{ title }}
    </span>
  </div>
</template>

<script setup>
import { string } from 'vue-types';

defineProps({
  title: string().def(''),
  color: string().def(''),
  bgImage: string().def(''),
  lineColor: string().def('')
});

const emit = defineEmits(['onClick']);

const handleClick = () => {
  emit('onClick');
};
</script>

<style lang="less" scoped>
.box {
  font-family: YouSheBiaoTiHei;
  background-repeat: no-repeat;
  background-size: 100% 101%;
  cursor: pointer;
  transition: all 0.4s;
}

.title {
  background-size: 100% 10px !important;
}

.box:hover {
  // background-size: 100% 10px !important;
  box-shadow: 5px 3px 3px #eee;
}
</style>
