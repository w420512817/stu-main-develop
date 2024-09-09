const systemManage = {
  path: '/systemManage',
  name: 'SystemManage',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/systemManage/account',
  meta: {
    icon: 'majesticons:settings-cog-line',
    title: '系统管理',
    orderNo: 13,
    resourceId: 9378
  },
  children: [
    {
      path: 'account',
      name: 'accountManage',
      component: () => import('@/views/systemManage/account/index.vue'),
      meta: {
        title: '账号管理',
        keepAlive: true,
        resourceId: 9379
      }
    },
    {
      path: 'role',
      name: 'roleManage',
      component: () => import('@/views/systemManage/role/index.vue'),
      meta: {
        title: '角色管理',
        keepAlive: true,
        resourceId: 9385
      }
    }
  ]
};

export default systemManage;
