const temp = {
  path: '/test',
  name: 'Test',
  component: () => import('@/layouts/BasicLayout/index.vue'),
  redirect: window.origin + '/vision/',
  meta: {
    hideChildrenInMenu: true,
    icon: 'carbon:template',
    title: '视力应用',
    orderNo: 2.5
  }
};

export default temp;
