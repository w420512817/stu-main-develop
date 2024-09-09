import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getClassroomList: `${basic}/classroom/pageInfo`, //  教室分页
  addClassroom: `${basic}/classroom/add`,
  editClassroom: `${basic}/classroom/edit`,
  getClassroomDetail: `${basic}/classroom/editShow`,
  deleteClassroom: `${basic}/classroom/delete`,
  getDetail: `${basic}/classroom/detail`,
  selectBox: `${basic}/classroom/selectBox`, // 通过楼层id 获取教室下拉选框 已被班级关联的教室排除
  classroomNameByNumber: `${basic}/classroom/classroomName`, // 班级管理页通过教室编号获取教室名称
  environmentList: `/dataMonitor/environmentList`, //  Mock
  importExcelData: `${basic}/classroom/importExcelClassroomData`, // 文件导入
  exportExcelError: `${basic}/classroom/exportExcelClassroomData`, // 导出错误信息
  exportExcelList: `${basic}/classroom/exportExcelList` // 导出
};

export function getClassroomList(params) {
  return defHttp.get({
    url: Api.getClassroomList,
    params
  });
}

export function addClassroom(params) {
  return defHttp.post({
    url: Api.addClassroom,
    params
  });
}

export function editClassroom(params) {
  return defHttp.post({
    url: Api.editClassroom,
    params
  });
}

export function getClassroomDetail(params) {
  return defHttp.get({
    url: Api.getClassroomDetail,
    params
  });
}

export function deleteClassroom(params) {
  return defHttp.post({
    url: Api.deleteClassroom,
    params
  });
}

export function getDetail(params) {
  return defHttp.get({
    url: Api.getDetail,
    params
  });
}

export function selectBox(params) {
  return defHttp.get({
    url: Api.selectBox,
    params
  });
}

export function classroomNameByNumber(params) {
  return defHttp.get({
    url: Api.classroomNameByNumber,
    params
  });
}
//  Mock
export function getEnvironmentList(params) {
  return defHttp.get({
    url: Api.environmentList,
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
