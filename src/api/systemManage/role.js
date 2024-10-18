/*
 * @Author: wangjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wangjq
 * @LastEditTime: 2024-10-17 16:30:07
 */
import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base' : '/base';

const Api = {
  GetRoleList: `${basic}/roleManage/get`, // 角色列表
  GetCurrentRoles: `${basic}/permission/used`, // 获取角色的权限
  DeletePermissionRole: `${basic}/roleManage/delete`, // 删除角色
  AddRole: `${basic}/roleManage/add`, // 新增角色
  UpdateRule: `${basic}/roleManage/update`, // 编辑角色
  CheckRoleExist: `${basic}/roleManage/checkRoleExist`, // 角色名称是否存在
  SchoolMenu: `${basic}/schoolMenu/list` // 角色管理菜单
};

export function GetRoleList(params) {
  return defHttp.post({
    url: Api.GetRoleList,
    params
  });
}

export function GetCurrentRoles(params) {
  return defHttp.get({
    url: Api.GetCurrentRoles,
    params
  });
}

export function DeletePermissionRole(params) {
  return defHttp.post({
    url: Api.DeletePermissionRole,
    params
  });
}

export function CheckRoleExist(params) {
  return defHttp.post({
    url: Api.CheckRoleExist,
    params
  });
}

export function AddRole(params) {
  return defHttp.post({
    url: Api.AddRole,
    params
  });
}

export function UpdateRule(params) {
  return defHttp.post({
    url: Api.UpdateRule,
    params
  });
}

export function SchoolMenu(params) {
  return defHttp.get({
    url: Api.SchoolMenu,
    params
  });
}
