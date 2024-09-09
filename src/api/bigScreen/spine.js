import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center' : '/data-center';
const basic1 = isDevMode() ? '/org' : '/org';
const spine = isDevMode() ? '/spine' : '/spine';

const Api = {
  unusualAgeCondition: `${basic}/spine/dataScreen/unusualAgeCondition`,
  realTimeUpCondition: `${basic}/spine/dataScreen/realTimeUpCondition`,
  shouldUpNum: `${basic}/spine/dataScreen/shouldUpNum`,
  prefxUpCondition: `${basic}/spine/dataScreen/prefxUpCondition`,
  spineScreenSexVO: `${basic}/spine/dataScreen/getSpineScreenSexVO`,
  spineScreenCurvatureVO: `${basic}/spine/dataScreen/getSpineScreenCurvatureVO`,
  spineScreenSugestionVO: `${basic}/spine/dataScreen/getSpineScreenSugestionVO`,
  cityPrefixResult: `${basic}/spine/dataScreen/getCityPrefixResult`,
  geoData: `${basic}/spine/dataScreen/getGeoData`,
  getGeoMap: `${basic1}/basicConfig/getGeoMap`,
  getScreenProgress: `${basic}/spine/dataScreen/getScreenProgress`,
  areaUpNum: `${basic}/spine/dataScreen/areaUpNum`,
  getLatestScreeningList: `${basic}/spine/dataScreen/getLatestScreeningList`,
  getSpineHomePrefixVO: `${basic}/spine/dataScreen/getSpineHomePrefixVO`, // 各学段上报情况统计
  printScreeningReport: `${spine}/report/printScreeningReport`, // 打印脊柱筛查报告
  getRegionScreeningCondition: `${spine}/screen/task/getRegionScreeningCondition` // 打印脊柱筛查报告
};

export function unusualAgeCondition(params) {
  return defHttp.get({ url: Api.unusualAgeCondition, params });
}
export function realTimeUpCondition(params) {
  return defHttp.get({ url: Api.realTimeUpCondition, params });
}
export function shouldUpNum(params) {
  return defHttp.get({ url: Api.shouldUpNum, params });
}
export function prefxUpCondition(params) {
  return defHttp.get({ url: Api.prefxUpCondition, params });
}
export function spineScreenSexVO(params) {
  return defHttp.get({ url: Api.spineScreenSexVO, params });
}
export function spineScreenCurvatureVO(params) {
  return defHttp.get({ url: Api.spineScreenCurvatureVO, params });
}
export function spineScreenSugestionVO(params) {
  return defHttp.get({ url: Api.spineScreenSugestionVO, params });
}
export function cityPrefixResult(params) {
  return defHttp.get({ url: Api.cityPrefixResult, params });
}
export function geoData(params) {
  return defHttp.get({ url: Api.geoData, params });
}
export function getGeoMap(params) {
  return defHttp.get({ url: Api.getGeoMap, params });
}
export function getScreenProgress(params) {
  return defHttp.get({ url: Api.getScreenProgress, params });
}
export function getAreaUpNum(params) {
  return defHttp.get({ url: Api.areaUpNum, params });
}
export function getLatestScreeningList(params) {
  return defHttp.get({ url: Api.getLatestScreeningList, params });
}

export function getPrefixCount(params) {
  return defHttp.get({
    url: Api.getSpineHomePrefixVO,
    params
  });
}

export function printScreeningReport(params) {
  return defHttp.get({ url: Api.printScreeningReport, params });
}

// 打印脊柱筛查报告(脱敏)
export const printScreeningReportWithMask = params =>
  defHttp.get({ url: `${spine}/report/printScreeningReportWithMask`, params });
