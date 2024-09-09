import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const auth = isDevMode() ? '/auth' : '/auth';
// const student = isDevMode() ? '/student' : '/student';
const Api = {
  schoolSelectBox: `${basic}/teacherScreening/schoolSelectBox`, // 学校端分页 [学校名称]下拉框
  rollOutSchoolList: `${basic}/teacherScreening/rollOutSchoolList`, // 获取可转出学生学校列表

  buildingForClassSelectBox: `${basic}/teachingBuilding/selectBox`, // 新增班级-[教学楼]下拉选框
  buildingDropSelectBox: `${basic}/teachingBuilding/pageSelectBox`, // 分页所属-[教学楼]下拉框

  selectBoxByBuildId: `${basic}/floor/selectBox`, // 通过教学楼id获取 [楼层]下拉框
  FloorDropSelectBox: `${basic}/floor/pageSelectBox`, // 分页]楼层]下拉框

  ClassroomNumberSelectBox: `${basic}/classroom/pageSelectBox`, // 分页教室编号下拉框
  ClassroomDropSelectBox: `${basic}/classroom/selectBox`, // 通过楼层id 获取教室下拉选框 已被班级关联的教室排除

  TeacherDropSelectbox: `${auth}/teacher/selectBox`, // // 教师 id 姓名下拉框

  existSchoolGrade: `${basic}/class/existSchoolGrade`, // 通过学校id 获取已有班级数据年级列表集合
  classByGradeId: `${basic}/class/classByGradeId` // 通过年级id获取相关班级列表
};

export function schoolSelectBox(params) {
  return defHttp.get({
    url: Api.schoolSelectBox,
    params
  });
}

export function rollOutSchoolList(params) {
  return defHttp.get({
    url: Api.rollOutSchoolList,
    params
  });
}
export function buildingForClassSelectBox(params) {
  return defHttp.get({
    url: Api.buildingForClassSelectBox,
    params
  });
}
export function buildingDropSelectBox(params) {
  return defHttp.get({
    url: Api.buildingDropSelectBox,
    params
  });
}
export function selectBoxByBuildId(params) {
  return defHttp.get({
    url: Api.selectBoxByBuildId,
    params
  });
}
export function FloorDropSelectBox(params) {
  return defHttp.get({
    url: Api.FloorDropSelectBox,
    params
  });
}
export function ClassroomNumberSelectBox(params) {
  return defHttp.get({
    url: Api.ClassroomNumberSelectBox,
    params
  });
}
export function ClassroomDropSelectBox(params) {
  return defHttp.get({
    url: Api.ClassroomDropSelectBox,
    params
  });
}
export function TeacherDropSelectbox(params) {
  return defHttp.get({
    url: Api.TeacherDropSelectbox,
    params
  });
}

export function existSchoolGrade(params) {
  return defHttp.get({
    url: Api.existSchoolGrade,
    params
  });
}
export function classByGradeId(params) {
  return defHttp.get({
    url: Api.classByGradeId,
    params
  });
}
