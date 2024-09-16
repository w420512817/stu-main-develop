import { useUserStore, useRouteStore, useTabStore } from '@/store';
import { PageEnum } from '@common/enum/pageEnum';
// import { getQuery } from '@common/utils/common';
import { NOT_FOUND_ROUTE, NOT_FOUND_NAME } from '@/router/routes';
// import { decodeByBase64 } from '@common/utils/common/cipher';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whiteList = ['/redirect', '/403'];

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    window.$loadingBar?.start();

    const userStore = useUserStore();
    const routeStore = useRouteStore();

    if (to.meta.ignoreAuth || whiteList.includes(to.path)) {
      return next();
    }

    // if (!userStore.isLogin) {
    //   // You can access without permissions. You need to set the routing meta.ignoreAuth to true
    //   if (!userStore.customerId && !to.query.customerId) {
    //     return next({ path: '/403', replace: true });
    //   } else {
    //     // redirect login page
    //     // next({ path: LOGIN_PATH, replace: true, query: { redirect: to.fullPath } });
    //     window.location.href = `${LOGIN_PATH}/#/${userStore.customerId || to.query.customerId}/login`;
    //     return;
    //   }
    // }

    /**
     * 1. 从登录页跳转未找到页面 重定向为首页
     * 2. 登录状态主动跳转登录页 重定向为首页
     */
    // if ((from.name === 'Login' && to.name === NOT_FOUND_NAME) || to.name === 'Login') {
    //   return next(PageEnum.BASE_HOME);
    // }

    const query = Object.assign({}, to.query, { customerId: userStore.customerId });

    // if (!to.query.customerId) {
    //   next({ ...to, query });
    //   return;
    // }

    if (routeStore.getIsDynamicAddedRoute) {
      return next();
    }

    // try {
    //   await userStore.getUserInfoAction();
    // } catch (error) {
    //   setTimeout(() => {
    //     window.$message?.error(error?.message || '获取用户信息失败！');
    //   }, 200);
    //   userStore.setToken('');
    //   window.location.href = `${LOGIN_PATH}/#/${userStore.customerId}/login`;
    //   return;
    //   // return next({ path: LOGIN_PATH, replace: true, query: { redirect: to.fullPath } });
    // }

    const routes = routeStore.generateRoutes();
    routes.forEach(route => {
      !router.hasRoute(route.name) && router.addRoute(route);
    });

    // 路由找不到默认进到菜单第一个 （404体验不好）
    NOT_FOUND_ROUTE.redirect = routeStore.menus?.[0]?.redirect || routeStore.menus?.[0]?.path;
    router.addRoute(NOT_FOUND_ROUTE);

    routeStore.setDynamicAddedRoute(true);

    // const redirect = from.query.redirect || to.path;
    // const [query, path] = getQuery(redirect);
    // const nextData = to.path === path ? { ...to, replace: true } : { path, query };

    next({ ...to, query });
  });

  router.afterEach(to => {
    if (to.name === 'Login') {
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
