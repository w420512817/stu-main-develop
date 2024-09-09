import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const base_screen = isDevMode() ? '/base-screen' : '/base-screen';
const org = isDevMode() ? '/org' : '/org';
const base_screen_qyj = isDevMode() ? '/base-screen' : '/base-screen';

const Api = {
  planList: `${base_screen}/plan/getPlanList`, //  计划列表
  planAdd: `${base_screen_qyj}/plan/add`, //  新增计划
  screeningNumber: `${base_screen}/plan/screeningNumber`, //  应筛人数

  planComplete: `${base_screen}/plan/complete`, //  完成计划
  planDelete: `${base_screen}/plan/delete`, //  删除计划
  updateScreenNum: `${base_screen}/plan/updateScreenNum`, //  修改人数
  schoolListByJurisdiction: `${base_screen}/plan/schoolListByJurisdiction`, //  权限学校列表
  getPlanJurisdiction: `${base_screen}/plan/getPlanJurisdiction`, //  权限全体学校
  editPlanJurisdiction: `${base_screen}/plan/editPlanJurisdiction`, //  修改全体权限
  editSchoolJurisdiction: `${base_screen}/plan/editSchoolJurisdiction`, //  单个权限
  planInfo: `${base_screen}/plan/planInfo`, //  计划详情
  edit: `${base_screen}/plan/edit`, //  计划编辑

  getScreningRate: `${base_screen}/plan/getScreningRate`, //  计划概览

  getScreningRateInfoForArea: `${base_screen}/plan/getScreningRateInfoForArea`, //  筛查进度 省市
  getScreningRateInfoForRegion: `${base_screen}/plan/getScreningRateInfoForRegion`, //  筛查进度 区

  // planList: `${basic}/plan/getPlanList`, //  计划列表
  planDetail: `${base_screen}/plan/planInfo`, //  计划详情
  planScreeningRate: `${base_screen}/task/planScreeningRate`, //  计划内学生和任务概况
  planScreeningStudentList: `${base_screen}/task/getPlanScreeningStudentList`, //  计划内筛查学生列表

  getAssociateAllSchool: `${org}/organization/associateAllSchool`, //  机构关联学校列表
  schoolList: `${org}/plan/getSchoolList`, //  学校列表
  gradeList: `${org}/plan/getGradeClassList`, //  年级班级列表
  planArea: `${org}/basicConfig/getAreaTree` //  计划地区范围
};

// 原政府计划接口
export function planList(params) {
  return defHttp.get({ url: Api.planList, params });
}
export function planArea(params) {
  return defHttp.get({ url: Api.planArea, params });
}
export function planAdd(params) {
  return defHttp.post({ url: Api.planAdd, params });
}
export function schoolList(params) {
  return defHttp.get({ url: Api.schoolList, params });
}
export function gradeList(params) {
  return defHttp.get({ url: Api.gradeList, params });
}
export function planComplete(params) {
  return defHttp.post({ url: Api.planComplete, params });
}
export function planDelete(params) {
  return defHttp.post({ url: Api.planDelete, params });
}
export function updateScreenNum(params) {
  return defHttp.post({ url: Api.updateScreenNum, params });
}
export function schoolListByJurisdiction(params) {
  return defHttp.post({ url: Api.schoolListByJurisdiction, params });
}
export function getPlanJurisdiction(params) {
  return defHttp.get({ url: Api.getPlanJurisdiction, params });
}
export function editPlanJurisdiction(params) {
  return defHttp.post({ url: Api.editPlanJurisdiction, params });
}
export function editSchoolJurisdiction(params) {
  return defHttp.post({ url: Api.editSchoolJurisdiction, params });
}
export function planInfo(params) {
  return defHttp.get({ url: Api.planInfo, params });
}
export function planEdit(params) {
  return defHttp.post({ url: Api.edit, params });
}
export function getScreningRate(params) {
  return defHttp.get({ url: Api.getScreningRate, params });
}
export function screeningNumber(params) {
  return defHttp.post({ url: Api.screeningNumber, params });
}
export function getScreningRateInfoForArea(params) {
  return defHttp.get({ url: Api.getScreningRateInfoForArea, params });
}
export function getScreningRateInfoForRegion(params) {
  return defHttp.get({ url: Api.getScreningRateInfoForRegion, params });
}

export function getAssociateAllSchool(params) {
  return defHttp.get({ url: Api.getAssociateAllSchool, params });
}

//  Mock 原学校计划接口
export function getPlanList(params) {
  return defHttp.get({ url: Api.planList, params });
}
export function getPlanDetail(params) {
  return defHttp.get({ url: Api.planDetail, params });
}
export function getPlanScreenRate(params) {
  return defHttp.get({ url: Api.planScreeningRate, params });
}
export function getPlanScreenStuList(params) {
  return defHttp.get({ url: Api.planScreeningStudentList, params });
}

// 获取地区树(带学生数量)
export function getAreaTreeStu(params) {
  return defHttp.get({ url: `${org}/plan/getAreaTreeByGrade`, params });
}

// 获取地区树 (区级)
export function editRegionTree(params) {
  return defHttp.post({ url: `${base_screen_qyj}/plan/editRegionTree`, params });
}

// 获取政府下的学校
export function orgSelectBoxForGov(params) {
  return defHttp.get({ url: `${org}/orgSelectBoxForGov`, params });
}
