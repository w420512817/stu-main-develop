import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const auth = isDevMode() ? '/auth' : '/auth';
const org = isDevMode() ? '/org' : '/org';
const basic = isDevMode() ? '/base-config' : '/base-config';

const basic1 = isDevMode() ? '/data-center' : '/data-center'; // 首页
const Api = {
  SmsSend: `${auth}/biz/sms/send`,
  SmsSendByAccount: `${auth}/biz/sms/bizLogin/send`,
  GetOrgList: `${org}/organization/schoolSelect`,
  AreaTree: `${org}/basicConfig/regionTreeList`, // 获取所有与省市区的tree
  regionTree: `${org}/basicConfig/regionTree`,
  accountList: `/accountList`, // template Mock
  noticeNum: `${basic}/notice/noticeNum`, // 消息条数

  clickCount: `${basic1}/homepage/clickCount` // 菜单埋点，非政府账号下的首页右侧，常用功能
};

export function noticeNum(params) {
  return defHttp.get({
    url: Api.noticeNum,
    params
  });
}

export function smsSend(params, mode = 'modal') {
  return defHttp.post(
    {
      url: Api.SmsSend,
      params
    },
    { errorMessageMode: mode }
  );
}

export function smsSendByAccount(params, mode = 'modal') {
  return defHttp.post(
    {
      url: Api.SmsSendByAccount,
      params
    },
    { errorMessageMode: mode }
  );
}

export function getAreaTree(params) {
  return defHttp.get({
    url: Api.AreaTree,
    params
  });
}

export function getRegionTree(params) {
  return defHttp.get({
    url: Api.regionTree,
    params
  });
}

export function getOrgList(params) {
  return defHttp.post({
    url: Api.GetOrgList,
    params
  });
}

// template Mock
export function getAccountList(params) {
  return defHttp.get({
    url: Api.accountList,
    params
  });
}

export function clickCount(params) {
  return defHttp.post(
    {
      url: Api.clickCount,
      params
    },
    { isTransformResponse: false }
  );
}
