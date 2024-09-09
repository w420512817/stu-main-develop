<template>
  <div class="flex items-center gap-1">
    <n-input
      placeholder="分"
      :value="minute"
      :allow-input="onlyAllowNumber"
      @update:value="timeChange(0, $event, second, millisecond)"
    >
      <template #suffix> m </template>
    </n-input>
    <n-input
      placeholder="秒"
      :value="second"
      :allow-input="onlyAllowNumber"
      @update:value="timeChange(1, minute, $event, millisecond)"
    >
      <template #suffix> s </template>
    </n-input>
    <n-input
      placeholder="毫秒"
      :value="millisecond"
      :allow-input="onlyAllowNumber"
      @update:value="timeChange(2, minute, second, $event)"
    >
      <template #suffix> ms </template>
    </n-input>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const onlyAllowNumber = value => !value || /^\d+$/.test(value);
const timeChange = (type, minute, second, millisecond) => {
  emit('update:modelValue', getMilliSecond(minute, second, millisecond));
};

const minute = computed(() => {
  const value = getTime(props.modelValue)[0];
  return value + '';
});

const second = computed(() => {
  const value = getTime(props.modelValue)[1];
  return value + '';
});

const millisecond = computed(() => {
  const value = getTime(props.modelValue)[2];
  return value + '';
});

function getTime(time) {
  // 转换为式分秒
  let m = parseInt(time / 60);
  let s = parseInt(time % 60);
  let ms = parseInt((time * 10) % 10);
  // 作为返回值返回
  return [m, s, ms];
}

function getMilliSecond(m, s, ms) {
  if (ms >= 10) {
    ms = 9;
  }
  if (s >= 60) {
    s = 59;
  }
  return (parseFloat(ms / 10) ?? 0) + (parseInt(s) ?? 0) + (parseInt(m * 60) ?? 0);
}
</script>
