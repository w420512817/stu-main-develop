import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org-qyx' : '/org';
const Api = {
  // school
  schoolList: `${basic}/orgManager/getSchoolList`,
  getSchoolDetail: `${basic}/getSchoolDetail`, // 仅文本显示，不编辑
  eduListVO: `${basic}/eduSelectBox`,
  associateSchoolPage: `${basic}/organization/associateSchoolPage` // 关联学校分页
};

export function getSchoolList(params) {
  return defHttp.get({ url: Api.schoolList, params });
}
export function getSchoolDetail(params) {
  return defHttp.post({ url: Api.getSchoolDetail, params });
}
export function eduListVO(params) {
  return defHttp.get({ url: Api.eduListVO, params });
}
export function associateSchoolPage(params) {
  return defHttp.post({ url: Api.associateSchoolPage, params });
}
