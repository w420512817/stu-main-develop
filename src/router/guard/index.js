/*
 * @Author: wangjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wangjq
 * @LastEditTime: 2024-10-15 17:16:17
 */
import { useUserStore, useRouteStore, useTabStore } from '@/store';
import { PageEnum } from '@common/enum/pageEnum';
import { getQuery } from '@common/utils/common';
import { NOT_FOUND_ROUTE, NOT_FOUND_NAME } from '@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whiteList = [LOGIN_PATH, '/redirect'];

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();

    const userStore = useUserStore();
    const routeStore = useRouteStore();

    if (!userStore.isLogin) {
      // You can access without permissions. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth || whiteList.includes(to.path)) {
        return next();
      }
      // redirect login page
      next({ path: LOGIN_PATH, replace: true, query: { redirect: to.fullPath } });
      return;
    }

    /**
     * 1. 从登录页跳转未找到页面 重定向为首页
     * 2. 登录状态主动跳转登录页 重定向为首页
     */
    if ((from.path === LOGIN_PATH && to.name === NOT_FOUND_NAME) || to.path === LOGIN_PATH) {
      return next(PageEnum.BASE_HOME);
    }

    if (routeStore.getIsDynamicAddedRoute) {
      return next();
    }

    try {
      await userStore.getUserInfoAction();
    } catch (error) {
      setTimeout(() => {
        window.$message?.error(error?.message || '获取用户信息失败！');
      }, 200);
      userStore.setToken('');
      return next({ path: LOGIN_PATH, replace: true, query: { redirect: to.fullPath } });
    }

    const routes = routeStore.generateRoutes();
    routes.forEach(route => {
      !router.hasRoute(route.name) && router.addRoute(route);
    });

    router.addRoute(NOT_FOUND_ROUTE);

    routeStore.setDynamicAddedRoute(true);

    const redirect = from.query.redirect || to.path;
    const [query, path] = getQuery(redirect);
    const nextData = to.path === path ? { ...to, replace: true } : { path, query };

    next(nextData);
  });

  router.afterEach(to => {
    if (to.path === PageEnum.BASE_LOGIN) {
      const userStore = useUserStore();
      const routeStore = useRouteStore();
      const tabStore = useTabStore();
      routeStore.resetState();
      userStore.resetState();
      tabStore.resetState();
    }
    window.$loadingBar?.finish();
  });

  router.onError(error => {
    window.$loadingBar?.error();
    console.log(error, '路由错误');
  });
}
