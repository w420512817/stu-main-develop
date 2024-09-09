<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :breakpoints="breakpoints"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup>
import { zhCN, dateZhCN } from 'naive-ui';
import { useTitle } from '@common/hooks/useTitle';
import { getNaiveThemeOverrides, breakpoints } from '@common/settings/theme';

// 动态改变页面标题
useTitle();

// 自定义主题
const themeOverrides = getNaiveThemeOverrides();
</script>

<style scoped></style>
