<template>
  <component :is="curComp" />
</template>
<script setup>
// 分发端口的大屏
import { computed, defineAsyncComponent } from 'vue';
import { useUserStore } from '@/store';
import homeGov from './homeGov/index.vue';
import homeSchool from './homeSchool/index.vue';

const {
  userInfo: { orgType }
} = useUserStore();
// orgType 10-学校 20-医院 30-政府部门 40-社会筛查机构
const curComp = computed(() => {
  let com = homeSchool;
  switch (orgType) {
    case 10:
      com = homeSchool;
      break;
    case 20:
    case 40:
      com = defineAsyncComponent(() => import('./homeHos/index.vue'));
      break;
    case 30:
      com = homeGov;
      break;
  }
  return com;
});
</script>
