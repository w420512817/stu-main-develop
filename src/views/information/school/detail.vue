<template>
  <n-space vertical class="w-full">
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <p class="font-bold">基础信息</p>
      </template>
      <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
        <n-grid cols="3" x-gap="100" class="mt-5">
          <n-form-item-gi label="学校名称:">
            {{ formValue.name || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="学校属性:">
            {{ formValue.orgPropertySt }}
          </n-form-item-gi>
          <n-form-item-gi label="统一社会信用代码:">
            {{ formValue.socialCreditCode }}
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:">
            {{ formValue.areaName }}
          </n-form-item-gi>
          <n-form-item-gi label="详细地址:">
            {{ formValue.address }}
          </n-form-item-gi>
          <n-form-item-gi label="机构坐标:"> {{ formValue.lng }}, {{ formValue.lat }} </n-form-item-gi>
          <n-form-item-gi label="学校类型:">
            {{ formValue.schoolTypeSt }}
          </n-form-item-gi>
          <n-form-item-gi label="学段:">
            {{ formValue.schoolTypesSt }}
          </n-form-item-gi>
          <n-form-item-gi label="学制:">
            {{ formValue.educationalSystemSt }}
          </n-form-item-gi>
          <n-form-item-gi label="城乡属性:">
            {{ formValue.schoolUrbanRuralAttributeSt }}
          </n-form-item-gi>
          <n-form-item-gi label="学校级别:">
            {{ formValue.schoolLevel }}
          </n-form-item-gi>
          <n-form-item-gi label="学区:" :show-require-mark="false">
            {{ formValue.schoolDistrict || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="举办者类型:">
            {{ formValue.officeCategorySt }}
          </n-form-item-gi>
          <n-form-item-gi label="联系人:" :show-require-mark="false">
            {{ formValue.organizer || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="联系方式:" :show-require-mark="false">
            {{ formValue.tel || '/' }}
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <p class="font-bold">卫建委信息</p>
      </template>
      <n-form label-placement="top">
        <n-grid cols="3" x-gap="100" class="mt-5">
          <n-form-item-gi label="省编号:">
            {{ formValue.provinceCode || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="地市编号:">
            {{ formValue.cityCode || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="区县编号:">
            {{ formValue.regionCode || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="片区编号:">
            {{ formValue.areaCodeSt || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="街道名称:">
            {{ formValue.streetName || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="街道编号:">
            {{ formValue.streetCode || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="监测点编号:">
            {{ formValue.monitorCode || '/' }}
          </n-form-item-gi>
          <n-form-item-gi label="学校编号:">
            {{ formValue.orgCode || '/' }}
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
  </n-space>
</template>
<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getSchoolDetail } from '@/api/information/school';
const { query } = useRoute();
const formValue = reactive({ name: '' });
defineOptions({
  name: 'SchoolInformationDetail'
});
onBeforeMount(async () => {
  const data = await getSchoolDetail({ id: query.id });
  data && Object.assign(formValue, data);
});
</script>
