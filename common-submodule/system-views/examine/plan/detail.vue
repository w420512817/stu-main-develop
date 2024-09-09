<template>
  <component :is="curComp" :key="resetKey" />
</template>

<script setup>
import { computed, defineAsyncComponent, onActivated, ref } from 'vue';
import { useUserStore } from '@/store';

const { userOrgType } = useUserStore();
// 详情页keeplive 组件被缓存 接口未请求 加key 刷新
const resetKey = ref(1);
const curComp = computed(() => {
  let com = null;
  switch (userOrgType) {
    case 'SCHOOL':
    case 'HOSPITAL':
    case 'SOCIAL':
      com = defineAsyncComponent(() => import('./rolePages/detailSchool.vue'));
      break;
    case 'GOVERMENT':
      com = defineAsyncComponent(() => import('./rolePages/detailGov.vue'));
      break;
  }
  return com;
});

defineOptions({ name: 'PlanDetail' });
onActivated(() => {
  resetKey.value += 1;
});
</script>
<style scoped></style>
