import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base-config' : '/base-config';

const Api = {
  getAcceptNoticePageList: `${basic}/notice/acceptNoticePageList`, // 接收通知列表
  ReadMessages: `${basic}/notice/readMessages`, // 一键已读
  getAcceptNoticeDetail: `${basic}/notice/acceptNoticeDetail`, // 接收通知详情
  DeleteAcceptNotice: `${basic}/notice/deleteAcceptNotice`, // 批量删除
  noticeNum: `${basic}/notice/noticeNum` // 消息条数
};

export function noticeNum(params) {
  return defHttp.get({
    url: Api.noticeNum,
    params
  });
}

export function getAcceptNoticePageList(params) {
  return defHttp.get({
    url: Api.getAcceptNoticePageList,
    params
  });
}

export function ReadMessages(params) {
  return defHttp.post({
    url: Api.ReadMessages,
    params
  });
}

export function getAcceptNoticeDetail(params) {
  return defHttp.get({
    url: Api.getAcceptNoticeDetail,
    params
  });
}

export function DeleteAcceptNotice(params) {
  return defHttp.post({
    url: Api.DeleteAcceptNotice,
    params
  });
}
