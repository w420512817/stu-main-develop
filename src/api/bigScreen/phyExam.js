import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center' : '/data-center';

const Api = {
  getRegionPhysicalScreenRate: `${basic}/gov/dataScreen/physical/getRegionPhysicalScreenRate`, // 体检筛查情况
  getPrefixPhysicalScreen: `${basic}/gov/dataScreen/physical/getPrefixPhysicalScreen`, // 各学段筛查情况
  getScreenPrefixCountVO: `${basic}/gov/dataScreen/physical/getScreenPrefixCountVO`, // 各学段的上报人数和累计上报人数
  getRegionPhysicalScreen: `${basic}/gov/dataScreen/physical/getRegionPhysicalScreen`, // 获取全地区筛查数据展示
  getPhysicalSpineVO: `${basic}/gov/dataScreen/physical/getPhysicalSpineVO`, // 获取脊柱情况
  getPhysicalVaccine: `${basic}/gov/dataScreen/physical/getPhysicalVaccine`, // 获取疫苗接种情况
  getPhysicalFatVO: `${basic}/gov/dataScreen/physical/getPhysicalFatVO`, // 获取BMI值人数
  getBasePhysicalScreen: `${basic}/gov/dataScreen/physical/getBasePhysicalScreen`, // 获取体检大屏地图的基础信息
  getAbnormalResult: `${basic}/gov/dataScreen/physical/getAbnormalResult` // 获取体检地图数据
};

export function getRegionPhysicalScreenRate(params) {
  return defHttp.get({ url: Api.getRegionPhysicalScreenRate, params });
}
export function getPrefixPhysicalScreen(params) {
  return defHttp.get({ url: Api.getPrefixPhysicalScreen, params });
}
export function getScreenPrefixCountVO(params) {
  return defHttp.get({ url: Api.getScreenPrefixCountVO, params });
}
export function getRegionPhysicalScreen(params) {
  return defHttp.get({ url: Api.getRegionPhysicalScreen, params });
}
export function getPhysicalSpineVO(params) {
  return defHttp.get({ url: Api.getPhysicalSpineVO, params });
}
export function getPhysicalVaccine(params) {
  return defHttp.get({ url: Api.getPhysicalVaccine, params });
}
export function getPhysicalFatVO(params) {
  return defHttp.get({ url: Api.getPhysicalFatVO, params });
}
export function getBasePhysicalScreen(params) {
  return defHttp.get({ url: Api.getBasePhysicalScreen, params });
}
export function getAbnormalResult(params) {
  return defHttp.get({ url: Api.getAbnormalResult, params });
}
