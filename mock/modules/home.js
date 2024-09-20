/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-16 18:06:12
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-16 23:31:27
 */
import { resultSuccess } from '../utils';

export default [
  {
    url: '/basic-api/data-center/homepage/getEdbScreenCount',
    timeout: 300,
    method: 'get',
    response: () =>
      resultSuccess({
        endTaskCount: '69',
        planCount: '3',
        schoolCount: 73,
        screenCount: '198903',
        studentCount: '66654'
      })
  },
  {
    url: '/basic-api/data-center/homepage/screeningComparison',
    timeout: 500,
    method: 'get',
    response: () =>
      resultSuccess({
        avgDiopter: -1.98,
        avgDiopterDValue: 0.48,
        avgVision: 4.55,
        avgVisionDValue: -0.2999999999999998,
        cariesDValue: null,
        cariesRate: null,
        dtCariesDValue: null,
        dtCariesRate: null,
        fatDValue: null,
        fatRate: 0,
        goodDValue: null,
        goodRate: null,
        lastAvgDiopter: -2.46,
        lastAvgVision: 4.85,
        lastCariesRate: null,
        lastDtCariesRate: null,
        lastFatRate: null,
        lastGoodRate: null,
        lastMalnutritionRate: null,
        lastOutstandingRate: null,
        lastPassRate: null,
        lastPoorVisionRate: 0.5,
        lastPtCariesRate: null,
        lastScoliosisRate: null,
        malnutritionDValue: null,
        malnutritionRate: 0,
        outstandingDValue: null,
        outstandingRate: null,
        passDValue: null,
        passRate: null,
        poorVisionDValue: 0.07140000000000002,
        poorVisionRate: 0.5714,
        ptCariesDValue: null,
        ptCariesRate: null,
        scoliosisDValue: null,
        scoliosisRate: 0
      })
  },
  {
    url: '/basic-api/data-center/homepage/getScreenAreaTypeRate',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          allCount: '1500',
          regionId: '610100',
          regionName: '合肥市',
          screenRate: 0.006,
          stdCount: '9',
          typeId: 1,
          typeName: '视力筛查'
        }
      ])
  },
  {
    url: '/basic-api/data-center/homepage/getScreeningTypeList',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        { screenTypeName: '视力筛查', screenType: '1' },
        { screenTypeName: '龋齿筛查', screenType: '2' },
        { screenTypeName: '体检筛查', screenType: '3' },
        { screenTypeName: '体测筛查', screenType: '4' }
      ])
  },
  {
    url: '/basic-api/data-center/homepage/cityScreenRate',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          areaName: '合肥市',
          percent: 0.93
        },
        {
          areaName: '‌淮北市',
          percent: 0.95
        },
        {
          areaName: '‌亳州市',
          percent: 0.96
        },
        {
          areaName: '宿州市',
          percent: 0.92
        },
        {
          areaName: '蚌埠市',
          percent: 0.91
        },
        {
          areaName: '阜阳市',
          percent: 0.93
        },
        {
          areaName: '‌淮南市',
          percent: 0.99
        },
        {
          areaName: '滁州市',
          percent: 0.91
        },
        {
          areaName: '六安市',
          percent: 0.84
        },
        {
          areaName: '马鞍山市',
          percent: 0.97
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/cityScreenCount',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          areaName: '合肥市',
          count: 13618
        },
        {
          areaName: '‌淮北市',
          count: 4500
        },
        {
          areaName: '‌亳州市',
          count: 4500
        },
        {
          areaName: '宿州市',
          count: 5404
        },
        {
          areaName: '蚌埠市',
          count: 6750
        },
        {
          areaName: '阜阳市',
          count: 5250
        },
        {
          areaName: '‌淮南市',
          count: 4500
        },
        {
          areaName: '滁州市',
          count: 5250
        },
        {
          areaName: '六安市',
          count: 4500
        },
        {
          areaName: '马鞍山市',
          count: 16882
        }
      ])
  },
  {
    url: '/basic-api/data-center/homepage/prefixScreenCount',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          femaleCount: 0.1382,
          maleCount: 0.1426,
          prefixName: '无'
        },
        {
          femaleCount: 1.723,
          maleCount: 1.7229,
          prefixName: '小学'
        },
        {
          femaleCount: 0.6384,
          maleCount: 0.6427,
          prefixName: '初中'
        }
      ])
  }
];
