import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';

import { ls } from '@common/utils/cache';
import { MULTI_TAB_KEY } from '@common/enum/cacheEnum';
import { theme } from '@common/settings/theme';

import { PageEnum } from '@common/enum/pageEnum';
import { getRawRoute } from '@common/utils/common';

const cacheTab = theme.tab.isCache;

export const useTabStore = defineStore('tab-store', {
  state: () => ({
    cacheTabList: new Set(), // Tabs that need to be cached
    tabList: cacheTab ? ls.get(MULTI_TAB_KEY) || [] : [] // 多页签数据
  }),
  getters: {
    getCachedTabList() {
      return Array.from(this.cacheTabList);
    }
  },
  actions: {
    resetState() {
      cacheTab && ls.set(MULTI_TAB_KEY, undefined);
      this.$reset();
    },

    // Update the cache according to the currently opened tabs
    updateCacheTab() {
      const cacheMap = new Set();

      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        // Ignore the cache
        const needCache = item.meta?.keepAlive ?? false;
        if (!needCache) {
          continue;
        }
        const name = item.name;
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
      cacheTab && this.setCacheTab();
    },

    addTab(route) {
      const { path, name, fullPath, meta = {}, params, query } = getRawRoute(route);

      // 404  The page does not need to add a tab
      if (meta.hideTab || name === PageEnum.NOT_FOUND_NAME || !name) {
        return;
      }

      let updateIndex = -1;
      // Existing pages, do not add tabs repeatedly
      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index;
        return tab.path === path;
      });

      // If the tab already exists, perform the update operation
      if (tabHasExits) {
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) {
          return;
        }
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        curTab.path = path || curTab.path;
        this.tabList.splice(updateIndex, 1, curTab);
      } else {
        this.tabList.push(route);
      }

      this.updateCacheTab();
    },

    async closeTab(tab, router) {
      const close = route => {
        const { path } = route;
        const index = this.tabList.findIndex(item => item.path === path);
        index !== -1 && this.tabList.splice(index, 1);
        cacheTab && this.setCacheTab();
      };

      const { currentRoute, replace } = router;

      const { path, fullPath } = unref(currentRoute);
      if (fullPath !== tab.fullPath) {
        // Closed is not the activation tab
        close(tab);
        return;
      }

      // Closed is activated atb
      let toTarget = {};

      const index = this.tabList.findIndex(item => item.path === path);

      // If the current is the leftmost tab
      if (index === 0) {
        // There is only one tab, then jump to the homepage, otherwise jump to the right tab
        if (this.tabList.length === 1) {
          toTarget = PageEnum.BASE_HOME;
        } else {
          //  Jump to the right tab
          toTarget = this.tabList[index + 1];
        }
      } else {
        // Close the current tab
        toTarget = this.tabList[index - 1];
      }
      close(currentRoute.value);
      await replace(toTarget);
    },

    // Close according to key
    closeTabByKey(key, router) {
      const index = this.tabList.findIndex(item => item.path === key);
      if (index !== -1) {
        this.closeTab(this.tabList[index], router);
      }
    },

    // Close the tab on the right and jump
    async closeLeftTabs(route) {
      const index = this.tabList.findIndex(item => item.path === route.path);

      if (index > 0) {
        const leftTabs = this.tabList.slice(0, index);
        const pathList = [];
        for (const item of leftTabs) {
          pathList.push(item.fullPath);
        }
        this.tabList = this.tabList.filter(item => !pathList.includes(item.fullPath));
      }
      this.updateCacheTab();
    },

    // Close the tab on the left and jump
    async closeRightTabs(route) {
      const index = this.tabList.findIndex(item => item.fullPath === route.fullPath);

      if (index >= 0 && index < this.tabList.length - 1) {
        const rightTabs = this.tabList.slice(index + 1, this.tabList.length);

        const pathList = [];
        for (const item of rightTabs) {
          pathList.push(item.fullPath);
        }
        this.tabList = this.tabList.filter(item => !pathList.includes(item.fullPath));
      }
      this.updateCacheTab();
    },

    /**
     * Close other tabs
     */
    async closeOtherTabs(route) {
      const closePathList = this.tabList.map(item => item.fullPath);

      const pathList = [];

      for (const path of closePathList) {
        if (path !== route.fullPath) {
          const closeItem = this.tabList.find(item => item.path === path);
          if (!closeItem) {
            continue;
          }
          pathList.push(closeItem.fullPath);
        }
      }
      this.tabList = this.tabList.filter(item => !pathList.includes(item.fullPath));
      this.updateCacheTab();
    },

    /**
     * Set tab's title
     */
    async setTabTitle(title, route) {
      const findTab = this.tabList.find(item => item === route);
      if (findTab) {
        findTab.meta.title = title;
        this.updateCacheTab();
      }
    },

    setCacheTab() {
      let tabs = this.tabList.map(item => {
        let { matched: _matched, ...tabParams } = item;
        return tabParams;
      });
      ls.set(MULTI_TAB_KEY, tabs);
    }
  }
});
