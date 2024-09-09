const temp = {
  path: '/verify',
  name: 'Verify',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/verify/transfer',
  meta: {
    icon: 'ph:stamp',
    title: '审核管理',
    orderNo: 13,
    resourceId: [3200, 2200]
  },
  children: [
    {
      path: 'transfer',
      name: 'Transfer',
      component: () => import('@/views/verify/transfer.vue'),
      meta: {
        title: '转学申请管理',
        resourceId: 3203
      }
    },
    {
      path: 'transfer-school',
      name: 'TransferSchool',
      component: () => import('@/views/verify/transfer.vue'),
      meta: {
        title: '转学申请',
        resourceId: 2201
      }
    },
    {
      path: 'transfer-in',
      name: 'TransferIn',
      component: () => import('@/views/verify/transferIn.vue'),
      meta: {
        title: '转入管理',
        resourceId: 3205
      }
    },
    {
      path: 'transfer-in-school',
      name: 'TransferInSchool',
      component: () => import('@/views/verify/transferIn.vue'),
      meta: {
        title: '转入管理',
        resourceId: 2202
      }
    },
    {
      path: 'studentApprove',
      name: 'StudentApprove',
      component: () => import('@/views/verify/studentApprove.vue'),
      meta: {
        title: '学生信息修改管理',
        resourceId: 3202
      }
    },
    {
      path: 'studentApprove-school',
      name: 'StudentApproveSchool',
      component: () => import('@/views/verify/studentApprove.vue'),
      meta: {
        title: '学生信息修改申请',
        resourceId: 2203
      }
    },
    {
      path: 'taskOpen',
      name: 'TaskOpen',
      component: () => import('@/views/verify/taskOpen.vue'),
      meta: {
        title: '任务开启管理',
        resourceId: 3201
      }
    },
    {
      path: 'task-open-school',
      name: 'taskOpenSchool',
      component: () => import('@/views/verify/taskOpen.vue'),
      meta: {
        title: '任务开启申请',
        resourceId: 2204
      }
    },
    {
      path: 'stu-data',
      name: 'StuData',
      component: () => import('@/views/verify/stuData.vue'),
      meta: {
        title: '数据修改管理',
        resourceId: 3204
      }
    },
    {
      path: 'stu-data-school',
      name: 'StuDataSchool',
      component: () => import('@/views/verify/stuData.vue'),
      meta: {
        title: '数据修改申请',
        resourceId: 2205
      }
    }
  ]
};

export default temp;
