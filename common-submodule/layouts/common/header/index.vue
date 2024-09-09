<template>
  <dark-mode-container class="global-header flex-y-center h-full" :inverted="theme.header.inverted">
    <div class="flex-1-hidden flex-y-center h-full">
      <menu-collapse />
      <breadcrumb v-if="theme.header.crumb.visible && !isMobile" />
    </div>

    <div class="flex justify-end h-full">
      <back-main v-if="isMainApp" />
      <FullScreen />
      <user-avatar />
    </div>
  </dark-mode-container>
</template>

<script setup>
import { computed } from 'vue';
import { MenuCollapse, UserAvatar, Breadcrumb, FullScreen, BackMain } from './component';
import { theme } from '@common/settings/theme';
import { useBreakpoint } from '@common/hooks/useBreakpoint';

defineOptions({ name: 'GlobalHeader' });

const { isMobile } = useBreakpoint();

const { VITE_APP_KEY } = import.meta.env;
const isMainApp = computed(() => VITE_APP_KEY !== 'MAIN'); // 是否是主应用
</script>

<style scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
