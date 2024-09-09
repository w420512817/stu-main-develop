<template>
  <n-space vertical class="w-full">
    <n-card>
      <pageTitle :title="formValue.name" :back-path="backPath" />
    </n-card>
    <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
      <n-card
        class="shadow-sm mb-3"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <template #header>
          <p class="font-bold">基础信息</p>
        </template>
        <n-grid cols="3" x-gap="100" class="mt-5">
          <n-form-item-gi label="学校名称:">
            {{ formValue.name }}
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
          <n-form-item-gi label="机构坐标:"> {{ formValue.lng }} {{ formValue.lat }} </n-form-item-gi>
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
        </n-grid></n-card
      >
    </n-form>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">卫建委信息</p>
      </template>
      <n-grid cols="3" x-gap="100" class="mt-5">
        <n-form-item-gi label="省编号:" :show-require-mark="false">
          {{ formValue.provinceCode || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="地市编号:" :show-require-mark="false">
          {{ formValue.cityCode || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="区县编号:" :show-require-mark="false">
          {{ formValue.regionCode || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="片区编号:" :show-require-mark="false">
          {{ formValue.areaCodeSt || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="街道名称:" :show-require-mark="false">
          {{ formValue.streetName || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="街道编号:" :show-require-mark="false">
          {{ formValue.streetCode || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="监测点编号:" :show-require-mark="false">
          {{ formValue.monitorCode || '/' }}
        </n-form-item-gi>
        <n-form-item-gi label="学校编号:" :show-require-mark="false">
          {{ formValue.orgCode || '/' }}
        </n-form-item-gi>
      </n-grid>
    </n-card>
  </n-space>
</template>

<script setup>
import { reactive, onBeforeMount, provide, computed } from 'vue';
import { useRoute } from 'vue-router';

import pageTitle from '../components/title.vue';

// api
import { getSchoolDetail } from '@/api/institution/school';

const { query } = useRoute();

provide('query', query);

const formValue = reactive({});

const backPath = computed(() => {
  const type = query.type || 'school'; // 默认返回学校管理
  const path = `/institution/${type}-list?regionId=${query.regionId}&regionName=${query.regionName}`;
  return path;
});

onBeforeMount(async () => {
  const { id, orgProperty } = query;
  if (!id) return;
  const params = { id, orgProperty };
  const data = await getSchoolDetail(params);
  data && Object.assign(formValue, data);
});

defineOptions({ name: 'SchoolDetail' });
</script>

<style scoped lang="less"></style>
