import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/base-config' : '/base-config';
const org = isDevMode() ? '/org' : '/org';

// 基础通用api
const Api = {
  getSexList: `${basic}/warn/getSexList`, // 性别下拉框
  waringStateList: `${basic}/warn/getWarningStateList`, // 预警状态下拉框
  applicationList: `${basic}/appGroup/getAppGroupList`, //  根据机构id和应用appType获取应用组列表下拉框
  getAllGradeList: `${basic}/plan/getOrgGradeList`, //  获取年级列表
  schoolGradeList: `${org}/plan/schoolGradeList`, //  获取年级列表
  screenOptions: `${basic}/application/getScreeningOpitons`, //  应用下筛查项目列表(创建计划/自查任务可调用)
  registerFileName: `${basic}/registrationForm/getRegistrationForm`, //  登记表-文件名
  registerClassList: `${basic}/registrationForm/getRegisterClassList` //  登记表-班级列表
};

export function getSexList(params) {
  return defHttp.get({ url: Api.getSexList, params });
}
export function waringStateList(params) {
  return defHttp.get({ url: Api.waringStateList, params });
}
export function getApplicationList(params) {
  return defHttp.get({ url: Api.applicationList, params });
}

export function getAllGradeListApi(params) {
  return defHttp.get({ url: Api.getAllGradeList, params });
}

export function getScreenOptions(params) {
  return defHttp.get({ url: Api.screenOptions, params });
}

export function getRegisterFileName(params) {
  return defHttp.get({ url: Api.registerFileName, params });
}

export function getRegisterClassList(params) {
  return defHttp.get({ url: Api.registerClassList, params });
}

export function schoolGradeList(params) {
  return defHttp.get({ url: Api.schoolGradeList, params });
}
