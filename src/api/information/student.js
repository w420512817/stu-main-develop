import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';
import { AppTypeEnum } from '@common/enum/pageEnum';

const basic = isDevMode() ? '/student' : '/student';
const basic_config = isDevMode() ? '/base-config' : '/base-config';
const base_screen = isDevMode() ? '/base-screen' : '/base-screen';
const data_center = isDevMode() ? '/data-center' : '/data-center';
const report = isDevMode() ? '/report' : '/report';
// const basic_base_screen = isDevMode() ? '/base-screen' : '/base-screen';
const eyesight = isDevMode() ? '/eyesight' : '/eyesight';
const caries = isDevMode() ? '/caries' : '/caries';
const checkup = isDevMode() ? '/checkup' : '/checkup';
const physicalTest = isDevMode() ? '/physicalTest' : '/physicalTest';
const spine = isDevMode() ? '/spine' : '/spine';

const Api = {
  getStudentTransferList: `${basic}/studentTransfer/studentTransferList`, // 学生转入/转出-名单列表
  queryStudentList: `${basic}/studentBase/pageList`, // 学生分页
  getEditDetail: `${basic}/studentBase/editDetail`, // 编辑页面的详情
  getDetail: `${basic}/studentBase/detail`, // 详情
  addStudent: `${basic}/studentBase/add`,
  editStudent: `${basic}/studentBase/edit`,
  studentTransferCheck: `${basic}/studentTransfer/check`, // [驳回, 通过]转入申请
  deleteStudent: `${basic}/studentBase/delete`, // 删除学生
  getUniqueStudentInfo: `${basic}/studentBase/getUniqueStudentInfo`, // 学生档案
  printStudentInfo: `${basic}/studentBase/printStudentInfo`, // 打印学生二维码
  transferOut: `${basic}/studentTransfer/transferOut`, // 转出
  applyChangeStudent: `${basic}/studentEditRecord/apply`, // 申请修改姓名
  applyRecordStatus: `${basic}/studentEditRecord/statusDetail`, // 申请状态详情
  getRegByAppGroupId: `${basic_config}/registrationForm/getRegByOrgId`, // 通过机构id获得所有登记表样式
  printSelectStudentInfo: `${basic}/studentBase/printSelectStudentInfo`, // 批量获取学生二维码
  exportExcelList: `${basic}/studentBase/exportExcelList`, // 导出学生
  // 学生报表
  getStudentInfo: `${basic}/student/report/getStudentInfo`, // 获取学生信息
  getPlanList: `${base_screen}/plan/student/getPlanList`, // 学生计划列表
  getVisionTrendChart: `${eyesight}${report}/student/getVisionTrendChart`, // 视力趋势图
  getCariesTrendChart: `${caries}${report}/student/getCariesTrendChart`, // 龋齿趋势图
  getPhysicalTrendChart: `${physicalTest}${report}/student/getPhysicalTrendChart`, // 体测趋势图
  getCheckUpTrendChart: `${checkup}${report}/student/getCheckUpTrendChart`, // 体检趋势图
  getHealthInformation: `${data_center}/data/getHealthInformation`, // 健康信息
  exportStudentScreeningtEyesightExcel: `${eyesight}/screen/export/exportStudentScreeningtExcel`,
  exportStudentScreeningtCariesExcel: `${caries}/screen/export/exportStudentScreeningtExcel`,
  exportStudentScreeningtCheckupExcel: `${checkup}/screen/export/exportStudentScreeningtExcel`,
  exportStudentScreeningtPhysicalTestExcel: `${physicalTest}/screen/export/exportStudentScreeningtExcel`,
  getPlanScreeningType: `${base_screen}/plan/getPlanScreeningType`, // 获取计划对应筛查项的类型

  // 导入学生
  uploadFile: `${basic}/import/student/uploadFile`,
  submitTask: `${basic}/import/student/submitTask`,
  getTaskProgress: `${basic}/import/student/getTaskProgress`,
  cancelTask: `${basic}/import/student/cancelTask`,
  exportErrorData: `${basic}/import/student/exportErrorData`,
  getTaskDealCount: `${basic}/import/student/getTaskDealCount`,

  printScreeningReport: `${spine}/report/printScreeningReport` // 学生报告-打印脊柱筛查报告
};

export function getStudentTransferList(params) {
  return defHttp.post({
    url: Api.getStudentTransferList,
    params
  });
}

export function queryStudentList(params) {
  return defHttp.post({
    url: Api.queryStudentList,
    params
  });
}

export function getEditDetail(params) {
  return defHttp.get({
    url: Api.getEditDetail,
    params
  });
}

