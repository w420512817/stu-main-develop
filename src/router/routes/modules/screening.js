/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-12 14:47:42
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-20 10:01:15
 */
const examine = {
  path: '/examine',
  name: 'Examine',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/examine/plan-manage',
  meta: {
    title: '筛查管理',
    icon: 'icon-park-outline:workbench',
    orderNo: 3
  },
  children: [
    {
      path: 'plan-manage',
      name: 'planManage',
      component: () => import('@common/system-views/examine/plan/index.vue'),
      meta: {
        title: '计划管理',
        keepAlive: true
      }
    },
    {
      path: 'add-plan',
      name: 'addPlan',
      component: () => import('@common/system-views/examine/plan/addPlan.vue'),
      meta: {
        title: '新增计划',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/examine/plan-manage'
      }
    },
    {
      path: 'edit-plan',
      name: 'editPlan',
      component: () => import('@common/system-views/examine/plan/addPlan.vue'),
      meta: {
        title: '修改计划',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/examine/plan-manage'
      }
    },
    {
      path: 'plan-detail',
      name: 'planDetail',
      component: () => import('@common/system-views/examine/plan/detail.vue'),
      meta: {
        title: '计划详情',
        hideMenu: true,
        keepAlive: true,
        activeMenu: '/examine/plan-manage'
      }
    },
    {
      path: 'school-permission',
      name: 'schoolPermission',
      component: () => import('@common/system-views/examine/plan/schoolPermission.vue'),
      meta: {
        title: '学校审批',
        keepAlive: true,
        hideMenu: true
      }
    }
  ]
};
export default examine;
