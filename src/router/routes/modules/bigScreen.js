const overview = {
  path: '/bigScreen',
  name: 'BigScreen ',
  redirect: '/bigScreen/synthesize',
  component: () => import('@/views/bigScreen/index.vue'),
  meta: {
    icon: 'iconoir:apple-imac-2021',
    title: '数据大屏',
    hideChildrenInMenu: true,
    orderNo: 20,
    resourceId: 9302
  },
  children: [
    {
      path: 'synthesize',
      name: 'synthesize',
      component: () => import('@/views/bigScreen/pages/synthesize/index.vue'),
      meta: {
        title: '总览',
        keepAlive: true,
        resourceId: 9414
      }
    },
    {
      path: 'vision',
      name: 'vision',
      component: () => import('@/views/bigScreen/pages/vision/index.vue'),
      meta: {
        title: '视力筛查',
        keepAlive: true,
        resourceId: 9410
      }
    },
    {
      path: 'cavity',
      name: 'cavity',
      component: () => import('@/views/bigScreen/pages/cavity/index.vue'),
      meta: {
        title: '龋齿筛查',
        keepAlive: true,
        resourceId: 9411
      }
    },
    {
      path: 'phyExam',
      name: 'phyExam',
      component: () => import('@/views/bigScreen/pages/phyExam/index.vue'),
      meta: {
        title: '学生体检',
        keepAlive: true,
        resourceId: 9412
      }
    },
    {
      path: 'phyTest',
      name: 'phyTest',
      component: () => import('@/views/bigScreen/pages/phyTest/index.vue'),
      meta: {
        title: '学生体测',
        keepAlive: true,
        resourceId: 9413
      }
    },
    {
      path: 'spine',
      name: 'spine',
      component: () => import('@/views/bigScreen/pages/spine/index.vue'),
      meta: {
        title: '脊柱筛查',
        keepAlive: true,
        resourceId: 9455
      }
    }
  ]
};

export default overview;
