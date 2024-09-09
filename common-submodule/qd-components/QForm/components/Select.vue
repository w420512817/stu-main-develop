<template>
  <n-select
    v-bind="item"
    :value="value"
    :label-field="item['label-field']"
    :value-field="item['value-field']"
    :placeholder="item.placeholder"
    :options="item.options"
    @update:value="handleChange"
  />
  <!-- v-model:value="formData[item.path]" -->
</template>

<script setup>
import { object, string, bool, array } from 'vue-types';

const props = defineProps({
  item: object().def({}),
  value: string().def('')
});

const emit = defineEmits(['update:value']);

const handleChange = e => {
  console.log(e, 'e');
  emit('update:value', e);
};
</script>

<style lang="less" scoped></style>
