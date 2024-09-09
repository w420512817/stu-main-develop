import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getHosptialList: `${basic}/info/manage/getGroupHospitalList`,
  getDetail: `${basic}/info/manage/getHospitalDetail`
};

export function getHosptialList(params) {
  return defHttp.get({
    url: Api.getHosptialList,
    params
  });
}
export function getDetail(params) {
  return defHttp.post({
    url: Api.getDetail,
    params
  });
}
