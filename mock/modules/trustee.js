import { resultPageSuccess } from '../utils';

const list = (() => {
  const result = [];
  for (let index = 0; index < 100; index++) {
    result.push({
      id: `${index}`,
      name: ['泰顺育才小学', '泰顺中心小学'][Math.round(Math.random())],
      region: '@county(true)',
      'type|1': ['学校', '医院'],
      remain: '@natural(100)',
      planDate: '@date',
      actualDate: '@date',
      reason: '@cword(10,20)',
      submit: '@cname()',
      handle: '@cname()',
      auth: '@first'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/managed/list',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    }
  }
];
