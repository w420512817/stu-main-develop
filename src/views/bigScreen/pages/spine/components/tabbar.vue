<template>
  <div class="flex flex-col">
    <div class="flex">
      <div
        v-for="item in data"
        :key="item.id"
        class="text-[#579AB2] flex w-7.8vw cursor-pointer hover:text-[#579AB2] justify-center"
        :class="selectIndex === item.id && '!text-[#fff]'"
        @click="handleChange(item.id)"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="flex">
      <img :src="selectIndex === 1 ? leftBorder : rightBorder" alt="" class="w-14.5vw h-0.8vw" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { array } from 'vue-types';

import leftBorder from '@/assets/image/bigScreen/left-border.png';
import rightBorder from '@/assets/image/bigScreen/right-border.png';

defineProps({
  data: array().def({})
});

const emit = defineEmits(['tabChange']);
let selectIndex = ref(1);

const handleChange = id => {
  selectIndex.value = id;
  emit('tabChange', id);
};
</script>

<style lang="scss" scoped></style>
