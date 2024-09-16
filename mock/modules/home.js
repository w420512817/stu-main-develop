/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-16 18:06:12
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-16 23:31:27
 */
import { integer } from 'vue-types';
import { resultPageSuccess, resultSuccess } from '../utils';

const getScreenAreaTypeRateList = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      id: `${index}`,
      regionName: '@county()',
      'typeName|1': ['视力筛查', '体检筛查', '龋齿筛查', '体测筛查'],
      'typeId|1-4': 1,
      screenRate: '@float(0,0,2)',
      stdCount: '@integer(0,999)'
    });
  }
  return result;
})();
const cityScreenRateList = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      id: `${index}`,
      percent: '@float(0,0,2)',
      orgName: '@county()',
      areaName: '@county()'
    });
  }
  return result;
})();
const cityScreenCountList = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      id: `${index}`,
      percent: '@float(0,0,2)',
      orgName: '@county()',
      areaName: '@county()',
      count: '@integer(0,999)'
    });
  }
  return result;
})();
const prefixScreenCountList = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      prefixName: ['幼儿园', '小学', '初中', '高中'][index],
      maleCount: '@integer(100,999)',
      femaleCount: '@integer(100,999)'
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/data-center/homepage/getEdbScreenCount',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        screenCount: '@integer(0,999)',
        schoolCount: '@integer(0,999)',
        studentCount: '@integer(1000,9999)',
        planCount: '@integer(0,99)',
        endTaskCount: '@integer(0,99)'
      })
  },
  {
    url: '/basic-api/data-center/homepage/screeningComparison',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        poorVisionRate: '@float(0,0,2)',
        poorVisionDValue: '@float(0,0,2)',
        avgVision: '@float(0,0,2)',
        avgVisionDValue: '-@float(0,0,2)',
        avgDiopter: '@float(0,0,2)',
        avgDiopterDValue: '@float(0,0,2)',
        cariesRate: '@float(0,0,2)',
        cariesDValue: '@float(0,0,2)',
        dtCariesRate: '@float(0,0,2)',
        dtCariesDValue: '-@float(0,0,2)',
        ptCariesRate: '@float(0,0,2)',
        ptCariesDValue: '@float(0,0,2)',
        outstandingRate: '@float(0,0,2)',
        outstandingDValue: '@float(0,0,2)',
        goodRate: '@float(0,0,2)',
        goodDValue: '@float(0,0,2)',
        passRate: '@float(0,0,2)',
        passDValue: '@float(0,0,2)',
        fatRate: '@float(0,0,2)',
        fatDValue: '-@float(0,0,2)',
        malnutritionRate: '@float(0,0,2)',
        malnutritionDValue: '@float(0,0,2)',
        scoliosisRate: '@float(0,0,2)',
        scoliosisDValue: '-@float(0,0,2)'
      })
  },
  {
    url: '/basic-api/data-center/homepage/getScreenAreaTypeRate',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(getScreenAreaTypeRateList)
  },
  {
    url: '/basic-api/data-center/homepage/getScreeningTypeList',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        { screenTypeName: '视力', screenType: '1' },
        { screenTypeName: '龋齿', screenType: '2' },
        { screenTypeName: '体检', screenType: '3' },
        { screenTypeName: '体测', screenType: '4' }
      ])
  },
  {
    url: '/basic-api/data-center/homepage/cityScreenRate',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(cityScreenRateList)
  },
  {
    url: '/basic-api/data-center/homepage/cityScreenCount',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(cityScreenCountList)
  },
  {
    url: '/basic-api/data-center/homepage/prefixScreenCount',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(prefixScreenCountList)
  }
];
