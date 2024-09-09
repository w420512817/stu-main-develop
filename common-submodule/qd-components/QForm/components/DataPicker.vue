<template>
  <n-date-picker
    v-bind="item"
    :formatted-value="value"
    class="w-full"
    :is-date-disabled="disabledTomorrow"
    placeholder="请选择出生日期"
    @update:formatted-value="handleChange"
  />
</template>

<script setup>
import { object, string } from 'vue-types';

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
