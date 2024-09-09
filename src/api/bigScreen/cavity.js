import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center-qyx' : '/data-center';

const Api = {
  govCariesScreenOverview: `${basic}/gov/dataScreen/caries/govCariesScreenOverview`, // 龋齿筛查数据总览
  govAreaCariesScreen: `${basic}/gov/dataScreen/caries/govAreaCariesScreen`, // 龋齿筛查情况
  getCariesPrefxScreenData: `${basic}/gov/dataScreen/caries/getCariesPrefxScreenData`, // 龋齿各学段筛查情况
  cariesRealTimeScreen: `${basic}/gov/dataScreen/caries/cariesRealTimeScreen`, // 龋齿实时口腔大屏展示
  govCariesCondition: `${basic}/gov/dataScreen/caries/govCariesCondition`, // 患龋率情况
  govDentalPeripheryCondition: `${basic}/gov/dataScreen/caries/govDentalPeripheryCondition`, // 牙周患病情况
  govAbnormalCaries: `${basic}/gov/dataScreen/caries/govAbnormalCaries`, // 口腔预警数据
  govAreaCariesMap: `${basic}/gov/dataScreen/caries/govAreaCariesMap` // 口地图警数据
};

export function govCariesScreenOverview(params) {
  return defHttp.get({ url: Api.govCariesScreenOverview, params });
}
export function govAreaCariesScreen(params) {
  return defHttp.get({ url: Api.govAreaCariesScreen, params });
}
export function getCariesPrefxScreenData(params) {
  return defHttp.get({ url: Api.getCariesPrefxScreenData, params });
}
export function cariesRealTimeScreen(params) {
  return defHttp.get({ url: Api.cariesRealTimeScreen, params });
}
export function govCariesCondition(params) {
  return defHttp.get({ url: Api.govCariesCondition, params });
}
export function govDentalPeripheryCondition(params) {
  return defHttp.get({ url: Api.govDentalPeripheryCondition, params });
}
export function govAbnormalCaries(params) {
  return defHttp.get({ url: Api.govAbnormalCaries, params });
}
export function govAreaCariesMap(params) {
  return defHttp.get({ url: Api.govAreaCariesMap, params });
}
