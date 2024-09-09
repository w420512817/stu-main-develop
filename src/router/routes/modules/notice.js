const notice = {
  path: '/notice',
  name: 'Notice',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/notice/receive',
  meta: {
    title: '通知管理',
    icon: 'fe:notice-active',
    orderNo: 12,
    resourceId: 9367
  },
  children: [
    {
      path: 'receive',
      name: 'receiveManage',
      component: () => import('@/views/notice/receive/index.vue'),
      meta: {
        title: '接收通知',
        keepAlive: true,
        resourceId: 9368
      }
    },
    {
      path: 'send',
      name: 'sendManage',
      component: () => import('@/views/notice/send/index.vue'),
      meta: {
        title: '发送通知',
        keepAlive: true,
        resourceId: 9372
      }
    },
    {
      path: 'send-modify',
      name: 'sendModify',
      component: () => import('@/views/notice/send/modify.vue'),
      meta: {
        activeMenu: '/notice/send',
        hideBreadcrumb: true,
        title: '通知信息',
        hideMenu: true,
        resourceId: [9373, 9376]
      }
    }
  ]
};

export default notice;
