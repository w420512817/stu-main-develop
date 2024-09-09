import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getsocietyList: `${basic}/info/manage/getGroupSocialList`,
  getDetail: `${basic}/orgManager/getSocialDetail`
};

export function getsocietyList(params) {
  return defHttp.get({
    url: Api.getsocietyList,
    params
  });
}
export function getDetail(params) {
  return defHttp.get({
    url: Api.getDetail,
    params
  });
}
