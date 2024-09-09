import { resultPageSuccess } from '../utils';
import { Random } from 'mockjs';

const environmentList = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      name: '@cword(2,5)',
      number: /\d{3}/,
      schoolName: '@cword(5,10)',
      className: '@cword(5,10)',
      maleNum: Random.natural(1, 50),
      femaleNum: Random.natural(1, 50),
      time: '@datetime'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/dataMonitor/environmentList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, environmentList);
    }
  }
];
