/*
 * @Author: wangjq wjq4416@163.com
 * @Date: 2024-09-09 14:39:57
 * @LastEditors: wangjq
 * @LastEditTime: 2024-10-15 11:55:57
 */
import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const base = isDevMode() ? '/base' : '/base';

const basic1 = isDevMode() ? '/data-center' : '/data-center'; // 首页
const Api = {
  SmsSend: `${base}/biz/sms/send`,
  SmsSendByAccount: `${base}/biz/sms/bizLogin/send`,
  GetOrgList: `${base}/organization/schoolSelect`,
  AreaTree: `${base}/basicConfig/regionTreeList`, // 获取所有与省市区的tree
  regionTree: `${base}/basicConfig/regionTree`,
  accountList: `/accountList`, // template Mock
  noticeNum: `${base}/notice/noticeNum`, // 消息条数

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
