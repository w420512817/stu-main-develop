/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-19 00:19:10
 */
import { resultPageSuccess, resultSuccess } from '../utils';
// import { Random } from 'mockjs';

const list = (() => {
  const result = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      planId: `${index + 1}`,
      planYear: '@date("yyyy")',
      planName: '@cword(2,8)',
      planMode: '1',
      'appType|1': ['视力筛查', '体检筛查', '龋齿筛查'],
      'type|1': ['普查', '抽查'],
      planRange: '@county(true)',
      startTime: '@date("yyyy-MM-dd")', // @date("yyyy-MM-dd HH:mm:ss")
      endTime: '@date("yyyy-MM-dd")', // @date("yyyy-MM-dd HH:mm:ss")
      'planStatus|1': ['待开始', '进行中', '已完成', '已超时'],
      creatorOrgName: '杭州教育局',
      'rate|0-100': 10,
      plan: '@cword(2,5)' + '计划',
      school: '杭一高'
    });
  }
  return result;
})();
const resultObj = {
  levelLoading: false,
  areaLevel: '1',
  nowLevel: '1',
  nowAreaId: '',
  levelData: [],
  schoolData: [],
  originAreaId: '',
  planId: '1',
  loading: false,
  planName: '@cword(2,8)',
  planYear: '@date("yyyy")',
  startTime: '@date("yyyy-MM-dd")',
  endTime: '@date("yyyy-MM-dd")',
  'planTypeLaber|1': ['普查', '抽查'],
  appGroupName: '@cword(2,8)',
  appGroupId: '',
  planRange: '@county(true)',
  'checkIndex|1': ['0', '1'],
  'checkNum|0-100': 10,
  'screenNum|10-999': 400,
  'control|1': ['0', '1'],
  'screenNum|1-99': 1,
  'gradeName|1-10': 1,
  screeningOptions: [
    {
      screeningTypeId: '1',
      screeningTypeName: '视力',
      itemList: [
        {
          screeningTypeId: '11',
          screeningItemName: '裸眼视力',
          selection: 1
        },
        {
          screeningTypeId: '12',
          screeningItemName: '矫正视力'
        }
      ]
    },
    {
      screeningTypeId: '2',
      screeningTypeName: '电脑验光',
      itemList: [
        {
          screeningTypeId: '21',
          screeningItemName: '球镜度数'
        },
        {
          screeningTypeId: '22',
          screeningItemName: '柱镜度数'
        },
        {
          screeningTypeId: '23',
          screeningItemName: '轴位'
        }
      ]
    },
    {
      screeningTypeId: '3',
      screeningTypeName: '其他',
      itemList: [
        {
          screeningTypeId: '31',
          screeningItemName: 'ok镜度数'
        }
      ]
    }
  ],
  detail: {},
  necessItem: '',
  selecItem: '',
  percentage: 50,
  dashboard: {},
  current: 1,
  size: 15,
  pageCount: 1
};
const dashboard = {
  'schoolCount|0-10': 10,
  'studentCount|50-100': 60,
  'rate|0-100': 10,
  'haveScreeningNum|0-999': 1,
  'onScreeningNum|0-999': 1,
  'notStartedScreeningNum|0-999': 1,
  'haveScreeningCount|0-999': 1,
  'notScreeningCount|0-999': 1
};
const levelDataList = (() => {
  const result = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      areaId: `${index}`,
      areaName: '@county(true)',
      'schoolCount|0-999': 1,
      'studentCount|0-999': 1,
      'rate|0-100': 1,
      orgName: '@cword(2,8)',
      statusLaber: '进行中',
      orgPropertyLaber: '独立学校',
      'prefx|1': ['小学', '初中'],
      schoolLevelLaber: '常规'
    });
  }
  return result;
})();
const getAppGroupList = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      appGroupId: `${index}`,
      appGroupName: ['视力筛查', '体检筛查', '龋齿筛查', '体测筛查'][index]
    });
  }
  return result;
})();
const schoolGradeList = (() => {
  const result = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      gradeId: `${index}`,
      'name|1': ['1年级', '2年级', '3年级', '4年级']
    });
  }
  return result;
})();
const classList = (() => {
  const result = [];
  for (let index = 0; index < 6; index++) {
    result.push({
      classId: `${index}`,
      className: '@cword(2,5)'
    });
  }
  return result;
})();
const getGradeClassList = (() => {
  const result = [];
  for (let index = 0; index < 6; index++) {
    result.push({
      id: `${index}`,
      gradeId: `${index}`,
      gradeName: ['1年级', '2年级', '3年级', '4年级', '5年级', '6年级'][index],
      classList
    });
  }
  return result;
})();
const getSchoolList = (() => {
  const result = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      orgId: `${index}`,
      orgName: '@cword(2,5)'
    });
  }
  return result;
})();
export default [
  {
    url: '/basic-api/base-screen/plan/getPlanList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    }
  },
  {
    url: '/basic-api/base-screen/plan/planInfo',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(resultObj);
    }
  },
  // 筛查概览
  {
    url: '/basic-api/base-screen/plan/getScreningRate',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(dashboard)
  },
  // 各地筛查进度
  {
    url: '/basic-api/base-screen/plan/getScreningRateInfoForArea',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(levelDataList)
  },
  {
    url: '/basic-api/base-screen/plan/getScreningRateInfoForRegion',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, levelDataList);
    }
  },
  {
    url: '/basic-api/base-screen/plan/add',
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess(resultObj);
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
  },
  {
    url: '/basic-api/base-config/appGroup/getAppGroupList',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(getAppGroupList)
  },
  {
    url: '/basic-api/org/plan/schoolGradeList',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(schoolGradeList)
  },
  {
    url: '/basic-api/org/plan/getGradeClassList',
    timeout: 100,
    method: 'get',
    response: () => resultSuccess(getGradeClassList)
  },
  {
    url: '/basic-api/base-config/application/getScreeningOpitons',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          screeningTypeId: '1',
          screeningTypeName: '视力',
          itemList: [
            {
              screeningTypeId: '11',
              screeningItemName: '裸眼视力'
            },
            {
              screeningTypeId: '12',
              screeningItemName: '矫正视力'
            }
          ]
        },
        {
          screeningTypeId: '2',
          screeningTypeName: '电脑验光',
          itemList: [
            {
              screeningTypeId: '21',
              screeningItemName: '球镜度数'
            },
            {
              screeningTypeId: '22',
              screeningItemName: '柱镜度数'
            },
            {
              screeningTypeId: '23',
              screeningItemName: '轴位'
            }
          ]
        },
        {
          screeningTypeId: '3',
          screeningTypeName: '其他',
          itemList: [
            {
              screeningTypeId: '31',
              screeningItemName: 'ok镜度数'
            }
          ]
        }
      ])
  },
  {
    url: '/basic-api/org/basicConfig/getAreaTree',
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        regionId: '1',
        regionName: '@county()'
      })
  },
  {
    url: '/basic-api/org/plan/getSchoolList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, getSchoolList);
    }
  },
  {
    url: '/basic-api/base-screen/plan/screeningNumber',
    timeout: 100,
    method: 'post',
    response: () => resultSuccess('@integer(0,999)')
  }
];
