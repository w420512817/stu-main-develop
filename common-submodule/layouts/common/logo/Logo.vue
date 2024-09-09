<template>
  <router-link to="/" class="flex-center w-full nowrap-hidden">
    <system-logo class="text-32px" />
    <h2 v-show="showTitle" class="pl-8px text-20px font-bold text-white transition duration-300 ease-in-out">
      {{ title }}
    </h2>
  </router-link>
</template>

<script setup>
import { getAppEnv } from '@common/utils/common/env';

defineOptions({ name: 'GlobalLogo' });

defineProps({
  showTitle: {
    type: Boolean,
    default: true
  }
});

const { VITE_APP_TITLE: title } = getAppEnv();
</script>

<style scoped></style>
