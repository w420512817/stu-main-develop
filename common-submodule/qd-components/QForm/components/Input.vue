<template>
  <n-input v-bind="item" :value="getValue(value)" @update:value="handleChange">
    <template v-if="item.prefix" #prefix> {{ item.prefix }} </template>
    <template v-if="item.suffix" #suffix> {{ item.suffix }} </template>
  </n-input>
  <!-- <n-input :value="getKeys(item.path)" :placeholder="item.placeholder" @input="e => handleChange(e, item)"> -->
</template>

<script setup>
import { object, string } from 'vue-types';
import { computed } from 'vue';

const props = defineProps({
  item: object().def(() => {}),
  value: string().def('')
});

console.log(props.value, 'props.value');

const emit = defineEmits(['update:value']);

const getValue = computed(() => {
  return value => {
    return value && String(value);
  };
});

const handleChange = e => {
  emit('update:value', e);
};
</script>

<style lang="less" scoped>
:deep(.n-input__suffix) {
  width: 38px;
  margin-right: -12px;
  border: 1px solid #000;
  z-index: 20;
}
</style>
