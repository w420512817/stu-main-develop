<template>
  <admin-layout
    :mode="theme.layout.mode"
    :is-mobile="isLaptop"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :sider-visible="true"
    :sider-width="theme.sider.width"
    :sider-collapsed-width="theme.sider.collapsedWidth"
    :sider-collapse="appStore.siderCollapse"
    :add-main-overflow-hidden="addMainOverflowHidden"
    :footer-visible="theme.footer.visible"
    :fixed-footer="theme.footer.fixed"
    @update:sider-collapse="appStore.setSiderCollapse"
  >
    <template #header>
      <global-header :show-logo="true" />
    </template>
    <template #tab>
      <global-tab />
    </template>
    <template #sider>
      <global-menu />
    </template>
    <global-content @hide-main-overflow="setAddMainOverflowHidden" />
    <template #footer>
      <global-footer />
    </template>
  </admin-layout>
  <global-back-top />

  <!-- 学生名单导入进度 -->
  <student-progress />
</template>

<script setup>
import AdminLayout from '@soybeanjs/vue-admin-layout';
// import { AdminLayout } from '@soybeanjs/vue-materials';

import { theme } from '@common/settings/theme';
import { useAppStore } from '@/store';
import useBoolean from '@common/hooks/useBoolean';
import { useBreakpoint } from '@common/hooks/useBreakpoint';
import {
  GlobalHeader,
  GlobalContent,
  GlobalFooter,
  GlobalMenu,
  GlobalTab,
  GlobalBackTop
} from '@common/layouts/common';

defineOptions({ name: 'BasicLayout' });

const { isLaptop } = useBreakpoint();
const { bool: addMainOverflowHidden, setBool: setAddMainOverflowHidden } = useBoolean();

const appStore = useAppStore();
</script>
