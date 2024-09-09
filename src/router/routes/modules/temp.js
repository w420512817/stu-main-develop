const temp = {
  path: '/template',
  name: 'Template',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: '/template/template-table-list',
  meta: {
    envMode: ['development', 'test_local'],
    icon: 'carbon:template',
    title: 'template',
    orderNo: 60
    // resourceId: 1000
  },
  children: [
    {
      path: 'template-table-list',
      name: 'TemplateTableList',
      component: () => import('@/views/template/TableList.vue'),
      meta: {
        title: '列表示例',
        keepAlive: true
        // hideTab: true
      }
    },
    {
      path: 'qform示例',
      name: 'TemplateForm',
      component: () => import('@/views/template/Form.vue'),
      meta: {
        title: 'qform示例',
        keepAlive: true
        // hideTab: true
      }
    },
    {
      path: 'qlist示例',
      name: 'TemplateList',
      component: () => import('@/views/template/List.vue'),
      meta: {
        title: 'qlist示例',
        keepAlive: true
        // hideTab: true
      }
    },
    {
      path: 'template-feature',
      name: 'TemplateFeature',
      component: () => import('@/views/template/Feature.vue'),
      meta: {
        title: '功能测试',
        keepAlive: true
      }
    },
    {
      path: 'vuejs',
      name: 'VueJs',
      component: () => import('@common/system-views/iframe/index.vue'),
      meta: {
        frameSrc: 'https://staging-cn.vuejs.org/guide/introduction.html',
        title: 'Vue3文档',
        keepAlive: true
      }
    },
    {
      path: 'naive-ui',
      name: 'NaiveUI',
      component: () => import('@common/system-views/iframe/index.vue'),
      meta: {
        frameSrc: 'https://www.naiveui.com/zh-CN/os-theme/docs/installation',
        title: 'Naive UI文档',
        keepAlive: true
      }
    },
    {
      path: 'https://cn.vitejs.dev/guide/',
      meta: {
        title: 'Vite3文档(外链)'
      }
    }
  ]
};

export default temp;
