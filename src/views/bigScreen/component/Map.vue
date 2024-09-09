<template>
  <div ref="mapRef" :style="{ width, height }"></div>
</template>

<script>
import { object, string } from 'vue-types';
import { deepMerge } from '@/utils/common/index.js';
</script>
<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

import { useECharts } from '@common/hooks/useECharts';
import axios from 'axios';

import { labelCenter } from './map-data';

const props = defineProps({
  extend: object().def({}),
  width: string().def('100%'),
  height: string().def('100%')
});
const emit = defineEmits(['click']);

const mapRef = ref(null);
const { setOptions, getInstance, echarts } = useECharts(mapRef);
const mapChart = ref(null);
let option;

// 初始 option
option = {
  tooltip: {
    trigger: 'item'
  }
};
const getOption = computed(() => deepMerge(option, props.extend));

// watch(
//   [() => props.dataset, () => props.extend],
//   () => {
//     setOptions(getOption.value);
//   },
//   { immediate: true, deep: true }
// );
const initChart = async () => {
  const geoJson = await axios({
    url: `//cdn.qdsgvision.com/map-res/json/330300.json`,
    method: 'get'
  });
  geoJson.data.features.forEach(ele => {
    const i = labelCenter.findIndex(e => ele.id === e.id);
    if (i > -1) {
      ele.properties.cp = labelCenter[i].cp;
    }
  });
  echarts.registerMap('330300', geoJson.data);
  mapChart.value = getInstance();
  setOptions(getOption.value);
  mapChart.value.on('click', function () {
    emit('click');
  });
};
initChart();
</script>
