<template>
  <line-chart v-bind="$attrs" :extend="reportExtend" />
</template>

<script setup>
import { deepMerge } from '@common/utils/common';
import { ref, watch } from 'vue';
import { object } from 'vue-types';
import { line_base, line_num, line_per } from '@common/settings/chartSetting';

const props = defineProps({
  extend: object().def({})
});

const reportExtend = ref({});

watch(
  [() => props.extend, () => props.labelMap, () => props.chartData],
  () => {
    if (props.extend.type == 'line_num') {
      reportExtend.value = deepMerge({}, line_num, props.extend);
    } else if (props.extend.type == 'line_per') {
      reportExtend.value = deepMerge({}, line_per, props.extend);
    } else {
      reportExtend.value = deepMerge({}, line_base, props.extend);
    }
  },
  { immediate: true, deep: true }
);
</script>
