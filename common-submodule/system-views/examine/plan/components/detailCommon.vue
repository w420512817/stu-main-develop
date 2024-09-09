<template>
  <p class="mb-3 bg-light font-bold text-6 pa-5">{{ props.formValue.planName }}</p>
  <n-card title="基本信息" class="bolder-card shadow-sm mb-3">
    <n-grid x-gap="10" :cols="5">
      <n-gi>
        <n-form-item :label="`${planName}名称`"> {{ props.formValue.planName }} </n-form-item>
      </n-gi>
      <n-gi v-if="query.planMode == 1">
        <n-form-item :label="`${planName}年份`"> {{ props.formValue.planYear }} </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item label="任务日期"> {{ props.formValue.startTime }} ~ {{ props.formValue.endTime }} </n-form-item>
      </n-gi>

      <n-gi v-if="query.planMode == 1">
        <n-form-item :label="`${planName}类型`"> {{ props.formValue.planTypeLaber }} </n-form-item>
      </n-gi>
      <slot></slot>
    </n-grid>
  </n-card>
  <n-card v-if="props.formValue.planType === 102" title="筛查条件" class="bolder-card shadow-sm mb-3">
    <n-card
      v-for="(item, i) in props.formValue.screeningConditionList"
      :key="i"
      :bordered="false"
      size="small"
      :title="`筛选条件${i + 1}`"
    >
      <n-grid x-gap="10" :cols="4">
        <n-gi>
          <n-form-item label="学校"> {{ item.orgName || '/' }} </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="年级"> {{ item.grade || '/' }} </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="班级"> {{ item.className || '/' }} </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="抽查人数"> {{ item.number ? item.number : '--' }} 人 </n-form-item>
        </n-gi>
      </n-grid>
    </n-card>
  </n-card>
  <n-card title="筛查项目" class="bolder-card shadow-sm mb-3">
    <n-card
      v-for="item in props.formValue.screeningOptions"
      :key="item.screeningTypeId"
      :bordered="false"
      size="small"
      :header-style="{ 'padding-left': 0, 'padding-right': 0 }"
      :content-style="{ 'padding-left': 0, 'padding-right': 0 }"
      :title="item.screeningTypeName"
    >
      <n-grid x-gap="10" :cols="3">
        <n-gi v-for="ele in item.itemList" :key="ele.id">
          <n-form-item label-style="font-size:15px" :label="ele.screeningItemName">
            {{ ele.selectionLaber }}
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-card>
  </n-card>
</template>
<script setup>
import { object, string } from 'vue-types';
import { useRoute } from 'vue-router';
const { query } = useRoute();

const props = defineProps({
  formValue: object().def({}),
  planName: string().def('计划')
});
</script>
