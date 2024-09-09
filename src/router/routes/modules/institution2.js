const institution = {
  path: '/institution',
  name: 'Institution',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/institution/region',
  meta: {
    icon: 'clarity:organization-line',
    title: '机构管理',
    orderNo: 2,
    resourceId: 9500
  },
  children: [
    {
      path: 'region',
      name: 'institutionRegion',
      component: () => import('@/views/institution2/index.vue'),
      meta: {
        title: '机构管理',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/institution2'
      }
    },
    {
      path: 'gov-detail',
      name: 'GovDetail',
      component: () => import('@/views/institution2/govDetail.vue'),
      meta: {
        activeMenu: '/institution/government-list',
        hideMenu: true,
        title: '查看政府机构',
        hideBreadcrumb: true
      }
    },
    {
      path: 'gov-modify',
      name: 'GovModify',
      component: () => import('@/views/institution2/govModify.vue'),
      meta: {
        activeMenu: '/institution/government-list',
        hideMenu: true,
        title: '修改政府机构',
        hideBreadcrumb: true
      }
    },
    {
      path: 'school-detail',
      name: 'SchoolDetail',
      component: () => import('@/views/institution2/schoolDetail.vue'),
      meta: {
        activeMenu: '/institution/government-list',
        hideMenu: true,
        title: '查看学校机构',
        hideBreadcrumb: true
      }
    },
    {
      path: 'school-modify',
      name: 'SchoolModify',
      component: () => import('@/views/institution2/schoolModify.vue'),
      meta: {
        activeMenu: '/institution/government-list',
        hideMenu: true,
        title: '修改学校机构',
        hideBreadcrumb: true
      }
    }
  ]
};

export default institution;
