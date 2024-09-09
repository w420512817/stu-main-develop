import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center' : '/data-center';
const basic1 = isDevMode() ? '/data-center' : '/data-center';

const Api = {
  screenOverview: `${basic}/gov/dataScreen/physical/screenOverview`, // 筛查数据总览
  screenSituation: `${basic}/gov/dataScreen/physical/screenSituation`, // 筛查情况
  screenPrefix: `${basic}/gov/dataScreen/physical/screenPrefix`, // 各学段筛查情况
  realTimeData: `${basic}/gov/dataScreen/physical/realTimeData`, // 实时体测数据展示
  areaOutstanding: `${basic}/gov/dataScreen/physical/areaOutstanding`, // 优良情况
  sexOutstanding: `${basic}/gov/dataScreen/physical/sexOutstanding`, // 优秀率情况
  getMapData: `${basic}/gov/dataScreen/physical/mapData`, // 地图数据
  programWarning: `${basic1}/gov/dataScreen/physical/programWarning` // 预警数据
};

export function screenOverview(params) {
  return defHttp.get({ url: Api.screenOverview, params });
}
export function screenSituation(params) {
  return defHttp.get({ url: Api.screenSituation, params });
}
export function screenPrefix(params) {
  return defHttp.get({ url: Api.screenPrefix, params });
}
export function realTimeData(params) {
  return defHttp.get({ url: Api.realTimeData, params });
}
export function areaOutstanding(params) {
  return defHttp.get({ url: Api.areaOutstanding, params });
}
export function sexOutstanding(params) {
  return defHttp.get({ url: Api.sexOutstanding, params });
}
export function getMapData(params) {
  return defHttp.get({ url: Api.getMapData, params });
}
export function programWarning(params) {
  return defHttp.get({ url: Api.programWarning, params });
}
