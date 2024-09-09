<template>
  <n-space vertical class="w-full">
    <n-card class="mb-3">
      <pagetitle
        :title="formValue.name"
        :status-st="formValue.statusSt"
        back-path="/institution/region"
        :edit-path="`/institution/school-modify?id=${query.id}&orgProperty=${query.orgProperty}`"
      />
    </n-card>
    <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
      <n-card class="shadow-sm mb-3" content-style="padding-left: 0; padding-right: 0">
        <n-tabs type="line" pane-style="padding: 24px" :tabs-padding="24">
          <n-tab-pane tab="基础信息" :name="1">
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
            </n-grid>
          </n-tab-pane>
          <n-tab-pane tab="卫健委信息" :name="2">
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
          </n-tab-pane>
          <n-tab-pane tab="账户信息" :name="3">
            <n-grid cols="3" x-gap="100" class="mt-5">
              <!-- <n-form-item-gi label="机构权限组:">
                {{ formValue.roleName }}
              </n-form-item-gi> -->
              <n-form-item-gi label="账号数量:">
                {{ formValue.accountNumber }}
              </n-form-item-gi>
              <n-form-item-gi label="机构有效期:">
                {{ formValue.startDateSt }} ~ {{ formValue.endDateSt }}
              </n-form-item-gi>
              <n-form-item-gi label="脱敏设置:">
                {{ formValue.isDataMasking }}
              </n-form-item-gi>
              <n-form-item-gi label="创建方式:" :show-require-mark="false">
                {{ formValue.createWay }}
              </n-form-item-gi>
              <n-form-item-gi label="创建时间:" :show-require-mark="false">
                {{ formValue.createTime }}
              </n-form-item-gi>
              <n-form-item-gi label="创建人:" :show-require-mark="false">
                {{ formValue.creator }}
              </n-form-item-gi>
            </n-grid>
          </n-tab-pane>
        </n-tabs>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">应用信息</p>
        </template>
        <n-grid v-for="(item, index) in formValue.appList" :key="index" cols="3" x-gap="100" class="mt-5">
          <n-form-item-gi label="应用组名称:">
            {{ item.appGroupName }}
          </n-form-item-gi>
        </n-grid>
      </n-card>
    </n-form>
    <n-card
      v-if="query.orgProperty == 3"
      class="shadow-sm mb-3"
      header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;"
    >
      <template #header>
        <p class="font-bold">下级学校管理</p>
      </template>
      <subschool />
    </n-card>
  </n-space>
</template>

<script setup>
import { reactive, onBeforeMount, provide } from 'vue';
import { useRoute } from 'vue-router';

import subschool from './components/subschool.vue';
import pagetitle from './components/title.vue';
// api
import { getSchoolDetail } from '@/api/institution2';

const { query } = useRoute();

provide('query', query);

const formValue = reactive({});

onBeforeMount(async () => {
  if (query.id) {
    const { id, orgProperty } = query;
    const params = { id, orgProperty };
    const data = await getSchoolDetail(params);
    data && Object.assign(formValue, data, { switch: !!data.isDataMasking });
  }
});

defineOptions({ name: 'SchoolDetail' });
</script>

<style scoped lang="less">
.bolder-form {
  .n-form-item-label {
    color: #5a5c61;
  }
  .n-form-item-blank {
    color: #373737;
    text-indent: 12px;
  }
}
</style>
