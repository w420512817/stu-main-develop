import { resultPageSuccess } from '../utils';

const roleList = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      name: '@cname',
      remark: '@cword(5,50)'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/roleList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, roleList);
    }
  }
];
