<template>
  <n-space vertical>
    <n-card><p class="text-center text-4.5 font-bold">教师档案</p></n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">基础信息</p>
      </template>
      <n-form require-mark-placement="left" label-width="100">
        <n-grid cols="4" :x-gap="50">
          <n-form-item-gi label="姓名"> {{ formValue.name }} </n-form-item-gi>
          <n-form-item-gi label="出生日期"> {{ formValue.birth }} </n-form-item-gi>
          <n-form-item-gi label="性别"> {{ formValue.sexSt }} </n-form-item-gi>
          <n-form-item-gi label="区域"> {{ formValue.belongAreaSt }} </n-form-item-gi>
          <n-form-item-gi label="证件类型">
            {{ formValue.belongArea == 2 ? '/' : formValue.idcard ? '居民身份证' : '无' }}
          </n-form-item-gi>
          <n-form-item-gi label="证件号">{{ formValue.idcard || '/' }} </n-form-item-gi>
          <n-form-item-gi label="教师编号"> {{ formValue.serialNumber }} </n-form-item-gi>
          <n-form-item-gi label="籍贯">{{ formValue.nativePlace || '/' }} </n-form-item-gi>
          <n-form-item-gi label="民族">{{ formValue.nationality || '/' }} </n-form-item-gi>
          <n-form-item-gi label="家庭住址"> {{ formValue.familyAddress || '/' }} </n-form-item-gi>
          <n-form-item-gi label="联系方式"> {{ formValue.tel || '/' }} </n-form-item-gi>
          <n-form-item-gi label="学校名称"> {{ formValue.schoolName || '/' }} </n-form-item-gi>
          <n-form-item-gi label="教师职位">{{ formValue.positionSt || '/' }} </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
  </n-space>
</template>
<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getTeacherDetail } from '@/api/information/teacher';

const { query } = useRoute();
const formValue = reactive({ name: '' });

onBeforeMount(async () => {
  try {
    const detail = await getTeacherDetail({ id: query.id });
    Object.assign(formValue, detail);
  } catch (error) {
    console.log(error);
  }
});

defineOptions({
  name: 'TeacherInformationDetail'
});
</script>
