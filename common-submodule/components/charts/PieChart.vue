<template>
  <div ref="chartRef" :style="{ width, height }" class="relative">
    <div v-if="props.loading" class="absolute top-0 left-0 z-10 w-full h-full bg-opacity-50 bg-white">
      <n-spin class="absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4" size="small" />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { object, string, bool, array } from 'vue-types';
import { useECharts } from '@common/hooks/useECharts';
import { deepMerge } from '@common/utils/common';

const props = defineProps({
  dataset: object().def({}),
  extend: object().def({}),
  width: string().def('100%'),
  height: string().def('100%'),
  loading: bool().def(false),
  colors: array().def(['#74A8FA', '#18E2E4'])
});

const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);
let option;

// 初始 option
option = {
  legend: {
    left: 'left',
    itemHeight: 12,
    itemWidth: 12,
    icon: 'rect'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '',
      type: 'pie'
    }
  ],
  dataset: props.dataset
};

const getOption = computed(() => deepMerge(option, props.extend));

watch(
  [() => props.dataset, () => props.extend],
  () => {
    setOptions(getOption.value);
  },
  { immediate: true, deep: true }
);
</script>
