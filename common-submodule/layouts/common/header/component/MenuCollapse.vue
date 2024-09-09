<template>
  <hover-container class="w-40px h-full" :inverted="theme.header.inverted" @click="app.toggleSiderCollapse">
    <icon-line-md-menu-unfold-left v-if="app.siderCollapse" class="text-5" />
    <icon-line-md-menu-fold-left v-else class="text-5" />
  </hover-container>
</template>

<script setup>
import { theme } from '@common/settings/theme';
import { useAppStore } from '@/store';

defineOptions({ name: 'MenuCollapse' });

const app = useAppStore();
</script>

<style scoped></style>
