<template>
  <n-form :model="formValue" label-placement="top" show-require-mark require-mark-placement="left">
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
  </n-form>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { number, string, oneOfType } from 'vue-types';

// api
import { getDetail } from '@/api/information/society';

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
