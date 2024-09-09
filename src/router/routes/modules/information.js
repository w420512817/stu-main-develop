const information = {
  path: '/information',
  name: 'Information',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/information/school',
  meta: {
    title: '信息管理',
    icon: 'material-symbols:medical-information-outline-rounded',
    orderNo: 2,
    resourceId: 9303
  },
  children: [
    {
      path: 'school',
      name: 'SchoolInformation',
      component: () => import('@/views/information/school/index.vue'),
      meta: {
        title: '学校信息',
        keepAlive: true,
        resourceId: [9304, 9305]
      }
    },
    // TODO:未知
    {
      path: 'associated-school',
      name: 'AssociatedSchools',
      component: () => import('@/views/information/AssociatedSchools/index.vue'),
      meta: {
        title: '关联学校',
        keepAlive: true,
        hideMenu: true,
        // activeMenu: '/information/society-list',
        resourceId: [9356, 9360]
      }
    },
    {
      path: 'society-list',
      name: 'SocietyList',
      component: () => import('@/views/information/society/list.vue'),
      meta: {
        title: '社会机构信息',
        keepAlive: true,
        resourceId: 9359
      }
    },
    {
      path: 'society-detail',
      name: 'SocietyDetail',
      component: () => import('@/views/information/society/detail.vue'),
      meta: {
        activeMenu: '/information/society-list',
        hideMenu: true,
        title: '机构详情',
        hideBreadcrumb: true,
        keepAlive: true,
        resourceId: 9362
      }
    },
    {
      path: 'hosptial-list',
      name: 'HosptialList',
      component: () => import('@/views/information/hosptial/list.vue'),
      meta: {
        title: '医院信息',
        keepAlive: true,
        resourceId: 9355
      }
    },
    {
      path: 'hosptial-detail',
      name: 'HosptialDetail',
      component: () => import('@/views/information/hosptial/detail.vue'),
      meta: {
        activeMenu: '/information/hosptial-list',
        hideMenu: true,
        title: '医院详情',
        hideBreadcrumb: true,
        keepAlive: true,
        resourceId: 9358
      }
    },
    {
      path: 'school-modify',
      name: 'SchoolInformationModify',
      component: () => import('@/views/information/school/modify.vue'),
      meta: {
        title: '修改学校',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/information/school',
        resourceId: 9306
      }
    },
    {
      path: 'school-detail',
      name: 'SchoolInformationDetail',
      component: () => import('@/views/information/school/detail.vue'),
      meta: {
        title: '学校详情',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/information/school',
        resourceId: 9306
      }
    },
    {
      path: 'building',
      name: 'BuildingInformation',
      component: () => import('@/views/information/building/index.vue'),
      meta: {
        title: '教学楼信息',
        keepAlive: true,
        resourceId: 9307
      }
    },
    {
      path: 'building-school',
      name: 'BuildingSchoolInformationDetail',
      component: () => import('@/views/information/school/detail.vue'),
      meta: {
        title: '学校详情',
        keepAlive: true,
        hideMenu: true,
        activeMenu: '/information/building',
        resourceId: 9306
      }
    },
    {
      path: 'floor',
      name: 'FloorInformation',
      component: () => import('@/views/information/floor/index.vue'),
      meta: {
        title: '楼层信息',
        keepAlive: true,
        resourceId: 9313
      }
    },
    {
      path: 'classroom',
      name: 'ClassroomInformation',
      component: () => import('@/views/information/classroom/index.vue'),
      meta: {
        title: '教室信息',
        keepAlive: true,
        resourceId: 9319
      }
    },
    {
      path: 'classroom-detail',
      name: 'ClassroomDetail',
      component: () => import('@/views/information/classroom/detail.vue'),
      meta: {
        title: '教室环境监测信息',
        keepAlive: true,
        hideMenu: true,
        hideBreadcrumb: true,
        resourceId: 9324
      }
    },
    {
      path: 'classroom-modify',
      name: 'ClassroomModify',
      component: () => import('@/views/information/classroom/modify.vue'),
      meta: {
        title: '新增教室',
        keepAlive: true,
        hideMenu: true,
        hideBreadcrumb: true,
        resourceId: 9322
      }
    },
    {
      path: 'class',
      name: 'ClassInformation',
      component: () => import('@/views/information/class/index.vue'),
      meta: {
        title: '班级信息',
        resourceId: 9326
      }
    },
    // 医院班级信息
    {
      path: 'class-hospital',
      name: 'ClassInformationHospital',
      component: () => import('@/views/information/class/index.vue'),
      meta: {
        title: '班级管理',
        hideMenu: true,
        activeMenu: '/information/school',
        resourceId: 19307
      }
    },
    // 医院管理班级信息
    {
      path: 'class-modify-hospital',
      name: 'ModifyClassInformationHospital',
      component: () => import('@/views/information/class/modify.vue'),
      meta: {
        title: '管理班级信息',
        hideMenu: true,
        activeMenu: '/information/school',
        resourceId: 19330
      }
    },
    {
      path: 'class-modify',
      name: 'ModifyClassInformation',
      component: () => import('@/views/information/class/modify.vue'),
      meta: {
        title: '管理班级信息',
        hideMenu: true,
        activeMenu: '/information/class',
        resourceId: 9330
      }
    },
    {
      path: 'teacher',
      name: 'TeacherInformation',
      component: () => import('@/views/information/teacher/index.vue'),
      meta: {
        title: '教师信息',
        resourceId: 9332
      }
    },
    {
      path: 'teacher-modify',
      name: 'ModifyTeacherInformation',
      component: () => import('@/views/information/teacher/modify.vue'),
      meta: {
        title: '新增教师',
        hideMenu: true,
        activeMenu: '/information/teacher',
        resourceId: 9335
      }
    },
    {
      path: 'teacher-detail',
      name: 'TeacherInformationDetail',
      component: () => import('@/views/information/teacher/detail.vue'),
      meta: {
        title: '教师档案',
        hideMenu: true,
        activeMenu: '/information/teacher',
        keepAlive: true,
        resourceId: 9336
      }
    },
    {
      path: 'student',
      name: 'StudentInformation',
      component: () => import('@/views/information/student/index.vue'),
      meta: {
        title: '学生信息',
        resourceId: 9339,
        keepAlive: true,
        activeMenu: '/information/student'
      }
    },
    {
      path: 'student-detail',
      name: 'StudentInformationDetail',
      component: () => import('@/views/information/student/detail.vue'),
      meta: {
        title: '学生档案',
        hideMenu: true,
        activeMenu: '/information/student',
        resourceId: 9344
      }
    },
    {
      path: 'student-modify',
      name: 'ModifyStudentInformation',
      component: () => import('@/views/information/student/modify.vue'),
      meta: {
        title: '新增学生',
        hideMenu: true,
        activeMenu: '/information/student',
        resourceId: [9342, 9345]
      }
    },
    {
      path: 'student-transfer-in',
      name: 'StudentTransferIn',
      component: () => import('@/views/information/student/transferIn.vue'),
      meta: {
        title: '学生转入名单',
        hideMenu: true,
        activeMenu: '/information/student',
        resourceId: 9351
      }
    },
    {
      path: 'student-transfer-out',
      name: 'StudentTransferOut',
      component: () => import('@/views/information/student/transferOut.vue'),
      meta: {
        title: '学生转出名单',
        hideMenu: true,
        activeMenu: '/information/student',
        resourceId: 9350
      }
    },
    {
      path: 'student-report',
      name: 'StudentReport',
      component: () => import('@/views/information/student/report.vue'),
      meta: {
        title: '健康报告',
        hideMenu: true,
        activeMenu: '/information/student',
        keepAlive: true,
        resourceId: 9347
      }
    }
  ]
};

export default information;
