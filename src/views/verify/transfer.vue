<template>
  <component :is="curComp" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';

import { useUserStore } from '@/store';

const { userOrgType } = useUserStore();

// orgType 10-学校 20-医院 30-政府部门 40-社会筛查机构
const curComp = computed(() => {
  let com = null;
  switch (userOrgType) {
    case 'SCHOOL':
    case 'HOSPITAL':
    case 'SOCIAL':
      com = defineAsyncComponent(() => import('./school/transferSchool.vue'));
      break;
    case 'GOVERMENT':
      com = defineAsyncComponent(() => import('./gov/transferGov.vue'));
      break;
  }
  return com;
});

defineOptions({ name: 'Transfer' });
</script>
<style scoped></style>
