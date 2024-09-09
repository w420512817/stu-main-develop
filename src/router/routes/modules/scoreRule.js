const scoreRule = {
  path: '/scoreRule',
  name: 'ScoreRule',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/scoreRule/index',
  meta: {
    title: '评分规则',
    icon: 'icon-park-outline:adjustment',
    hideChildrenInMenu: true,
    orderNo: 10,
    resourceId: 9397
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      component: () => import('@/views/scoreRule/index.vue'),
      meta: {
        hideBreadcrumb: true,
        title: '评分规则',
        resourceId: 9397
      }
    }
  ]
};

export default scoreRule;
