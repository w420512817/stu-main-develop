import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const basic2 = isDevMode() ? '/org' : '/org';
const Api = {
  getClassList: `${basic}/class/pageInfo`, //  班级分页
  addClass: `${basic}/class/add`,
  editClass: `${basic}/class/edit`,
  getClassDetail: `${basic}/class/editShow`,
  deleteClass: `${basic}/class/delete`,
  getStudyYear: `${basic2}/class/studyYear`, // 获取当前用户所属机构的 学年列表
  getSchoolGrade: `${basic}/class/schoolGrade`, // 通过当前用户所属学校 获取学校年级列表
  importExcelData: `${basic}/class/importExcelClassData`, // 文件导入
  exportExcelError: `${basic}/class/exportExcelClassData`, // 导出错误信息
  exportExcelList: `${basic}/class/exportExcelList` // 导出
};

export function getClassList(params) {
  return defHttp.get({
    url: Api.getClassList,
    params
  });
}
export function addClass(params) {
  return defHttp.post({
    url: Api.addClass,
    params
  });
}
export function editClass(params) {
  return defHttp.post({
    url: Api.editClass,
    params
  });
}
export function getClassDetail(params) {
  return defHttp.get({
    url: Api.getClassDetail,
    params
  });
}

export function deleteClass(params) {
  return defHttp.post({
    url: Api.deleteClass,
    params
  });
}
export function getStudyYear(params) {
  return defHttp.get({
    url: Api.getStudyYear,
    params
  });
}
export function getSchoolGrade(params) {
  return defHttp.get({
    url: Api.getSchoolGrade,
    params
  });
}
export function importExcelData(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelData
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
export function exportExcelError(params) {
  return defHttp.post(
    {
      url: Api.exportExcelError,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}
