/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-14 16:32:24
 */
import { resultPageSuccess, resultSuccess } from '../utils';

const govDataOverviewData = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      appType: index + 1,
      'percent|0.1-10': 0,
      'screenCount|100-999': 100,
      'totalCount|1000-9999': 1000,
      name: '@cword(2,5)',
      schoolName: '@cword(5,10)',
      time: '@datetime'
    });
  }
  return result;
})();
const getAreaWarningNumVOData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      'warningNum|100-999': 100,
      warningName: '@cword(2,5)',
      warningArea: '@city()',
      'warningTypeName|1': ['视力筛查', '龋齿筛查', '学生体检', '学生体测'],
      time: '@datetime'
    });
  }
  return result;
})();
const getRegionBaseVOData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      city: '@city()',
      allCount: '@integer(0,999)',
      'myopiaRate|0.1-10': 0,
      'cariesRate|0.1-10': 0,
      'outstandingRate|0.1-10': 0,
      'normalRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();
const getScreenPrefixCountVOData = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      city: '@city()',
      prefixName: ['幼儿园', '小学', '初中', '高中'][index],
      screenCount: '@integer(0,999)',
      time: '@datetime'
    });
  }
  return result;
})();
const myopiaVOListData = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      city: '@city()',
      'myopiaRate|0.1-10': 0,
      'lowMyopiaRate|0.1-10': 0,
      'mediumMyopiaRate|0.1-10': 0,
      'highMyopiaRate|0.1-10': 0,
      time: '@datetime'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/govDataOverview',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(govDataOverviewData)
  },
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/getAreaWarningNumVO',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(getAreaWarningNumVOData)
  },
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/getBaseScreen',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        'allCount|0-999': 100,
        'visionCount|0-999': 100,
        'cariesCount|0-999': 100,
        'examCount|0-999': 100,
        'testCount|0-999': 100,
        time: '@datetime'
      })
  },
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/getRegionBaseVO',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(getRegionBaseVOData)
  },
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/getScreenPrefixCountVO',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        list: getScreenPrefixCountVOData,
        'allScreenCount|0-999': 1000
      })
  },
  {
    url: '/basic-api/data-center-qyx/gov/dataScreen/getRegionRate',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        myopiaVOList: myopiaVOListData
      })
  }
];
