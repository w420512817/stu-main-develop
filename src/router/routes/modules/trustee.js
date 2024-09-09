const trustee = {
  path: '/trustee',
  name: 'Trustee',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/trustee/apply',
  meta: {
    title: '托管管理',
    icon: 'icon-park-twotone:people-safe',
    orderNo: 6,
    resourceId: 9363
  },
  children: [
    {
      path: 'apply',
      name: 'TrusteeApply',
      component: () => import('@/views/trustee/apply.vue'),
      meta: {
        title: '托管申请',
        keepAlive: true,
        resourceId: 9363
      }
    }
  ]
};

export default trustee;
