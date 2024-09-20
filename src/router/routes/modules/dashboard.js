const dashboard = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/dashboard/overview',
  meta: {
    title: '健康系统',
    icon: 'icon-park-outline:workbench',
    hideChildrenInMenu: true,
    orderNo: 1,
    hideMenu: true
    // resourceId: 9002
  },
  children: [
    {
      path: 'overview',
      name: 'Overview',
      component: () => import('@/views/dashbord/index.vue'),
      meta: {
        hideBreadcrumb: true,
        title: '健康系统'
        // resourceId: 9002
      }
    }
  ]
};

export default dashboard;
