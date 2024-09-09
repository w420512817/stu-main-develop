<template>
  <dark-mode-container class="global-sider flex-col-stretch h-full" :inverted="theme.sider.inverted">
    <logo :show-title="!app.siderCollapse" :style="{ height: theme.header.height + 'px' }" />
    <n-scrollbar class="flex-1-hidden side-menu-define">
      <n-menu
        :accordion="theme.menu.accordion"
        :value="activeKey"
        :collapsed="app.siderCollapse"
        :collapsed-width="theme.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="menus"
        :inverted="theme.sider.inverted"
        :indent="18"
        style="--n-item-text-color: white; --n-item-icon-color: white; --n-arrow-color: white"
        @update:value="handleUpdateMenu"
      />
    </n-scrollbar>
  </dark-mode-container>
</template>

<script setup>
import { computed, h } from 'vue';
import { useAppStore, useRouteStore } from '@/store';
import { useGo } from '@common/hooks/usePage';
import { theme } from '@common/settings/theme';
import Logo from '../logo/Logo.vue';
import { NBadge } from 'naive-ui';
import { useUserStore } from '@/store';
import { getAPPType } from '@common/utils/common/env';
import useRouteBuried from '@common/hooks/business/useRouteBuried';

const { note } = useRouteBuried();

const userStore = useUserStore();
defineOptions({ name: 'GlobalMenu' });

const {
  go,
  route: { currentRoute }
} = useGo();

const app = useAppStore();
const routeStore = useRouteStore();

let menusObj = routeStore.getMenuList;
menusObj.forEach(v => {
  if (v.name == 'Notice') {
    v.children.forEach(vv => {
      if (vv.name == 'receiveManage') {
        vv.label = () =>
          h('div', {}, [
            '接收通知 ',
            h(NBadge, {
              value: userStore.noticeSum
            })
          ]);
      }
    });
    v.label = () =>
      h('div', {}, [
        '通知管理 ',
        h(NBadge, {
          value: userStore.noticeSum
        })
      ]);
  }
});
const menus = menusObj;

const activeKey = computed(() =>
  currentRoute.value.meta?.activeMenu ? currentRoute.value.meta.activeMenu : currentRoute.value.path
);

function handleUpdateMenu(_key, route) {
  go(route.path);
  if (getAPPType() === 'MAIN') {
    // 只有主应用才需要采集点击数据
    note(route);
  }
}
</script>
<style lang="less" scoped>
.global-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
:deep(.side-menu-define) {
  .n-menu .n-menu-item-content {
    &::before {
      left: 0;
      right: 0;
      width: 100%;
      background: transparent;
    }
    &.n-menu-item-content--selected {
      &::before {
        background: linear-gradient(to right, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0));
        animation: slideFromLeft 0.35s ease-in both;
      }
      &::after {
        content: '';
        display: block;
        width: 4px;
        height: 100%;
        background: white;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
@keyframes slideFromLeft {
  from {
    transform: translateX(-100%);
  }
}
</style>
