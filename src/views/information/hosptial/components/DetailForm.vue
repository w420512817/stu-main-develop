<template>
  <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
    <n-grid cols="3" x-gap="100" class="mt-5">
      <n-form-item-gi label="医院名称:">
        {{ formValue.name }}
      </n-form-item-gi>
      <n-form-item-gi label="医院属性:">
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
      <n-form-item-gi label="医院类型:">
        {{ formValue.hospTypeSt }}
      </n-form-item-gi>
      <n-form-item-gi label="所有制:">
        {{ formValue.hospOwnershipSt }}
      </n-form-item-gi>
      <n-form-item-gi label="医院等级:">
        {{ formValue.hospLevelSt }}
      </n-form-item-gi>
      <template v-if="orgProperty != 5">
        <n-form-item-gi label="关联学校（ 所）:">
          {{ formValue.associateSchoolCount }}
        </n-form-item-gi>
        <n-form-item-gi label="可筛查学生（人）:">
          {{ formValue.screenNum }}
        </n-form-item-gi>
      </template>
    </n-grid>
  </n-form>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { oneOfType, number, string } from 'vue-types';

import { getDetail } from '@/api/information/hosptial';

const props = defineProps({
  id: oneOfType([number().def(0), string().def('')]),
  orgProperty: oneOfType([number().def(0), string().def('')])
});

const formValue = reactive({});

onBeforeMount(async () => {
  const data = await getDetail({ id: props.id, orgProperty: props.orgProperty });
  data && Object.assign(formValue, data);
});
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
