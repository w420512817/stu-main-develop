<template>
  <n-slider v-bind="item" :show-button="false" :value="value" @update:value="handleChange" />
</template>

<script setup>
import { object, string } from 'vue-types';

const props = defineProps({
  item: object().def(() => {}),
  value: string().def(null)
});

const emit = defineEmits(['update:value']);

const handleChange = e => {
  emit('update:value', e);
};
</script>

<style lang="less" scoped></style>
