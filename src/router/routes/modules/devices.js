const hardware = {
  path: '/devices',
  name: 'Devices',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/devices/medicine-manage',
  meta: {
    title: '设备管理',
    icon: 'maki:hardware',
    orderNo: 5,
    resourceId: 9390
  },
  children: [
    {
      path: 'medicine-manage',
      name: 'medicineManage',
      component: () => import('@/views/devices/medicine/index.vue'),
      meta: {
        title: '医疗器械管理',
        keepAlive: true,
        resourceId: 9390
      }
    }
  ]
};

export default hardware;
