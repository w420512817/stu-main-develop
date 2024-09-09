<template>
  <n-card>
    <province v-if="showProvince" @update-city="updateCity" />
    <city v-else @toggle="toggle" />
  </n-card>
</template>

<script setup>
import { computed, provide, ref, reactive } from 'vue';
import { useUserStore } from '@/store';
import province from './components/province.vue';
import city from './components/city.vue';

const toggleProvince = ref(true);

const {
  userInfo: { govLevel }
} = useUserStore();

const state = reactive({
  orgLevel: govLevel,
  cityId: null
});

const showProvince = computed(() => {
  let show = true;
  if (govLevel > 1) show = false;
  else show = toggleProvince.value;
  return show;
});

const updateCity = row => {
  toggleProvince.value = false;
  state.cityId = row.cityId;
};
const toggle = () => {
  state.cityId = null;
  toggleProvince.value = !toggleProvince.value;
};
provide('state', state);
</script>
