<template>
  <hover-container
    class="w-40px h-full"
    tooltip-content="返回主应用"
    :inverted="theme.header.inverted"
    @click="backMain"
  >
    <icon-mdi:home-import-outline class="text-20px text-white hover:text-dark" />
  </hover-container>
</template>
<script setup>
import { theme } from '@common/settings/theme';
import { isLocalMode } from '@common/utils/common/env';

defineOptions({ name: 'BackMain' });

const backMain = () => {
  const { host, hostname } = window.location;

  // 本地环境主应用端口3001，测试/生产环境主应用ngnix是main
  window.location.href = isLocalMode() ? `//${hostname}:3301/` : `//${host}/`;
};
</script>
