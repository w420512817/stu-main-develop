<template>
  <component :is="com" />
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import { useUserStore } from '@/store';
import { GovLevelEnum } from '@common/enum/pageEnum.js';

const userStore = useUserStore();
const com = computed(() => {
  let res;
  let level = userStore.userInfo.govLevel;
  if (GovLevelEnum[level] == 'REGION') {
    res = defineAsyncComponent(() => import('./rolePage/areaPage.vue'));
  } else {
    res = defineAsyncComponent(() => import('./rolePage/regionPage.vue'));
  }
  return res;
});
</script>

<style lang="less" scoped></style>
