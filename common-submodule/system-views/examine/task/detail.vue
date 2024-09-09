<template>
  <component :is="curComp" />
</template>

<script setup>
import { computed } from 'vue';
import detailGov from './rolePages/detailGov.vue';
import detailSchool from './rolePages/detailSchool.vue';

import { useUserStore } from '@/store';

const { userOrgType } = useUserStore();

console.log(userOrgType, 'userOrgType');
// orgType 10-学校 20-医院 30-政府部门 40-社会筛查机构
const curComp = computed(() => {
  let com = detailGov;
  switch (userOrgType) {
    case 'SCHOOL':
    case 'HOSPITAL':
    case 'SOCIAL':
      com = detailSchool;
      break;
    case 'GOVERMENT':
      com = detailGov;
      break;
  }
  return com;
});

defineOptions({ name: 'PlanList' });
</script>
<style scoped></style>
