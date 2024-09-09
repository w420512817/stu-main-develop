import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center' : '/data-center';
const basic1 = isDevMode() ? '/data-center' : '/data-center';

const Api = {
  baseInfo: `${basic1}/homepage/baseInfo`,
  overView: `${basic1}/homepage/overView`,
  rank: `${basic}/homepage/rank`,
  getScreeningTypeList: `${basic}/homepage/getScreeningTypeList`,
  noticeList: `${basic}/homepage/NoticeList`,
  clickCount: `${basic}/homepage/clickCount`,
  commonFunction: `${basic}/homepage/commonFunction`,
  planVO: `${basic1}/homepage/getPlanVO`,
  classYearAbnormalRate: `${basic}/homepage/classYearAbnormalRate`,
  planGradeList: `${basic}/homepage/getPlanGradeList`,
  classAbnormalRate: `${basic}/homepage/classAbnormalRate`,
  backLog: `${basic1}/homepage/backLog`
};

export function baseInfo(params) {
  return defHttp.get({
    url: Api.baseInfo,
    params
  });
}

export function overView(params) {
  return defHttp.get({
    url: Api.overView,
    params
  });
}

export function rank(params) {
  return defHttp.get({
    url: Api.rank,
    params
  });
}

export function getScreeningTypeList(params) {
  return defHttp.get({
    url: Api.getScreeningTypeList,
    params
  });
}

export function noticeList(params) {
  return defHttp.get({
    url: Api.noticeList,
    params
  });
}

export function clickCount(params) {
  return defHttp.post(
    {
      url: Api.clickCount,
      params
    },
    { isTransformResponse: false }
  );
}

export function commonFunction(params) {
  return defHttp.get({
    url: Api.commonFunction,
    params
  });
}

export function planVO(params) {
  return defHttp.get({
    url: Api.planVO,
    params
  });
}

export function classYearAbnormalRate(params) {
  return defHttp.get({
    url: Api.classYearAbnormalRate,
    params
  });
}

export function planGradeList(params) {
  return defHttp.get({
    url: Api.planGradeList,
    params
  });
}

export function classAbnormalRate(params) {
  return defHttp.get({
    url: Api.classAbnormalRate,
    params
  });
}

export function backLog(params) {
  return defHttp.get({
    url: Api.backLog,
    params
  });
}
