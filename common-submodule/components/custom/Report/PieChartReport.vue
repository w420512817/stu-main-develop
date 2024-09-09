<template>
  <pie-chart v-bind="$attrs" :extend="reportExtend" />
</template>

<script setup>
import { deepMerge } from '@common/utils/common';
import { ref, watch } from 'vue';
import { object } from 'vue-types';
import { pie_base } from '@common/settings/chartSetting';

const props = defineProps({
  extend: object().def({})
});

const reportExtend = ref({});

watch(
  [() => props.extend, () => props.labelMap, () => props.chartData],
  () => {
    reportExtend.value = deepMerge({}, pie_base, props.extend);
  },
  { immediate: true, deep: true }
);
</script>
