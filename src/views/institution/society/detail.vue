<template>
  <n-space vertical class="w-full">
    <n-card>
      <pageTitle
        :title="formValue.name"
        :back-path="`/institution/society-list?regionId=${query.regionId}&regionName=${query.regionName}`"
      />
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
          <n-form-item-gi label="社会机构名称:">
            {{ formValue.name }}
          </n-form-item-gi>
          <n-form-item-gi label="社会机构属性:">
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
          <n-form-item-gi label="机构坐标:"> {{ formValue.lng }} - {{ formValue.lat }} </n-form-item-gi>
        </n-grid>
      </n-card>
    </n-form>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">查看关联学校</p>
      </template>
      <school type="society" />
    </n-card>
  </n-space>
</template>

<script setup>
import { provide, reactive, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

// api
import { getDetail } from '@/api/institution/society';

// components
import school from '../components/school.vue';
import pageTitle from '../components/title.vue';

const { query } = useRoute();

provide('query', query);

const formValue = reactive({});

onBeforeMount(async () => {
  const { id, orgProperty } = query;
  if (!id) return;
  const data = await getDetail({ id, orgProperty });
  data && Object.assign(formValue, data);
});

defineOptions({ name: 'SocietyDetail' });
</script>

<style scoped lang="less"></style>
