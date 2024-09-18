/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-17 16:48:50
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-17 17:04:41
 */
import { resultPageSuccess, resultSuccess } from '../utils';

const getAreaOrgList = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      id: `${index}`,
      orgName: '@cword(2,5)',
      schoolCount: '@integer(0,999)',
      hospitalCount: '@integer(0,999)',
      socialCount: '@integer(0,999)'
      // statusSt
    });
  }
  return result;
})();
export default [
  {
    url: '/basic-api/org/orgManager/getAreaOrg',
    timeout: 100,
    method: 'post',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, getAreaOrgList);
    }
  },
  {
    url: '/basic-api/org/orgManager/getAreaOrg1',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess()
  }
];
