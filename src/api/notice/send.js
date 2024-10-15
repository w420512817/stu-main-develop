/*
 * @Author: wangjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wangjq
 * @LastEditTime: 2024-10-15 18:41:00
 */
import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base' : '/base';

const Api = {
  getSendNoticePageList: `${basic}/notice/sendNoticePageList`, // 发送通知列表
  getOrgUserList: `${basic}/notice/getOrgUserList`, // 发送通知列表
  AddNoticeByHashedWheelTimer: `${basic}/notice/addNoticeByHashedWheelTimer`, // 新增通知
  EditNotice: `${basic}/notice/editNotice`, // 新增通知
  AddNotice: `${basic}/notice/addNotice`, // 新增通知 （暂闲置）
  SendNoticeSoon: `${basic}/notice/sendNoticeSoon`, // 立即发送
  SendNoticeDetail: `${basic}/notice/sendNoticeDetail`, // 信息详情
  DeleteNotice: `${basic}/notice/deleteNotice`, // 删除通知
  notifiedOrgSelectBox: `${basic}/notice/notifiedOrgSelectBox`, // 下拉框1
  notifiedRoleSelectBox: `${basic}/notice/notifiedRoleSelectBox`, // 下拉框2
  notifiedUserSelectBox: `${basic}/notice/notifiedUserSelectBox` // 下拉框3
};

export function notifiedOrgSelectBox(params) {
  return defHttp.get({
    url: Api.notifiedOrgSelectBox,
    params
  });
}
export function notifiedRoleSelectBox(params) {
  return defHttp.get({
    url: Api.notifiedRoleSelectBox,
    params
  });
}
export function notifiedUserSelectBox(params) {
  return defHttp.get({
    url: Api.notifiedUserSelectBox,
    params
  });
}

export function getSendNoticePageList(params) {
  return defHttp.get({
    url: Api.getSendNoticePageList,
    params
  });
}

export function getOrgUserList(params) {
  return defHttp.get({
    url: Api.getOrgUserList,
    params
  });
}

export function AddNoticeByHashedWheelTimer(params) {
  return defHttp.post({
    url: Api.AddNoticeByHashedWheelTimer,
    params
  });
}

export function AddNotice(params) {
  return defHttp.post({
    url: Api.AddNotice,
    params
  });
}

export function EditNotice(params) {
  return defHttp.post({
    url: Api.EditNotice,
    params
  });
}

export function SendNoticeSoon(params) {
  return defHttp.post({
    url: Api.SendNoticeSoon,
    params
  });
}

export function SendNoticeDetail(params) {
  return defHttp.get({
    url: Api.SendNoticeDetail,
    params
  });
}

export function DeleteNotice(params) {
  return defHttp.post({
    url: Api.DeleteNotice,
    params
  });
}
