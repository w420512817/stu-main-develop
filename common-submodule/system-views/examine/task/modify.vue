<template>
  <component :is="curComp" />
</template>

<script setup>
import { computed } from 'vue';
import modifyHospital from './rolePages/modifyHospital.vue';
import modifySchool from './rolePages/modifySchool.vue';

import { useUserStore } from '@/store';

const { userOrgType } = useUserStore();

console.log(userOrgType, 'userOrgType');
// orgType 10-学校 20-医院 30-政府部门 40-社会筛查机构
const curComp = computed(() => {
  let com = modifyHospital;
  switch (userOrgType) {
    case 'SCHOOL':
      com = modifySchool;
      break;
    case 'SOCIAL':
    case 'HOSPITAL':
      com = modifyHospital;
      break;
  }
  return com;
});

defineOptions({ name: 'PlanList' });
</script>
<style scoped></style>
