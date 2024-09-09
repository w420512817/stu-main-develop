import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center-qyx' : '/data-center';
const basic1 = isDevMode() ? '/data-center-qyx' : '/data-center';
const basic2 = isDevMode() ? '/data-center-qyx' : '/data-center';

const Api = {
  govDataOverview: `${basic1}/gov/dataScreen/govDataOverview`, // 筛查数据总览
  getAreaWarningNumVO: `${basic1}/gov/dataScreen/getAreaWarningNumVO`, // 预警总览
  getRegionBaseVO: `${basic}/gov/dataScreen/getRegionBaseVO`, // 筛查数据实时展示
  getScreenPrefixCountVO: `${basic}/gov/dataScreen/getScreenPrefixCountVO`, // 各学段的上报人数和累计上报人数
  getRegionRate: `${basic}/gov/dataScreen/getRegionRate`, // 筛查数据概览
  getBaseScreen: `${basic}/gov/dataScreen/getBaseScreen`, // 获取头部综合数据
  govAreaMap: `${basic1}/gov/dataScreen/govAreaMap`, // 获取地图数据
  screenSituation: `${basic2}/gov/dataScreen/main/screenSituation` // 筛查数据情况对比
};

export function govDataOverview(params) {
  return defHttp.get({ url: Api.govDataOverview, params });
}
export function getAreaWarningNumVO(params) {
  return defHttp.get({ url: Api.getAreaWarningNumVO, params });
}
export function getRegionBaseVO(params) {
  return defHttp.get({ url: Api.getRegionBaseVO, params });
}
export function getScreenPrefixCountVO(params) {
  return defHttp.get({ url: Api.getScreenPrefixCountVO, params });
}
export function getRegionRate(params) {
  return defHttp.get({ url: Api.getRegionRate, params });
}
export function getBaseScreen(params) {
  return defHttp.get({ url: Api.getBaseScreen, params });
}
export function govAreaMap(params) {
  return defHttp.get({ url: Api.govAreaMap, params });
}
export function screenSituation(params) {
  return defHttp.get({ url: Api.screenSituation, params });
}
