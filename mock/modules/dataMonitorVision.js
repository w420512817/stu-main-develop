/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-20 17:24:50
 */
import { resultPageSuccess, resultSuccess } from '../utils';
// const basic = process.env.NODE_ENV === 'development' ? 'data-center' : 'data-center';

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

export default [
  {
    url: `/basic-api/base-screen/plan/getPlanList`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        current: '1',
        pages: '1',
        records: [
          {
            appGroupId: '1054206868520704',
            appGroupName: '视力筛查应用组',
            appVersion: 3,
            applicationId: '1037894827663104',
            areaId: null,
            areaLevel: null,
            checkIndex: null,
            checkNum: null,
            control: null,
            createTime: null,
            creator: '1280675499532032',
            creatorName: '安徽教育局',
            creatorOrg: '1280674354847488',
            creatorOrgName: '安徽教育局',
            endDate: null,
            endTime: '2024-06-30',
            gradeId: null,
            gradeName: null,
            planId: '1392642585485056',
            planMode: 1,
            planModeLaber: '计划模式',
            planName: '第一次视力筛查',
            planRange: '安徽省',
            planRangeLaber: null,
            planStatus: 4,
            planStatusLaber: '已超时',
            planType: 101,
            planTypeLaber: '普查',
            planYear: 2024,
            provinceId: null,
            rate: 0,
            region: null,
            remark: null,
            schoolId: null,
            schoolName: null,
            screenNum: 66654,
            screenType: null,
            screeningCondition: '[]',
            screeningConditionList: null,
            screeningIndex: 0,
            screeningOptions: null,
            startTime: '2024-05-22',
            studentNum: null
          },
          {
            appGroupId: '1054206868520704',
            appGroupName: '视力筛查应用组',
            appVersion: 3,
            applicationId: '1037894827663104',
            areaId: null,
            areaLevel: null,
            checkIndex: null,
            checkNum: null,
            control: null,
            createTime: null,
            creator: '1280675499532032',
            creatorName: '安徽教育局',
            creatorOrg: '1280674354847488',
            creatorOrgName: '安徽教育局',
            endDate: null,
            endTime: '2024-03-31',
            gradeId: null,
            gradeName: null,
            planId: '1283048021704448',
            planMode: 1,
            planModeLaber: '计划模式',
            planName: '安徽省视力筛查计划',
            planRange: '安徽省',
            planRangeLaber: null,
            planStatus: 1,
            planStatusLaber: '已完成',
            planType: 101,
            planTypeLaber: '普查',
            planYear: 2023,
            provinceId: null,
            rate: 100,
            region: null,
            remark: null,
            schoolId: null,
            schoolName: null,
            screenNum: 65154,
            screenType: null,
            screeningCondition: '[]',
            screeningConditionList: null,
            screeningIndex: 0,
            screeningOptions: null,
            startTime: '2023-12-18',
            studentNum: null
          }
        ],
        size: '20',
        total: '5'
      })
  },
  {
    url: `/basic-api/data-center/screenVision/overview`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        completionCount: 50077,
        completionRate: 0.7513,
        stdCount: 66654,
        unionBoyMyopiaRate: 0.7968,
        unionGirlMyopiaRate: 0.796,
        unionHighMyopiaRate: 0.6799,
        unionLowMyopiaRate: 0.0453,
        unionMediumMyopiaRate: 0.0711,
        unionMyopiaRate: 0.7964
      })
  },
  {
    url: `/basic-api/data-center/screenVision/batchContrast`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          completionCount: 6750,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 13618,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 4500,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 16881,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 4500,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 4500,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 5250,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 4500,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 5404,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        },
        {
          completionCount: 5250,
          createTime: '2023-12-18 18:07:53',
          planName: '安徽省视力筛查计划'
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/prefixOverview`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          completeCount: 2807,
          completeRate: 0.9996,
          prefix: 0,
          stdCount: 2808
        },
        {
          completeCount: 49344,
          completeRate: 1.1003,
          prefix: 2,
          stdCount: 44844
        },
        {
          completeCount: 19002,
          completeRate: 1,
          prefix: 3,
          stdCount: 19002
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/myopiaRate`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          areaId: '1',
          areaName: '全省',
          myopiaRate: 0.7955
        },
        {
          areaId: '340100',
          areaName: '合肥市',
          myopiaRate: 0.8001
        },
        {
          areaId: '340200',
          areaName: '芜湖市',
          myopiaRate: 0.7968
        },
        {
          areaId: '340300',
          areaName: '蚌埠市',
          myopiaRate: 0.8032
        },
        {
          areaId: '340400',
          areaName: '淮南市',
          myopiaRate: 0.7975
        },
        {
          areaId: '340500',
          areaName: '马鞍山市',
          myopiaRate: 0.8028
        },
        {
          areaId: '340600',
          areaName: '淮北市',
          myopiaRate: 0.7796
        },
        {
          areaId: '340700',
          areaName: '铜陵市',
          myopiaRate: 0.7975
        },
        {
          areaId: '340800',
          areaName: '安庆市',
          myopiaRate: 0.7911
        },
        {
          areaId: '341000',
          areaName: '黄山市',
          myopiaRate: 0.7897
        },
        {
          areaId: '341100',
          areaName: '滁州市',
          myopiaRate: 0.7967
        },
        {
          areaId: '341200',
          areaName: '阜阳市',
          myopiaRate: 0.7457
        },
        {
          areaId: '341300',
          areaName: '宿州市',
          myopiaRate: 0.7873
        },
        {
          areaId: '341500',
          areaName: '六安市',
          myopiaRate: 0.7997
        },
        {
          areaId: '341600',
          areaName: '亳州市',
          myopiaRate: 0.7265
        },
        {
          areaId: '341700',
          areaName: '池州市',
          myopiaRate: 0.7751
        },
        {
          areaId: '341800',
          areaName: '宣城市',
          myopiaRate: 0.7239
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/currentReport`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess({
        childMyopia: [
          {
            areaId: '340100',
            areaName: '合肥市',
            boyMyopiaRate: 0.8007,
            completionRate: 0.9996,
            girlMyopiaRate: 0.7996,
            highMyopiaRate: 0.677,
            lowMyopiaRate: 0.0478,
            mediumMyopiaRate: 0.0752,
            myopiaRate: 0.8001
          },
          {
            areaId: '340200',
            areaName: '芜湖市',
            boyMyopiaRate: 0.8039,
            completionRate: 0.6682,
            girlMyopiaRate: 0.7896,
            highMyopiaRate: 0.6883,
            lowMyopiaRate: 0.0455,
            mediumMyopiaRate: 0.0628,
            myopiaRate: 0.7968
          },
          {
            areaId: '340300',
            areaName: '蚌埠市',
            boyMyopiaRate: 0.8042,
            completionRate: 0.6618,
            girlMyopiaRate: 0.8022,
            highMyopiaRate: 0.6793,
            lowMyopiaRate: 0.0436,
            mediumMyopiaRate: 0.0799,
            myopiaRate: 0.8032
          },
          {
            areaId: '340400',
            areaName: '淮南市',
            boyMyopiaRate: 0.7986,
            completionRate: 0.7148,
            girlMyopiaRate: 0.7964,
            highMyopiaRate: 0.6735,
            lowMyopiaRate: 0.0515,
            mediumMyopiaRate: 0.0724,
            myopiaRate: 0.7975
          },
          {
            areaId: '340500',
            areaName: '马鞍山市',
            boyMyopiaRate: 0.8029,
            completionRate: 0.6591,
            girlMyopiaRate: 0.8028,
            highMyopiaRate: 0.6893,
            lowMyopiaRate: 0.0427,
            mediumMyopiaRate: 0.0708,
            myopiaRate: 0.8028
          },
          {
            areaId: '340600',
            areaName: '淮北市',
            boyMyopiaRate: 0.7843,
            completionRate: 0.6611,
            girlMyopiaRate: 0.7748,
            highMyopiaRate: 0.6689,
            lowMyopiaRate: 0.0484,
            mediumMyopiaRate: 0.0622,
            myopiaRate: 0.7796
          },
          {
            areaId: '340700',
            areaName: '铜陵市',
            boyMyopiaRate: 0.811,
            completionRate: 0.6651,
            girlMyopiaRate: 0.7835,
            highMyopiaRate: 0.6789,
            lowMyopiaRate: 0.0454,
            mediumMyopiaRate: 0.0731,
            myopiaRate: 0.7975
          },
          {
            areaId: '340800',
            areaName: '安庆市',
            boyMyopiaRate: 0.7766,
            completionRate: 0.6686,
            girlMyopiaRate: 0.8054,
            highMyopiaRate: 0.6743,
            lowMyopiaRate: 0.0458,
            mediumMyopiaRate: 0.0709,
            myopiaRate: 0.7911
          },
          {
            areaId: '341000',
            areaName: '黄山市',
            boyMyopiaRate: 0.7916,
            completionRate: 0.6702,
            girlMyopiaRate: 0.7879,
            highMyopiaRate: 0.6783,
            lowMyopiaRate: 0.0381,
            mediumMyopiaRate: 0.0732,
            myopiaRate: 0.7897
          },
          {
            areaId: '341100',
            areaName: '滁州市',
            boyMyopiaRate: 0.7948,
            completionRate: 0.8101,
            girlMyopiaRate: 0.7988,
            highMyopiaRate: 0.6836,
            lowMyopiaRate: 0.0437,
            mediumMyopiaRate: 0.0693,
            myopiaRate: 0.7967
          },
          {
            areaId: '341200',
            areaName: '阜阳市',
            boyMyopiaRate: 0.7654,
            completionRate: 0.8231,
            girlMyopiaRate: 0.6987,
            highMyopiaRate: 0.6388,
            lowMyopiaRate: 0.0577,
            mediumMyopiaRate: 0.0592,
            myopiaRate: 0.829
          },
          {
            areaId: '341300',
            areaName: '宿州市',
            boyMyopiaRate: 0.7386,
            completionRate: 0.698,
            girlMyopiaRate: 0.7291,
            highMyopiaRate: 0.7148,
            lowMyopiaRate: 0.0427,
            mediumMyopiaRate: 0.0682,
            myopiaRate: 0.732
          }
        ],
        completionCount: 50077,
        highOrgNum: 0,
        juniorOrgNum: 28,
        kindergartenOrgNum: 0,
        primaryOrgNum: 40,
        unionHighMyopiaRate: 0.6799,
        unionLowMyopiaRate: 0.0453,
        unionMediumMyopiaRate: 0.0711,
        unionMyopiaRate: 0.7964
      })
  },
  {
    url: `/basic-api/data-center/screenVision/prefixRate`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          myopiaRate: 0.8061,
          prefix: 0,
          prefixName: '无'
        },
        {
          myopiaRate: 0.7962,
          prefix: 2,
          prefixName: '小学'
        },
        {
          myopiaRate: 0.7921,
          prefix: 3,
          prefixName: '初中'
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/myopiaLevel`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          areaId: '1',
          areaName: '全省',
          highMyopiaRate: 0.6799,
          lowMyopiaRate: 0.0453,
          mediumMyopiaRate: 0.0711
        },
        {
          areaId: '340100',
          areaName: '合肥市',
          highMyopiaRate: 0.677,
          lowMyopiaRate: 0.0478,
          mediumMyopiaRate: 0.0752
        },
        {
          areaId: '340200',
          areaName: '芜湖市',
          highMyopiaRate: 0.6883,
          lowMyopiaRate: 0.0455,
          mediumMyopiaRate: 0.0628
        },
        {
          areaId: '340300',
          areaName: '蚌埠市',
          highMyopiaRate: 0.6793,
          lowMyopiaRate: 0.0436,
          mediumMyopiaRate: 0.0799
        },
        {
          areaId: '340400',
          areaName: '淮南市',
          highMyopiaRate: 0.6735,
          lowMyopiaRate: 0.0515,
          mediumMyopiaRate: 0.0724
        },
        {
          areaId: '340500',
          areaName: '马鞍山市',
          highMyopiaRate: 0.6893,
          lowMyopiaRate: 0.0427,
          mediumMyopiaRate: 0.0708
        },
        {
          areaId: '340600',
          areaName: '淮北市',
          highMyopiaRate: 0.6689,
          lowMyopiaRate: 0.0484,
          mediumMyopiaRate: 0.0622
        },
        {
          areaId: '340700',
          areaName: '铜陵市',
          highMyopiaRate: 0.6789,
          lowMyopiaRate: 0.0454,
          mediumMyopiaRate: 0.0731
        },
        {
          areaId: '340800',
          areaName: '安庆市',
          highMyopiaRate: 0.6743,
          lowMyopiaRate: 0.0458,
          mediumMyopiaRate: 0.0709
        },
        {
          areaId: '341000',
          areaName: '黄山市',
          highMyopiaRate: 0.6783,
          lowMyopiaRate: 0.0381,
          mediumMyopiaRate: 0.0732
        },
        {
          areaId: '341100',
          areaName: '滁州市',
          highMyopiaRate: 0.6836,
          lowMyopiaRate: 0.0437,
          mediumMyopiaRate: 0.0693
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/prefixlevel`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          highMyopiaRate: 0.6989,
          lowMyopiaRate: 0.0413,
          mediumMyopiaRate: 0.0659,
          prefix: 0,
          prefixName: '无'
        },
        {
          highMyopiaRate: 0.6785,
          lowMyopiaRate: 0.0459,
          mediumMyopiaRate: 0.0719,
          prefix: 2,
          prefixName: '小学'
        },
        {
          highMyopiaRate: 0.6794,
          lowMyopiaRate: 0.0446,
          mediumMyopiaRate: 0.0699,
          prefix: 3,
          prefixName: '初中'
        }
      ])
  },
  {
    url: `/basic-api/data-center/screenVision/hyperopiaRate`,
    timeout: 100,
    method: 'get',
    response: () =>
      resultSuccess([
        {
          gradeId: '921830381248271',
          gradeName: '一年级',
          hyperopiaRate: 0.2936
        },
        {
          gradeId: '921830381248272',
          gradeName: '二年级',
          hyperopiaRate: 0.2922
        },
        {
          gradeId: '921830381248273',
          gradeName: '三年级',
          hyperopiaRate: 0.2921
        },

        {
          gradeId: '921830381248274',
          gradeName: '四年级',
          hyperopiaRate: 0.2877
        },

        {
          gradeId: '921830381248275',
          gradeName: '五年级',
          hyperopiaRate: 0.3013
        },

        {
          gradeId: '921830381248276',
          gradeName: '六年级',
          hyperopiaRate: 0.2974
        },

        {
          gradeId: '921830381248277',
          gradeName: '初一',
          hyperopiaRate: 0.2884
        },
        {
          gradeId: '921830381248278',
          gradeName: '初二',
          hyperopiaRate: 0.2921
        },
        {
          gradeId: '921830381248279',
          gradeName: '初三',
          hyperopiaRate: 0.2946
        }
      ])
  }
];
