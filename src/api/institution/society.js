import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org-qyx' : '/org';
const Api = {
  societyList: `${basic}/orgManager/getSocialList`,
  getDetail: `${basic}/orgManager/getSocialDetail` // 通过id获取医院详情
};

export function getsocietyList(params) {
  return defHttp.get({ url: Api.societyList, params });
}
export function getDetail(params) {
  return defHttp.get({ url: Api.getDetail, params });
}
