<template>
  <n-input-number v-bind="item" :show-button="false" :value="value" @update:value="handleChange">
    <template v-if="item.prefix" #prefix> {{ item.prefix }} </template>
    <template v-if="item.suffix" #suffix> {{ item.suffix }} </template>
  </n-input-number>
</template>

<script setup>
import { object, number } from 'vue-types';

defineProps({
  item: object().def(() => {}),
  value: number().def(null)
});

const emit = defineEmits(['update:value']);

const handleChange = e => {
  emit('update:value', e);
};
</script>

<style lang="less" scoped>
:deep(.n-input__suffix) {
  width: 38px;
  margin-right: -8px;
  border: 1px solid #000;
  z-index: 20;
}
.n-input-number {
  width: 100%;
}
</style>
