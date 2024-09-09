<template>
  <drop-select
    :ref="item.ref"
    :value="value"
    :list-api="item['list-api']"
    keyword="name"
    :label-field="item['label-field']"
    :value-field="item['value-field']"
    :placeholder="item.placeholder"
    filterable
    clearable
    :params="item.params"
    @update:value="handleChange"
  />
  <!-- @update:value="updateBuild" -->
  <!-- {{ value }}123 -->
  <!-- v-model:value="formData[item.path]" -->
</template>

<script setup>
import { object, string } from 'vue-types';
// import { DropSelect } from '@common/components/naive-ui';

defineProps({
  item: object().def(() => {}),
  value: string().def(null)
});

const emit = defineEmits(['update:value']);

const handleChange = e => {
  console.log(e, 'e');
  emit('update:value', e);
};
</script>

<style lang="less" scoped></style>
