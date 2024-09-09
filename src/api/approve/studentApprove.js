import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/student' : '/student';
const basic1 = isDevMode() ? '/student' : '/student';

const Api = {
  pageList: `${basic1}/studentEditRecord/pageList`, // 分页列表
  editStatus: `${basic}/studentEditRecord/editStatus`, //  通过、驳回
  approveList: `/approveList` //  Mock
};

export function pageList(params) {
  return defHttp.post({
    url: Api.pageList,
    params
  });
}

export function editStatus(params) {
  return defHttp.get({
    url: Api.editStatus,
    params
  });
}

//  Mock
export function getApproveList(params) {
  return defHttp.get({
    url: Api.approveList,
    params
  });
}
