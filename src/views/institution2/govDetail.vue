<template>
  <n-space vertical class="w-full">
    <n-card class="mb-3">
      <pagetitle
        :title="formValue.name"
        :status-st="formValue.statusSt"
        back-path="/institution/government-list"
        :edit-path="`/institution/gov-modify?id=${query.id}&orgProperty=8`"
      />
    </n-card>
    <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
      <n-card class="shadow-sm mb-3" content-style="padding-left: 0; padding-right: 0">
        <n-tabs type="line" pane-style="padding: 24px" :tabs-padding="24">
          <n-tab-pane tab="基础信息" :name="1">
            <n-grid cols="3" x-gap="100" class="mt-5">
              <n-form-item-gi label="政府机构名称:">
                {{ formValue.name }}
              </n-form-item-gi>
              <n-form-item-gi label="政府机构类型:">
                {{ formValue.orgAttributeSt }}
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
              <n-form-item-gi label="机构坐标:"> {{ formValue.lng }} - {{ formValue.lat }} </n-form-item-gi>
              <n-form-item-gi label="管理区域:">
                {{ formValue.manageArea }}
              </n-form-item-gi>
              <n-form-item-gi v-if="formValue.showManageStuArea" label="管理学区:" :show-require-mark="false">
                {{ formValue.manageEduDistrict || '/' }}
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
                {{ formValue.isDataMaskingSt }}
              </n-form-item-gi>
              <n-form-item-gi label="创建方式:" :show-require-mark="false">
                {{ formValue.createWay || '/' }}
              </n-form-item-gi>
              <n-form-item-gi label="创建时间:" :show-require-mark="false">
                {{ formValue.createTime || '/' }}
              </n-form-item-gi>
              <n-form-item-gi label="创建人:" :show-require-mark="false">
                {{ formValue.creator || '/' }}
              </n-form-item-gi>
            </n-grid>
          </n-tab-pane>
        </n-tabs>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">应用信息</p>
        </template>
        <n-grid cols="3" x-gap="100" class="mt-5">
          <n-form-item-gi v-for="(item, index) in formValue.appList" :key="index" label="应用组名称:">
            {{ item.appGroupName }}
          </n-form-item-gi>
        </n-grid>
      </n-card>
    </n-form>
  </n-space>
</template>

<script setup>
import { reactive, provide, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { detailGovernment } from '@/api/institution2';

import pagetitle from './components/title.vue';

const { query } = useRoute();

provide('query', query);

const formValue = reactive({});

onBeforeMount(async () => {
  const { id, orgProperty } = query;
  const data = await detailGovernment({ id, orgProperty });
  data && Object.assign(formValue, data);
});

defineOptions({ name: 'GovernmentDetail' });
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
