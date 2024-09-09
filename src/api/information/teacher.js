import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/auth' : '/auth';
const Api = {
  getTeacherList: `${basic}/teacher/pageInfo`, //  分页
  addTeacher: `${basic}/teacher/add`,
  editTeacher: `${basic}/teacher/edit`,
  getTeacherDetail: `${basic}/teacher/detail`, // 档案
  deleteTeacher: `${basic}/teacher/delete`,
  editShow: `${basic}/teacher/editShow`,
  positionSelectBox: `${basic}/teacher/positionSelectBox`,
  importExcelData1: `${basic}/teacher/importExcelTeacherInLandIdData`, // 文件导入内地身份证类型
  importExcelData2: `${basic}/teacher/importExcelTeacherInLandData`, // 内地无身份证
  importExcelData3: `${basic}/teacher/importExcelTeacherOutLandData`, // 外地类型
  exportExcelError1: `${basic}/teacher/exportExcelTeacherInLandIdData`, // 导出内地身份证类型错误信息
  exportExcelError2: `${basic}/teacher/exportExcelTeacherInLandData`, // 导出内地无身份证类型错误信息
  exportExcelError3: `${basic}/teacher/exportExcelTeacherOutLandData`, // 导出外地类型错误信息
  exportExcelList: `${basic}//teacher/exportExcelList` // 导出
};

export function getTeacherList(params) {
  return defHttp.get({
    url: Api.getTeacherList,
    params
  });
}

export function addTeacher(params) {
  return defHttp.post({
    url: Api.addTeacher,
    params
  });
}
export function editTeacher(params) {
  return defHttp.post({
    url: Api.editTeacher,
    params
  });
}
export function getTeacherDetail(params) {
  return defHttp.get({
    url: Api.getTeacherDetail,
    params
  });
}
export function deleteTeacher(params) {
  return defHttp.post({
    url: Api.deleteTeacher,
    params
  });
}
export function editShow(params) {
  return defHttp.get({
    url: Api.editShow,
    params
  });
}

export function positionSelectBox(params) {
  return defHttp.get({
    url: Api.positionSelectBox,
    params
  });
}
export function importExcelData1(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelData1
    },
    params
  );
}
export function importExcelData2(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelData2
    },
    params
  );
}
export function importExcelData3(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelData3
    },
    params
  );
}
export function exportExcelList(params) {
  return defHttp.post(
    {
      url: Api.exportExcelList,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}
export function exportExcelError1(params) {
  return defHttp.post(
    {
      url: Api.exportExcelError1,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}
export function exportExcelError2(params) {
  return defHttp.post(
    {
      url: Api.exportExcelError2,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}

export function exportExcelError3(params) {
  return defHttp.post(
    {
      url: Api.exportExcelError3,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}
