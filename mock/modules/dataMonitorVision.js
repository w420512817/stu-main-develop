/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-19 14:25:54
 */
import { resultPageSuccess, resultSuccess } from '../utils';
import mapjson from '../map.json';
const basic = process.env.NODE_ENV === 'development' ? 'data-center-qyx' : 'data-center';

const planListData = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      planId: `${index}`,
      planName: '@cword(2,5)',
      time: '@datetime'
    });
  }
  return result;
})();
const batchContrastData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      'completionCount|0-9999': 1000,
      'planName|1': [`20@integer(10,20)第一次上报`, `20@integer(10,20)第二次上报`, '陕西省视力筛查计划'],
      time: '@datetime'
    });
  }
  return result;
})();
const prefixOverviewData = (() => {
  const result = [];
  for (let index = 1; index < 5; index++) {
    result.push({
      prefix: `${index}`,
      'completeRate|0.1-10': 0,
      stdCount: '@integer(0,999)',
      completeCount: '@integer(0,999)',
      time: '@datetime'
    });
  }
  return result;
})();
const prefixRateData = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      prefixName: ['幼儿园', '小学', '初中', '高中'][index],
      'myopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();
const prefixlevelData = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      prefixName: ['幼儿园', '小学', '初中', '高中'][index],
      'highMyopiaRate|0.1-10': 0,
      'mediumMyopiaRate|0.1-10': 0,
      'lowMyopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();
const myopiaRateData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      areaId: `${index}`,
      areaName: '@city()',
      'myopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();
const myopiaLevelData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      'highMyopiaRate|0.1-10': 0,
      'mediumMyopiaRate|0.1-10': 0,
      'lowMyopiaRate|0.1-10': 0,
      areaId: `${index}`,
      areaName: '@city()',
      time: '@datetime'
    });
  }
  return result;
})();
const childMyopiaData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      areaName: '@city()',
      'completionRate|0.1-10': 0,
      'myopiaRate|0.1-10': 0,
      'boyMyopiaRate|0.1-10': 0,
      'girlMyopiaRate|0.1-10': 0,
      'highMyopiaRate|0.1-10': 0,
      'mediumMyopiaRate|0.1-10': 0,
      'lowMyopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();
const hyperopiaRateData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      // 'gradeName|1': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      'gradeName|1': [1, 2, 3, 4, 5, 6],
      'hyperopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();

export default [
  {
    url: `/basic-api/map-res/json/610000.json`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(mapjson)
  },
  // {
  //   url: `/basic-api/base-screen/plan/getPlanList`,
  //   timeout: 100,
  //   method: 'get',
  //   response: () => resultSuccess(planListData)
  // },
  {
    url: `/basic-api/${basic}/screenVision/overview`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        stdCount: '@integer(100,999)',
        completionCount: '@integer(100,999)',
        'completionRate|0.1-10': 0
      })
  },
  {
    url: `/basic-api/${basic}/screenVision/batchContrast`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(batchContrastData)
  },
  {
    url: `/basic-api/${basic}/screenVision/prefixOverview`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(prefixOverviewData)
  },
  {
    url: `/basic-api/${basic}/screenVision/myopiaRate`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(myopiaRateData)
  },
  {
    url: `/basic-api/${basic}/screenVision/currentReport`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        completionCount: '@integer(100,999)',
        kindergartenOrgNum: '@integer(100,999)',
        primaryOrgNum: '@integer(100,999)',
        juniorOrgNum: '@integer(100,999)',
        highOrgNum: '@integer(100,999)',
        childMyopia: childMyopiaData
      })
  },
  {
    url: `/basic-api/${basic}/screenVision/prefixRate`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(prefixRateData)
  },
  {
    url: `/basic-api/${basic}/screenVision/myopiaLevel`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(myopiaLevelData)
  },
  {
    url: `/basic-api/${basic}/screenVision/prefixlevel`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(prefixlevelData)
  },
  {
    url: `/basic-api/${basic}/screenVision/hyperopiaRate`,
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(hyperopiaRateData)
  }
];
