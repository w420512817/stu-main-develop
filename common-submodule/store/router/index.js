/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 14:39:58
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-12 10:11:29
 */
import { defineStore } from 'pinia';
import { useUserStore } from '../user';
import { asyncRoutes } from '@/router/routes';
import { resetRouter } from '@/router';
import { getMenusFromRoutes } from '@/router/helper/menuHelper';
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { filter } from '@common/utils/common';

export const useRouteStore = defineStore('route-store', {
  state: () => ({
    // 菜单列表
    menus: [],
    // 是否初始化了权限路由
    isDynamicAddedRoute: false
  }),
  getters: {
    getMenuList() {
      return this.menus;
    },
    getIsDynamicAddedRoute() {
      return this.isDynamicAddedRoute;
    }
  },
  actions: {
    setMenus(list) {
      this.menus = list;
    },
    setDynamicAddedRoute(added) {
      this.isDynamicAddedRoute = added;
    },
    resetState() {
      this.$reset();
      resetRouter();
    },
    generateRoutes() {
      // TODO: 临时放开路由权限控制  start 注意放开上面脚本引入
      // const userStore = useUserStore();
      // let routes = [];

      // const routeFilter = route => {
      //   const resourceId = route.meta?.resourceId;
      //   if (Array.isArray(resourceId)) {
      //     if (!resourceId.length) return true;
      //     return userStore.permissions.some(id => resourceId.includes(id));
      //   }
      //   if (!resourceId) return true;
      //   return userStore.permissions.includes(resourceId);
      // };

      // // 路由权限过滤
      // routes = filter(asyncRoutes, routeFilter);
      // routes = routes.filter(routeFilter);

      let routes = asyncRoutes;
      // TODO: 临时放开路由权限控制  end

      // 从路由获取菜单数据
      this.setRedirect(routes);
      const menus = getMenusFromRoutes(routes);
      this.setMenus(menus);
      // 多级路由转换为2级
      routes = flatMultiLevelRoutes(routes);

      return routes;
    },
    setRedirect(routes) {
      let list = [...routes];
      let routeParentMap = {};
      for (let i = 0; i < list.length; i++) {
        const route = list[i];
        if (route.children?.length) {
          let redirectRoute = route.children.find(item => !item.meta.hideMenu);
          if (redirectRoute) {
            route.redirect = route.path + '/' + redirectRoute.path;
            // 多级路由 拼接父级的path
            if (routeParentMap[route.name]) {
              route.redirect = routeParentMap[route.name]?.path + '/' + route.redirect;
            }
          }
          route.children.forEach(item => {
            routeParentMap[item.name] = route;
            list.push(item);
          });
        }
      }
    }
  }
});
