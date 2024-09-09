import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';

const Api = {
  getManagedList: `/managed/list`,
  getTrusteeList: `${basic}/orgTrusteeship/getTrusteeshipApplyListByOrgId`,
  getOrgTrusteeshipStatus: `${basic}/orgTrusteeship/getOrgTrusteeshipStatus`,
  updateTrusteeshipByIdAndStatus: `${basic}/orgTrusteeship/updateTrusteeshipByIdAndStatus`
};

export function getManagedList(params) {
  return defHttp.get({
    url: Api.getManagedList,
    params
  });
}

export function getTrusteeList(params) {
  return defHttp.get({
    url: Api.getTrusteeList,
    params
  });
}
export function getOrgTrusteeshipStatus(params) {
  return defHttp.get({
    url: Api.getOrgTrusteeshipStatus,
    params
  });
}
export function updateTrusteeshipByIdAndStatus(params) {
  return defHttp.get({
    url: Api.updateTrusteeshipByIdAndStatus,
    params
  });
}
