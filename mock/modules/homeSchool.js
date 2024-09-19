/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-16 18:06:12
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-16 23:31:27
 */
import { resultSuccess } from '../utils';

export default [
  {
    url: '/basic-api/data-center/homepage/baseInfo',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess({
        completedPlanCount: 1,
        completedTaskCount: 1,
        deviceCount: 2,
        totalCount: 4513,
        validCount: 4506
      });
    }
  },
  {
    url: '/basic-api/data-center/homepage/overView',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess({
        classCount: 30,
        classroomCount: 0,
        gradeCount: 6,
        schoolCount: 0,
        scrennerCount: 0,
        studentCount: 1500,
        teacherCount: 0
      });
    }
  },
  {
    url: '/basic-api/data-center/homepage/commonFunction',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          clickTime: '1',
          menuId: '/information/student',
          menuName: '学生信息'
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/NoticeList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          noticeId: '1396810324909824',
          noticeState: 0,
          noticeType: '政府通知',
          time: '2024-05-27 11:37:52',
          title: '近视防控流调通知'
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/backLog',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          backLog: '您有3个计划需要创建任务',
          jumpType: 1,
          type: 1,
          typeName: '视力筛查'
        },
        {
          backLog: '您有1个计划需要创建任务',
          jumpType: 1,
          type: 2,
          typeName: '龋齿筛查'
        },
        {
          backLog: '您有2个任务需要完成',
          jumpType: 2,
          type: 1,
          typeName: '视力筛查'
        },
        {
          backLog: '您有2个任务需要完成',
          jumpType: 2,
          type: 3,
          typeName: '体检筛查'
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/getPlanVO',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess({
        cariesVO: null,
        myopiaVO: {
          highMyopiaRate: 0.6706,
          lowMyopiaRate: 0.0506,
          manMyopiaRate: 0.7833,
          mediumMyopiaRate: 0.0717,
          myopiaRate: 0.793,
          noMyopiaRate: 0.2069,
          womanMyopiaRate: 0.8024
        },
        physicalObesityVO: null,
        physicalTestVO: null
      });
    }
  },
  {
    url: '/basic-api/data-center/homepage/classYearAbnormalRate',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          abnormalManNum: 203,
          abnormalManRate: 0.7778,
          abnormalNum: 427,
          abnormalRate: 0.7952,
          abnormalWomanNum: 224,
          abnormalWomanRate: 0.8116,
          gradeId: 1550507791,
          gradeName: '一年级',
          upManNum: 261,
          upNum: 537,
          upWomanNum: 276
        },
        {
          abnormalManNum: 217,
          abnormalManRate: 0.8127,
          abnormalNum: 388,
          abnormalRate: 0.7984,
          abnormalWomanNum: 171,
          abnormalWomanRate: 0.7808,
          gradeId: 1550507792,
          gradeName: '二年级',
          upManNum: 267,
          upNum: 486,
          upWomanNum: 219
        },
        {
          abnormalManNum: 192,
          abnormalManRate: 0.8101,
          abnormalNum: 402,
          abnormalRate: 0.8024,
          abnormalWomanNum: 210,
          abnormalWomanRate: 0.7955,
          gradeId: 1550507793,
          gradeName: '三年级',
          upManNum: 237,
          upNum: 501,
          upWomanNum: 264
        },
        {
          abnormalManNum: 189,
          abnormalManRate: 0.7683,
          abnormalNum: 398,
          abnormalRate: 0.7897,
          abnormalWomanNum: 209,
          abnormalWomanRate: 0.8101,
          gradeId: 1550507794,
          gradeName: '四年级',
          upManNum: 246,
          upNum: 504,
          upWomanNum: 258
        },
        {
          abnormalManNum: 187,
          abnormalManRate: 0.7602,
          abnormalNum: 392,
          abnormalRate: 0.7686,
          abnormalWomanNum: 205,
          abnormalWomanRate: 0.7765,
          gradeId: 1550507795,
          gradeName: '五年级',
          upManNum: 246,
          upNum: 510,
          upWomanNum: 264
        },
        {
          abnormalManNum: 187,
          abnormalManRate: 0.7695,
          abnormalNum: 403,
          abnormalRate: 0.8044,
          abnormalWomanNum: 216,
          abnormalWomanRate: 0.8372,
          gradeId: 1550507796,
          gradeName: '六年级',
          upManNum: 243,
          upNum: 501,
          upWomanNum: 258
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/classAbnormalRate',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          abnormalManNum: 47,
          abnormalManRate: 0.746,
          abnormalNum: 79,
          abnormalRate: 0.7745,
          abnormalWomanNum: 32,
          abnormalWomanRate: 0.8205,
          classId: '1282974992858880',
          className: '一班',
          upManNum: 63,
          upNum: 102,
          upWomanNum: 39
        },
        {
          abnormalManNum: 30,
          abnormalManRate: 0.7692,
          abnormalNum: 80,
          abnormalRate: 0.7843,
          abnormalWomanNum: 50,
          abnormalWomanRate: 0.7937,
          classId: '1282974992867072',
          className: '二班',
          upManNum: 39,
          upNum: 102,
          upWomanNum: 63
        },
        {
          abnormalManNum: 34,
          abnormalManRate: 0.8095,
          abnormalNum: 89,
          abnormalRate: 0.8241,
          abnormalWomanNum: 55,
          abnormalWomanRate: 0.8333,
          classId: '1282974992875264',
          className: '三班',
          upManNum: 42,
          upNum: 108,
          upWomanNum: 66
        },
        {
          abnormalManNum: 59,
          abnormalManRate: 0.8194,
          abnormalNum: 92,
          abnormalRate: 0.7863,
          abnormalWomanNum: 33,
          abnormalWomanRate: 0.7333,
          classId: '1282974992875265',
          className: '四班',
          upManNum: 72,
          upNum: 117,
          upWomanNum: 45
        },
        {
          abnormalManNum: 33,
          abnormalManRate: 0.7333,
          abnormalNum: 87,
          abnormalRate: 0.8056,
          abnormalWomanNum: 54,
          abnormalWomanRate: 0.8571,
          classId: '1282974992883456',
          className: '五班',
          upManNum: 45,
          upNum: 108,
          upWomanNum: 63
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/getPlanGradeList',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          gradeId: '921830381248271',
          gradeName: '一年级'
        },
        {
          gradeId: '921830381248272',
          gradeName: '二年级'
        },
        {
          gradeId: '921830381248273',
          gradeName: '三年级'
        },
        {
          gradeId: '921830381248274',
          gradeName: '四年级'
        },
        {
          gradeId: '921830381248275',
          gradeName: '五年级'
        },
        {
          gradeId: '921830381248276',
          gradeName: '六年级'
        }
      ]);
    }
  },
  {
    url: '/basic-api/data-center/homepage/rank',
    timeout: 300,
    method: 'get',
    response: () => {
      return resultSuccess([
        {
          name: '六年级',
          validCount: 750,
          validRate: 1
        },
        {
          name: '五年级',
          validCount: 750,
          validRate: 1
        },
        {
          name: '一年级',
          validCount: 750,
          validRate: 1
        },
        {
          name: '二年级',
          validCount: 750,
          validRate: 1
        },
        {
          name: '三年级',
          validCount: 750,
          validRate: 1
        }
      ]);
    }
  }
];
