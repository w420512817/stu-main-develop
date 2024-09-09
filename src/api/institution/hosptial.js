import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org-qyx' : '/org';
const Api = {
  hosptialList: `${basic}/orgManager/getHospitalList`,
  getDetail: `${basic}/info/manage/getHospitalDetail`
};

export function getHosptialList(params) {
  return defHttp.get({ url: Api.hosptialList, params });
}
export function getDetail(params) {
  return defHttp.post({ url: Api.getDetail, params });
}
