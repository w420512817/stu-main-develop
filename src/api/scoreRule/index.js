import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base-config' : '/base-config';

const Api = {
  getRulesList: `${basic}/scoreRules/getRulesList`, // 规则列表
  getAppList: `${basic}/scoreRules/getAppList`, // 应用列表
  getScreeningOpitons: `${basic}/scoreRules/getScreeningOpitons`, // 筛查项目列表
  addRules: `${basic}/scoreRules/addRules`, // 新增
  getRulesInfo: `${basic}/scoreRules/getRulesInfo`, // 详情
  editRules: `${basic}/scoreRules/editRules`, // 编辑
  deleteRules: `${basic}/scoreRules/deleteRules` // 删除
};

export function getRulesList(params) {
  return defHttp.get({
    url: Api.getRulesList,
    params
  });
}

export function getAppList(params) {
  return defHttp.get({
    url: Api.getAppList,
    params
  });
}

export function getScreeningOpitons(params) {
  return defHttp.get({
    url: Api.getScreeningOpitons,
    params
  });
}

export function addRules(params) {
  return defHttp.post({
    url: Api.addRules,
    params
  });
}

export function getRulesInfo(params) {
  return defHttp.get({
    url: Api.getRulesInfo,
    params
  });
}

export function editRules(params) {
  return defHttp.post({
    url: Api.editRules,
    params
  });
}

export function deleteRules(params) {
  return defHttp.post({
    url: Api.deleteRules,
    params
  });
}
