<template>
  <n-breadcrumb>
    <template v-for="brd in routes" :key="brd.key">
      <n-breadcrumb-item>
        <n-dropdown v-if="brd.hasChildren" :options="brd.children" @select="handleSelect">
          <span>
            <component :is="brd.icon" v-if="theme.header.crumb.showIcon" class="mr-1 text-4 !v-bottom" />
            <span>{{ brd.meta.title }}</span>
          </span>
        </n-dropdown>
        <template v-else>
          <component :is="brd.icon" v-if="theme.header.crumb.showIcon" class="mr-1 text-4 !v-bottom" />
          <span>{{ brd.meta.title }}</span>
        </template>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script setup>
import { ref, unref, watchEffect } from 'vue';
import { useGo } from '@common/hooks/usePage';
import { theme } from '@common/settings/theme';
import { filter } from '@common/utils/common';
import { useRouteStore } from '@/store';
import { getAllParentPath } from '@/router/helper/menuHelper';

defineOptions({ name: 'GlobalBreadcrumb' });

const routeStore = useRouteStore();

const {
  go,
  route: { currentRoute }
} = useGo();

const routes = ref([]);

watchEffect(() => {
  const menus = routeStore.getMenuList;

  let { matched, path, name, meta } = unref(currentRoute);
  const cur = matched?.[matched.length - 1];

  if (cur && cur?.meta?.activeMenu) {
    path = cur.meta.activeMenu;
  }

  const parent = getAllParentPath(menus, path);
  const filterMenus = menus.filter(item => item.path === parent[0]);
  const matchedList = getMatched(filterMenus, parent);

  if (!matchedList || matchedList.length === 0) return;

  const breadcrumbList = filterItem(matchedList);

  if (meta?.activeMenu && !meta?.hideBreadcrumb && !meta?.hideMenu) {
    breadcrumbList.push({
      ...unref(currentRoute),
      name: meta?.title || name
    });
  }

  routes.value = breadcrumbList;
});

function getMatched(menus, parent) {
  const metched = [];
  menus.forEach(item => {
    if (parent.includes(item.path)) {
      metched.push({
        ...item,
        hasChildren: !!item.children?.length,
        name: item.meta?.title || item.name
      });
    }
    if (item.children?.length) {
      metched.push(...getMatched(item.children, parent));
    }
  });
  return metched;
}

function filterItem(list) {
  return filter(list, item => {
    const { meta, name } = item;
    if (!meta) {
      return !!name;
    }
    const { title, hideBreadcrumb, hideMenu } = meta;
    if (!title || hideBreadcrumb || hideMenu) {
      return false;
    }
    return true;
  }).filter(item => !item.meta?.hideBreadcrumb);
}

function handleSelect(path) {
  go(path);
}
</script>
<style scoped></style>