export function getDetails(params) {
  return defHttp.get({
    url: Api.getDetail,
    params
  });
}
export function addStudent(params) {
  return defHttp.post({
    url: Api.addStudent,
    params
  });
}

export function editStudent(params) {
  return defHttp.post({
    url: Api.editStudent,
    params
  });
}
export function getUniqueStudentInfo(params) {
  return defHttp.post({
    url: Api.getUniqueStudentInfo,
    params
  });
}

export function deleteStudent(params) {
  return defHttp.get({
    url: Api.deleteStudent,
    params
  });
}

export function studentTransferCheck(params) {
  return defHttp.get({
    url: Api.studentTransferCheck,
    params
  });
}

export function printStudentInfo(params) {
  return defHttp.post({
    url: Api.printStudentInfo,
    params
  });
}
export function transferOut(params) {
  return defHttp.post({
    url: Api.transferOut,
    params
  });
}

export function applyChangeStudent(params) {
  return defHttp.post({
    url: Api.applyChangeStudent,
    params
  });
}

export function applyRecordStatus(params) {
  return defHttp.post({
    url: Api.applyRecordStatus,
    params
  });
}
export function getRegByAppGroupId(params) {
  return defHttp.get({
    url: Api.getRegByAppGroupId,
    params
  });
}
export function printSelectStudentInfo(params) {
  return defHttp.post({
    url: Api.printSelectStudentInfo,
    params
  });
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

export function getStudentInfo(params) {
  return defHttp.get({
    url: Api.getStudentInfo,
    params
  });
}
export function getPlanList(params) {
  return defHttp.get({
    url: Api.getPlanList,
    params
  });
}
export function getVisionTrendChart(params) {
  return defHttp.get({
    url: Api.getVisionTrendChart,
    params
  });
}
export function getHealthInformation(params) {
  return defHttp.get({
    url: Api.getHealthInformation,
    params
  });
}
export function exportStudentScreeningtExcel(params, appType) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.exportStudentScreeningtEyesightExcel,
    [AppTypeEnum.CARIES]: Api.exportStudentScreeningtCariesExcel,
    [AppTypeEnum.CHECKUP]: Api.exportStudentScreeningtCheckupExcel,
    [AppTypeEnum.PHYSICAL]: Api.exportStudentScreeningtPhysicalTestExcel
  };

  return defHttp.get(
    {
      url: Interface[appType],
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}

export function printScreeningReport(params) {
  return defHttp.get({ url: Api.printScreeningReport, params });
}

export function getPlanScreeningType(params) {
  return defHttp.get({
    url: Api.getPlanScreeningType,
    params
  });
}
export function getPhysicalTrendChart(params) {
  return defHttp.get({
    url: Api.getPhysicalTrendChart,
    params
  });
}
export function getCheckUpTrendChart(params) {
  return defHttp.get({
    url: Api.getCheckUpTrendChart,
    params
  });
}
export function getCariesTrendChart(params) {
  return defHttp.get({
    url: Api.getCariesTrendChart,
    params
  });
}

export function uploadFile(params) {
  return defHttp.uploadFile(
    {
      url: Api.uploadFile
    },
    params
  );
}
export function submitTask(params) {
  return defHttp.post({
    url: Api.submitTask,
    params
  });
}
export function getTaskProgress(params) {
  //  5秒钟超时时间
  return defHttp.get({
    url: Api.getTaskProgress,
    params,
    timeout: 5 * 1000
  });
}

export function cancelTask(params) {
  return defHttp.get({
    url: Api.cancelTask,
    params
  });
}

export function exportErrorData(params) {
  return defHttp.get(
    {
      url: Api.exportErrorData,
      responseType: 'blob',
      params
    },
    { isReturnNativeResponse: true }
  );
}
export function getTaskDealCount(params) {
  return defHttp.get({
    url: Api.getTaskDealCount,
    params
  });
}

export const getHistoryScreening = (params, appType = 1) => {
  let apiEnum = {
    1: `${eyesight}/screen/plan/getHistoryScreening`,
    2: `${caries}/screen/plan/getHistoryScreening`,
    3: `${checkup}/screen/plan/getHistoryScreening`,
    4: `${physicalTest}/screen/plan/getHistoryScreening`,
    5: `${spine}/screen/plan/getHistoryScreening`
  };
  return defHttp.get({
    url: apiEnum[appType],
    params
  });
};

export const getTaskDivideClass = params => {
  return defHttp.get({
    url: `${basic}/import/student/getTaskDivideClass`,
    params
  });
};

export const studentDivide = params => {
  return defHttp.post({
    url: `${basic}/import/student/studentDivide`,
    params
  });
};
