<template>
  <dark-mode-container class="global-tab flex-y-center w-full pl-4" :style="{ height: theme.tab.height + 'px' }">
    <div ref="bsWrapper" class="flex-1-hidden h-full">
      <better-scroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: true, mouseWheel: true }">
        <div ref="tabRef" class="h-full flex-y-center">
          <ButtonTab
            v-for="item in tabStore.tabList"
            :key="item.path"
            :is-active="item.path === activeTabRef"
            :primary-color="theme.themeColor"
            :closable="closable"
            class="mr-1"
            @click.stop="handleTabClick(item.fullPath, item.path)"
            @close="handleTabClose(item.path)"
            @contextmenu="handleContextMenu($event, item)"
          >
            {{ item.meta.title }}
          </ButtonTab>
        </div>
        <context-menu v-model:visible="dropdown.visible" :current="dropdown.current" :x="dropdown.x" :y="dropdown.y" />
      </better-scroll>
    </div>
    <reload-btn v-if="theme.tab.showReload" />
  </dark-mode-container>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch, unref } from 'vue';
import { useRouter } from 'vue-router';
import { useElementBounding, useResizeObserver, useDebounceFn } from '@vueuse/core';
// import { PageTab } from '@soybeanjs/vue-materials';
import { ButtonTab } from '@soybeanjs/vue-admin-tab';
import { BetterScroll, ContextMenu, ReloadBtn } from './components';
import { useUserStore, useTabStore } from '@/store';
import { theme } from '@common/settings/theme';

defineOptions({ name: 'GlobalTab' });

// const { ButtonTab } = AdminTab;

const router = useRouter();

const tabStore = useTabStore();
const userStore = useUserStore();

const activeTabRef = ref('');
const activeTabIndex = computed(() => tabStore.tabList.findIndex(tab => tab.path === unref(activeTabRef)));

const closable = computed(() => tabStore.tabList.length > 1);

const bsWrapper = ref(null);
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);

// 获取当前激活的tab的clientX
const tabRef = ref(null);

async function getActiveTabClientX() {
  await nextTick();
  if (tabRef.value && tabRef.value.children.length && tabRef.value.children[unref(activeTabIndex)]) {
    const activeTabElement = tabRef.value.children[unref(activeTabIndex)];
    const { x, width } = activeTabElement.getBoundingClientRect();
    const clientX = x + width / 2;
    setTimeout(() => {
      handleScroll(clientX);
    }, 50);
  }
}

const bsScroll = ref(null);

function handleScroll(clientX) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  if (bsScroll.value) {
    const { maxScrollX, x: leftX } = bsScroll.value.instance;
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    bsScroll.value?.instance.scrollBy(update, 0, 300);
  }
}

const dropdown = reactive({
  visible: false,
  x: 0,
  y: 0,
  current: {}
});

/** 点击右键菜单 */
async function handleContextMenu(e, current) {
  e.preventDefault();
  const { clientX: x, clientY: y } = e;
  dropdown.visible = false;
  Object.assign(dropdown, { x, y, current });
  await nextTick();
  dropdown.visible = true;
}

function handleTabClick(activeKey, path) {
  activeTabRef.value = path;
  router.push(activeKey);
}

// Close the current tab
function handleTabClose(targetKey) {
  // Added operation to hide, currently only use delete operation
  if (!unref(closable)) {
    return;
  }

  tabStore.closeTabByKey(targetKey, router);
}

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    if (!userStore.isLogin) {
      return;
    }

    const { path, meta = {} } = unref(router.currentRoute);
    const { activeMenu, hideTab } = meta;
    const isHide = !hideTab ? null : activeMenu;

    activeTabRef.value = isHide || path;

    if (isHide) {
      const findParentRoute = router.getRoutes().find(item => item.path === activeMenu);

      findParentRoute && tabStore.addTab(findParentRoute);
    } else {
      tabStore.addTab(unref(router.currentRoute));
    }
  },
  {
    immediate: true
  }
);

watch(
  () => activeTabIndex.value,
  () => {
    getActiveTabClientX();
  },
  {
    // immediate: true
  }
);

const resizeFn = useDebounceFn(() => {
  getActiveTabClientX();
}, 200);

// 监听tab容器 resize
useResizeObserver(bsWrapper, resizeFn);
</script>

<style scoped>
.global-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
