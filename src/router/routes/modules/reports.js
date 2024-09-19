/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-12 14:47:42
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-19 14:35:05
 */
const reports = {
  path: '/reports',
  name: 'Reports',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/reports/report-city',
  meta: {
    title: '报告管理',
    icon: 'icon-park-outline:workbench',
    orderNo: 4
  },
  children: [
    {
      path: 'report-city',
      name: 'reportCity',
      component: () => import('@/views/report/index.vue'),
      meta: {
        title: '报告选择',
        keepAlive: true
      }
    }
    // {
    //   path: 'report-district',
    //   name: 'reportDistrict',
    //   component: () => import('@/views/report/index.vue'),
    //   meta: {
    //     title: '区报告',
    //     keepAlive: true
    //   }
    // },
    // {
    //   path: 'report-school',
    //   name: 'reportSchool',
    //   component: () => import('@/views/report/index.vue'),
    //   meta: {
    //     title: '学校报告',
    //     keepAlive: true
    //   }
    // }
  ]
};
export default reports;
