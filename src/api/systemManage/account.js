import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base' : '/base';
const Api = {
  GetAccountList: `${basic}/account/busUser/get`, // 账号列表
  GetAllAccountList: `${basic}/backstage/busUser/get`, // 账号列表
  UpdateAccountStatus: `${basic}/backstage/user/updateStatus`, // 修改用户状态
  UpdateAccountPassword: `${basic}/backstage/resetPassword`, // 重置密码
  DeleteUser: `${basic}/backstage/deleteUser`, // 删除用户
  CheckExist: `${basic}/backstage/user/checkExist`, // 校验参数是否存在
  AddBusUser: `${basic}/backstage/user/add`, // 新增健康平台用户--包含业务用户和运维用户
  UpdateBusUser: `${basic}/backstage/busUser/update`, // 编辑用户
  UpdateOpsUser: `${basic}/backstage/busUser/update`, // 编辑运维用户
  UserCurPer: `${basic}/schoolUser/schoolPermission/used`, // 当前用户权限
  UserPerList: `${basic}/schoolUser/schoolTypesGradeClassTree`, // 权限树
  // RoleSelectBox: `${basic}/role/selectBox`, // 角色下拉列表
  UserAudit: `${basic}/schoolUser/audit`, // 账号审核
  OrgSelectBox: `${basic}/backstage/org/selectBox`, // 账号审核
  getAreaOrgList: `${basic}/organization/getAreaOrgList`,
  schoolSelect: `${basic}/organization/schoolSelect`, // 手机号获取用户信息明文
  getSubordinateRegion: `${basic}/account/getSubordinateRegion`,

  checkUserInfo: `${basic}/sso/user/getUserInfo`, // 获取统一认证平台用户(手机号身份证脱敏)
  getUserInfo: `${basic}/sso/user/checkUserInfo`, // 手机号获取用户信息明文

  importExcelUserData: `${basic}/backstage/importExcelUserData`, // 新增用户excel批量导入
  exportExcelUserData: `${basic}/backstage/exportExcelUserData` // 用户错误信息导出
};

export function GetAccountList(params) {
  return defHttp.post({
    url: Api.GetAccountList,
    params
  });
}

export function GetAllAccountList(params) {
  return defHttp.post({
    url: Api.GetAllAccountList,
    params
  });
}

export function UpdateAccountStatus(params) {
  return defHttp.post({
    url: Api.UpdateAccountStatus,
    params
  });
}

export function UpdateAccountPassword(params) {
  return defHttp.post({
    url: Api.UpdateAccountPassword,
    params
  });
}

export function DeleteUser(params) {
  return defHttp.post({
    url: Api.DeleteUser,
    params
  });
}

export function CheckExist(params) {
  return defHttp.post(
    {
      url: Api.CheckExist,
      params
    },
    { isTransformResponse: false }
  );
}

export function AddBusUser(params) {
  return defHttp.post({
    url: Api.AddBusUser,
    params
  });
}

export function UpdateBusUser(params) {
  return defHttp.post({
    url: Api.UpdateBusUser,
    params
  });
}

export function UpdateOpsUser(params) {
  return defHttp.post({
    url: Api.UpdateOpsUser,
    params
  });
}

export function UserCurPer(params) {
  return defHttp.get({
    url: Api.UserCurPer,
    params
  });
}

export function UserPerList(params) {
  return defHttp.get({
    url: Api.UserPerList,
    params
  });
}

// export function RoleSelectBox(params) {
//   return defHttp.get({
//     url: Api.RoleSelectBox,
//     params
//   });
// }

export function UserAudit(params) {
  return defHttp.post({
    url: Api.UserAudit,
    params
  });
}
export function getAllOrgSelectBox(params) {
  return defHttp.get({
    url: Api.OrgSelectBox,
    params
  });
}

export function getAreaOrgList(params) {
  return defHttp.get({
    url: Api.getAreaOrgList,
    params
  });
}

export function getSchoolSelect(params) {
  return defHttp.post({
    url: Api.schoolSelect,
    params
  });
}

export function getSubordinateRegion(params) {
  return defHttp.get({
    url: Api.getSubordinateRegion,
    params
  });
}

export function checkUserInfo(params) {
  return defHttp.get({ url: Api.checkUserInfo, params });
}
export function getUserInfo(params) {
  return defHttp.get({ url: Api.getUserInfo, params });
}

export function importExcelUserData(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelUserData
    },
    params
  );
}

export function exportExcelUserData(params) {
  return defHttp.post({ url: Api.exportExcelUserData, responseType: 'blob', params }, { isReturnNativeResponse: true });
}
