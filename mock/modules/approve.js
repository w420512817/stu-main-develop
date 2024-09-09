import { resultPageSuccess } from '../utils';

const approveList = (() => {
  const result = [];
  for (let index = 0; index < 100; index++) {
    result.push({
      id: `${index}`,
      type: '更改姓名',
      content: '@cword(10,20)',
      studentName: '@cname()',
      'status|1': ['1', '2', '3'],
      'statusStr|1': ['已通过', '待审核', '已驳回'],
      timer: '@datetime'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/approveList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, approveList);
    }
  }
];
