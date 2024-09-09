import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getSchoolList: `${basic}/organization/schoolInfoList`, //  学校分页
  getAssociateSchoolList: `${basic}/organization/associateSchoolPage`, //  学校分页 与 关联学校列表分页
  getSchoolDetail: `${basic}/teacherScreening/schoolDetail`, // 通过学校id查询 学校详情
  schoolTypesGradeClassTree: `${basic}/teacherScreening/schoolTypesGradeClassTree`, // 通过学校id 获取 学段>年级>班级树
  eduSelectBox: `${basic}/eduSelectBox`, // 学校信息分页 学制下拉框
  schoolTypesGrade: `${basic}/teacherScreening/schoolTypesGrade`, // 创建班级使用 学段，年级树
  authArea: `${basic}/basicConfig/getAreaTree`, //  管辖地区范围

  importExcelSchoolData: `${basic}/organization/importExcelSchoolData`, // 新增学校excel批量导入
  exportExcelSchoolData: `${basic}/organization/exportExcelSchoolData` // 学校错误信息导出
};

export function getSchoolList(params) {
  return defHttp.post({
    url: Api.getSchoolList,
    params
  });
}
export function getAssociateSchoolList(params) {
  return defHttp.post({
    url: Api.getAssociateSchoolList,
    params
  });
}
export function getSchoolDetail(params) {
  return defHttp.get({
    url: Api.getSchoolDetail,
    params
  });
}
export function schoolTypesGradeClassTree(params) {
  return defHttp.get({
    url: Api.schoolTypesGradeClassTree,
    params
  });
}
export function schoolTypesGrade(params) {
  return defHttp.get({
    url: Api.schoolTypesGrade,
    params
  });
}

export function schoolSelectBox(params) {
  return defHttp.get({
    url: Api.schoolSelectBox,
    params
  });
}

export function eduSelectBox(params) {
  return defHttp.get({
    url: Api.eduSelectBox,
    params
  });
}

export function authArea() {
  return defHttp.get({ url: Api.authArea });
}

export function importExcelSchoolData(params) {
  return defHttp.uploadFile(
    {
      url: Api.importExcelSchoolData
    },
    params
  );
}
export function exportExcelSchoolData(params) {
  return defHttp.post(
    { url: Api.exportExcelSchoolData, responseType: 'blob', params },
    { isReturnNativeResponse: true }
  );
}
