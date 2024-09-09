import { resultPageSuccess } from '../utils';

const reportList = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      year: '2021',
      name: '计划名字'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/config/reportList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, reportList);
    }
  }
];
