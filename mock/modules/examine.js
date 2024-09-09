import { resultPageSuccess } from '../utils';
// import { Random } from 'mockjs';

const list = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      year: '@date("yyyy")',
      name: '@cword(2,8)',
      'appType|1': ['视力筛查', '体检筛查', '龋齿筛查'],
      'type|1': ['普查', '自查'],
      range: '@county(true)',
      startDate: '@date("yyyy-MM-dd")', // @date("yyyy-MM-dd HH:mm:ss")
      endDate: '@date("yyyy-MM-dd")', // @date("yyyy-MM-dd HH:mm:ss")
      'status|1': ['待开始', '进行中', '已完成', '已超时'],
      orgName: '杭州教育局',
      plan: '@cword(2,5)' + '计划',
      school: '杭一高'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/examine/planList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    }
  },
  {
    url: '/basic-api/examine/taskList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    }
  }
];
