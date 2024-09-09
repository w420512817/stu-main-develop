import { PageEnum } from '@common/enum/pageEnum';
import { transformRouteModules } from '../helper/routeHelper';

const modules = import.meta.glob('./modules/**/*.js', { eager: true });
const customRoutes = transformRouteModules(modules);

export const NOT_FOUND_NAME = 'NotFound';

export const NOT_FOUND_ROUTE = {
  path: '/:path(.*)*',
  name: 'NotFoundRoute'
  // redirect: { name: NOT_FOUND_NAME }
};

// 基础路由 无需验证权限
export const constantRoutes = [
  {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_HOME,
    meta: {
      title: 'Root'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@common/system-views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@common/system-views/redirect/index.vue'),
    meta: {
      title: 'redirect'
    }
  },
  {
    path: '/403',
    name: 'Nopermission403',
    component: () => import('@common/system-views/exception/Nopermission.vue'),
    props: { showBtn: false }
  }
];

// 需要验证权限
export const asyncRoutes = [...customRoutes];
