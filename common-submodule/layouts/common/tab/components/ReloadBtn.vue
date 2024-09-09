<template>
  <hover-container class="w-40px h-full" tooltip-content="刷新" placement="bottom-end" @click="handleRefresh">
    <icon-ic:twotone-refresh class="text-5 text-secondary hover:text-dark" :class="{ 'animate-spin': loading }" />
  </hover-container>
</template>

<script setup>
import useLoading from '@common/hooks/useLoading';
import { useAppStore } from '@/store';
import { useThrottleFn } from '@vueuse/core';

defineOptions({ name: 'ReloadBtn' });

const app = useAppStore();

const { loading, startLoading, endLoading } = useLoading();

const handleRefresh = useThrottleFn(() => {
  startLoading();
  app.reloadPage();
  setTimeout(() => {
    endLoading();
  }, 1000);
}, 1000);
</script>

<style scoped></style>
