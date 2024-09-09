<template>
  <n-checkbox-group v-bind="item" :value="value" @update:value="handleChange">
    <n-space>
      <n-checkbox v-for="i in item.options" :key="i.value" :value="i.value">{{ i.label }}</n-checkbox>
    </n-space>
  </n-checkbox-group>
</template>

<script setup>
import { object, string, bool, array } from 'vue-types';

const props = defineProps({
  item: object().def({}),
  value: string().def('')
});

console.log(props.value, 'props.value');

const emit = defineEmits(['update:value']);

const handleChange = e => {
  console.log(e, '123');
  emit('update:value', e);
};
</script>

<style lang="less" scoped></style>
