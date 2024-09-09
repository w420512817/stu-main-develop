import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic1 = isDevMode() ? '/data-center' : '/data-center';
const basic2 = isDevMode() ? '/data-center' : '/data-center';

const Api = {
  getEdbScreenCount: `${basic1}/homepage/getEdbScreenCount`, //  基础信息
  screeningComparison: `${basic2}/homepage/screeningComparison`, //  各项筛查情况对比
  getScreenAreaTypeRate: `${basic1}/homepage/getScreenAreaTypeRate`, //  各地市筛查完成情况
  getScreeningTypeList: `${basic2}/homepage/getScreeningTypeList`, //  筛查类型下拉框
  cityScreenRate: `${basic2}/homepage/cityScreenRate`, //  政府首页--各地市筛查率
  schoolScreenRate: `${basic2}/homepage/schoolScreenRate`, //  政府首页--各学校筛查率
  cityScreenCount: `${basic2}/homepage/cityScreenCount`, //  政府首页--各地市筛查人数统计
  prefixScreenCount: `${basic2}/homepage/prefixScreenCount` //  政府首页--各学段筛查人数统计
};

export function getEdbScreenCount() {
  return defHttp.get({ url: Api.getEdbScreenCount });
}
export function screeningComparison(params) {
  return defHttp.get({ url: Api.screeningComparison, params });
}
export function getScreenAreaTypeRate() {
  return defHttp.get({ url: Api.getScreenAreaTypeRate });
}
export function getScreeningTypeList(params) {
  return defHttp.get({ url: Api.getScreeningTypeList, params });
}
export function cityScreenRate(params) {
  return defHttp.get({ url: Api.cityScreenRate, params });
}
export function schoolScreenRate(params) {
  return defHttp.get({ url: Api.schoolScreenRate, params });
}
export function cityScreenCount(params) {
  return defHttp.get({ url: Api.cityScreenCount, params });
}
export function prefixScreenCount(params) {
  return defHttp.get({ url: Api.prefixScreenCount, params });
}
