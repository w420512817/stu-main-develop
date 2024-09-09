<template>
  <n-cascader
    placeholder="请选择"
    :options="userStore.getAreaTree"
    show-path
    remote
    label-field="regionName"
    value-field="regionId"
    v-bind="$attrs"
    @update:value="updateVal"
  />
</template>
<script setup>
import { useAttrs } from 'vue';

import { useUserStore } from '@/store';

const userStore = useUserStore();
const attrs = useAttrs();
const emits = defineEmits(['update:val']);
const updateVal = (val, option, pathValues) => {
  if (attrs['check-strategy'] == 'all') {
    // 支持任意一级点选
    emits('update:val', { regionType: option.level, regionId: option.regionId });
  } else {
    const [
      { regionId: provinceId, regionName: province },
      { regionId: cityId, regionName: city },
      { regionId: regionId, regionName: region }
    ] = pathValues;
    const areaName = province + '-' + city + '-' + region;
    emits('update:val', { areaName, cityId, provinceId, regionId });
  }
};
</script>
