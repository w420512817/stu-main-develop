<template>
  <n-auto-complete v-bind="item" :value="value" :options="unref(item.options)" @update:value="handleChange" />
  <!-- 这里必须用unref包一层 naive好像没有处理ref的情况 -->
</template>

<script setup>
import { object, string } from 'vue-types';
import { unref } from 'vue';
const props = defineProps({
  item: object().def(() => {}),
  value: string().def(null)
});

console.log(props.item, 'item888888');

const options = [
  { label: '6@gmail.com', value: '6@gmail.com' },
  { label: '6@163.com', value: '6@163.com' },
  { label: '6@qq.com', value: '6@qq.com' }
];
const emit = defineEmits(['update:value']);

const handleChange = e => {
  emit('update:value', e);
};
</script>

<style lang="less" scoped></style>
