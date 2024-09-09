import { resultPageSuccess } from '../utils';

const accountList = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      account: '@first',
      email: '@email',
      nickname: '@cname()',
      role: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '1'],
      'statusStr|1': ['关闭', '开启', '待确认', '异常']
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/accountList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, accountList);
    }
  }
];
