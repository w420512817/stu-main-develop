<template>
  <hover-container class="w-40px h-full" tooltip-content="全屏" :inverted="theme.header.inverted" @click="toggle">
    <icon-gridicons-fullscreen-exit v-if="isFullscreen" class="text-white hover:text-dark" />
    <icon-gridicons-fullscreen v-else class="text-white hover:text-dark" />
  </hover-container>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core';
import { theme } from '@common/settings/theme';

defineOptions({ name: 'FullScreen' });

const { isFullscreen, toggle } = useFullscreen();
</script>

<style scoped></style>
