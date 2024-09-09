const exception = {
  path: '/exception',
  name: 'Exception',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/exception/403',
  meta: {
    title: '异常页',
    icon: 'ant-design:exception-outlined',
    orderNo: 65,
    hideMenu: true,
    hideBreadcrumb: true
  },
  children: [
    {
      path: '403',
      name: 'Nopermission',
      component: () => import('@common/system-views/exception/Nopermission.vue'),
      meta: {
        title: '异常页-403',
        hideBreadcrumb: true,
        hideTab: true
      }
    },
    {
      path: '404',
      name: 'NotFound',
      component: () => import('@common/system-views/exception/NotFound.vue'),
      meta: {
        title: '异常页-404',
        hideBreadcrumb: true,
        hideTab: true
      }
    },
    {
      path: '500',
      name: 'ServiceError',
      component: () => import('@common/system-views/exception/ServiceError.vue'),
      meta: {
        title: '异常页-500',
        hideBreadcrumb: true,
        hideTab: true
      }
    }
  ]
};

export default exception;
