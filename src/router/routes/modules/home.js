const dashboard = {
  path: '/homepage',
  name: 'Homepage',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/homepage/homeIndex',
  meta: {
    title: '首页',
    icon: 'icon-park-outline:workbench',
    hideChildrenInMenu: true,
    orderNo: 2,
    notNote: true,
    resourceId: 9001
  },
  children: [
    {
      path: 'homeIndex',
      name: 'HomeIndex',
      component: () => import('@/views/home/index.vue'),
      meta: {
        hideBreadcrumb: true,
        title: '首页',
        resourceId: 9001
      }
    }
  ]
};

export default dashboard;
