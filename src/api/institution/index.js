import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org-qyx' : '/org';
const Api = {
  getCityList: `${basic}/orgManager/getCityList`,
  getAreaList: `${basic}/orgManager/getAreaList`,
  exportSocialList: `${basic}/orgManager/exportSocialList`, // 社会机构列表导出
  exportHospitalList: `${basic}/orgManager/exportHospitalList`, // 医院列表导出
  exportSchoolList: `${basic}/orgManager/exportSchoolList` // 学校列表导出
};

export function getCityList(params) {
  return defHttp.get({ url: Api.getCityList, params });
}
export function getAreaList(params) {
  return defHttp.get({ url: Api.getAreaList, params });
}
export function exportSocialList(params) {
  return defHttp.get({ url: Api.exportSocialList, params, responseType: 'blob' }, { isReturnNativeResponse: true });
}
export function exportHospitalList(params) {
  return defHttp.get({ url: Api.exportHospitalList, params, responseType: 'blob' }, { isReturnNativeResponse: true });
}
export function exportSchoolList(params) {
  return defHttp.get({ url: Api.exportSchoolList, params, responseType: 'blob' }, { isReturnNativeResponse: true });
}
