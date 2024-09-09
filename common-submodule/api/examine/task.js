import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';
import { useApplicationStore } from '@/store';
import { AppTypeEnum } from '@common/enum/pageEnum';

const { appType } = useApplicationStore();

const basic = isDevMode() ? '/base-screen' : '/base-screen';
const basic_config = isDevMode() ? '/base-config' : '/base-config';

const basic_base_screen = isDevMode() ? '/base-screen' : '/base-screen';
const eyesight = isDevMode() ? '/eyesight' : '/eyesight';
const caries = isDevMode() ? '/caries' : '/caries';
const checkup = isDevMode() ? '/checkup' : '/checkup';
const physicalTest = isDevMode() ? '/physicalTest' : '/physicalTest';
const spine = isDevMode() ? '/spine' : '/spine';

const org = isDevMode() ? '/org' : '/org';
const auth = isDevMode() ? '/auth' : '/auth';

const Api = {
  taskList: `${basic}/plan/plan/getTaskList`, //  任务列表
  planScreenOptions: `${basic_base_screen}/task/getPlanScreeningOpitons`, //  计划下筛查项目列表（创建非自查任务调用）
  deviceList: `${org}/equipment/getDeviceList`, //  设备列表
  taskPersonList: `${basic_base_screen}/task/getTaskWorkerList`, //  筛查人员列表
  classList: `${basic_base_screen}/task/getClassList`, //  班级列表
  classListBySelf: `${basic_base_screen}/task/getClassListBySelf`, //  班级列表--z自查
  addTask: `${basic_base_screen}/task/add`, //  新增任务
  editTask: `${basic_base_screen}/task/edit`, //  编辑任务getAppGroupList
  deleteTask: `${basic_base_screen}/task/delete`, //  删除任务
  taskDetail: `${basic_base_screen}/task/taskInfo`, //  任务详情
  completeTask: `${basic_base_screen}/task/complete`, //  任务完成
  uploadTask: `${basic_base_screen}/task/upload`, //  任务上报
  registerClassList: `${basic_base_screen}/task/getRegisterClassList`, //  登记表-班级列表
  registerFileStudents: `${basic_base_screen}/task/getRegisterStudents`, //  登记表-学生信息
  taskPlanList: `${basic_base_screen}/task/planList`, //  任务新增-计划列表
  taskScreeningRate: `${basic_base_screen}/task/taskScreeningRate`, //  任务内学生概况
  getTaskRate: `${basic_base_screen}/task/getTaskRate`, //  任务内学段-年级-班级列表
  taskScreeningRateClass: `${basic_base_screen}/task/taskScreeningRateByClass`, //  班级内学生概况
  getTaskRateClass: `${basic}/task/getClassStudentList`, //  班级学生筛查情况列表
  notScreenStuList: `${basic_base_screen}/task/notScreeningStudentList`, //  不可筛查学生列表
  removeStuData: `${basic_base_screen}/task/removeStudentScreening`, //  移除学生数据
  recoveryStuStatus: `${basic_base_screen}/task/recoveryScreeningStatus`, //  恢复学生筛查状态
  clearScreenType: `${basic_base_screen}/task/removeScreeningType`, //  清除数据筛查类型列表
  // inputScreening: `${eyesight}/eyesight/task/inputScreening`, // 录入筛查信息

  inputEyesightScreeningList: `${basic_base_screen}/task/inputScreeningList`, //  录入-筛查信息列表
  inputEyesightScreening: `${eyesight}/screen/task/inputScreening`, // 录入视力筛查信息
  getExamEyesight: `${eyesight}/screen/task/exam`, // 获取视力筛查信息
  clearEyesightStuData: `${eyesight}/screen/task/cleanStudentScreening`, //  清除学生筛查数据

  inputCariesScreeningList: `${basic_base_screen}/task/inputScreeningList`, //  录入龋齿筛查信息列表
  inputCariesScreening: `${caries}/screen/task/inputScreening`, // 录入龋齿筛查信息
  getExamCaries: `${caries}/screen/task/exam`, // 获取龋齿筛查信息
  clearCariesStuData: `${caries}/screen/task/cleanStudentScreening`, //  清除学生筛查数据

  inputCheckupScreeningList: `${basic_base_screen}/task/inputScreeningList`, //  录入体检筛查信息列表
  inputCheckupScreening: `${checkup}/screen/task/inputScreening`, // 录入体检筛查信息
  getExamCheckup: `${checkup}/screen/task/exam`, // 获取体检筛查信息
  clearCheckupStuData: `${checkup}/screen/task/cleanStudentScreening`, //  清除学生筛查数据

  inputPhysicalTestScreeningList: `${physicalTest}/task/inputScreeningList`, //  录入体测筛查信息列表
  inputPhysicalTestScreening: `${physicalTest}/screen/task/inputScreening`, // 录入体测筛查信息
  getExamPhysicalTest: `${physicalTest}/screen/task/exam`, // 获取体测筛查信息
  clearPhysicalTestStuData: `${physicalTest}/screen/task/cleanStudentScreening`, //  清除学生筛查数据

  inputSpineScreeningList: `${basic_base_screen}/task/inputScreeningList`, //  录入脊柱筛查信息列表
  inputSpineScreening: `${spine}/screen/task/inputScreening`, // 录入脊柱筛查信息
  getExamSpine: `${spine}/screen/task/exam`, // 获取脊柱筛查信息
  clearSpineStuData: `${spine}/screen/task/cleanStudentScreening`, //  清除学生筛查数据

  // getExamEyesight: `${basic_base_screen}/task/getExamEyesight`, //  获取筛查信息
  uploadFile: `${basic_config}/uploadFtp/uploadFile`, // 上传文件
  importStuScreenExcel: `${basic_base_screen}/task/importStudentScreeningExcel`, //  学生筛查数据excel批量导入

  applicationList: `${basic_base_screen}/plan/getAppGroupList`, //  应用列表
  // taskList: `${basic}/plan/getTaskList`, //  任务列表
  taskInfo: `${basic_base_screen}/plan/taskInfo`, //  任务详情
  getPlanTaskRate: `${basic_base_screen}/plan/taskRate`, //  任务筛查进度
  addReviewTask: `${basic_base_screen}/plan/addReviewTask`, //  创建复查任务
  openTask: `${basic_base_screen}/plan/openTask`, //  打开任务
  getPhysicalScore: `${physicalTest}/screen/plan/getPhysicalScore`, //  获取分数

  getEquipmentTypeList: `${org}/device/equipmentTypeList`, // 设备下拉框
  getEquipmentVendorList: `${org}/device/equipmentVendorList`, // 设备厂商下拉框
  getEquipmentModelList: `${org}/device/equipmentModelList`, // 设备型号下拉框
  AddOrgEquipment: `${org}/device/addOrgEquipment`, // 机构新增设备
  getEquipmentPageList: `${org}/device/equipmentPageList`, // 设备管理列表
  getEquipmentSelectList: `${basic_base_screen}/task/getEquipmentList`, // 获取任务选中的设备
  GetAccountList: `${basic_base_screen}/task/getWorkerListInfo`, // 任务筛查账号列表
  CheckExist: `${auth}/backstage/user/checkExist`, // 校验参数是否存在
  AddScreenerAccount: `${auth}/backstage/user/addScreener`, // 新增筛查员账号
  ArrangeScreenAndDevice: `${basic_base_screen}/task/assignWorker`, // 指派筛查人员及筛查设备
  getSubordinateRegion: `${auth}/account/getSubordinateRegion`
};

//  Mock
export function getTaskList(params) {
  return defHttp.get({ url: Api.taskList, params });
}

export function getPlanScreenOptions(params) {
  return defHttp.get({ url: Api.planScreenOptions, params });
}
export function getDeviceList(params) {
  return defHttp.get({ url: Api.deviceList, params });
}
export function getTaskPersonList(params) {
  return defHttp.get({ url: Api.taskPersonList, params });
}
export function getClassList(params) {
  return defHttp.get({ url: Api.classList, params });
}
export function getClassListBySelf(params) {
  return defHttp.get({ url: Api.classListBySelf, params });
}
export function addTask(params) {
  return defHttp.post({ url: Api.addTask, params });
}
export function editTask(params) {
  return defHttp.post({ url: Api.editTask, params });
}
export function deleteTask(params) {
  return defHttp.post({ url: Api.deleteTask, params });
}
export function getTaskDetail(params) {
  return defHttp.get({ url: Api.taskDetail, params });
}
export function completeTask(params) {
  return defHttp.post({ url: Api.completeTask, params });
}
export function uploadTask(params) {
  return defHttp.post({ url: Api.uploadTask, params });
}
export function getRegisterClassList(params) {
  return defHttp.get({ url: Api.registerClassList, params });
}
export function getRegisterFileStudents(params) {
  return defHttp.get({ url: Api.registerFileStudents, params });
}
export function getTaskPlanList(params) {
  return defHttp.get({ url: Api.taskPlanList, params });
}
export function getTaskScreeningRate(params) {
  return defHttp.get({ url: Api.taskScreeningRate, params });
}
export function getTaskRate(params) {
  return defHttp.get({ url: Api.getTaskRate, params });
}
export function getTaskScreeningRateClass(params) {
  return defHttp.get({ url: Api.taskScreeningRateClass, params });
}
export function getTaskRateClass(params) {
  return defHttp.get({ url: Api.getTaskRateClass, params });
}
export function getNotScreenStuList(params) {
  return defHttp.get({ url: Api.notScreenStuList, params });
}
export function removeStuData(params) {
  return defHttp.post({ url: Api.removeStuData, params });
}
export function recoveryStuStatus(params) {
  return defHttp.get({ url: Api.recoveryStuStatus, params });
}
export function clearScreenType(params) {
  return defHttp.get({ url: Api.clearScreenType, params });
}

// export function inputScreening(params) {
//   return defHttp.post({ url: Api.inputScreening, params });
// }

//

export function clearStuData(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.clearEyesightStuData,
    [AppTypeEnum.CARIES]: Api.clearCariesStuData,
    [AppTypeEnum.CHECKUP]: Api.clearCheckupStuData,
    [AppTypeEnum.PHYSICAL]: Api.clearPhysicalTestStuData,
    [AppTypeEnum.SPINE]: Api.clearSpineStuData
  };

  return defHttp.post({ url: Interface[appType], params });
}

export function getInputScreeningList(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.inputEyesightScreeningList,
    [AppTypeEnum.CARIES]: Api.inputCariesScreeningList,
    [AppTypeEnum.CHECKUP]: Api.inputCheckupScreeningList,
    [AppTypeEnum.PHYSICAL]: Api.inputPhysicalTestScreeningList,
    [AppTypeEnum.SPINE]: Api.inputSpineScreeningList
  };
  return defHttp.get({ url: Interface[appType], params });
}

export function inputAppScreening(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.inputEyesightScreening,
    [AppTypeEnum.CARIES]: Api.inputCariesScreening,
    [AppTypeEnum.CHECKUP]: Api.inputCheckupScreening,
    [AppTypeEnum.PHYSICAL]: Api.inputPhysicalTestScreening,
    [AppTypeEnum.SPINE]: Api.inputSpineScreening
  };
  return defHttp.post({ url: Interface[appType], params });
}

export function getExam(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.getExamEyesight,
    [AppTypeEnum.CARIES]: Api.getExamCaries,
    [AppTypeEnum.CHECKUP]: Api.getExamCheckup,
    [AppTypeEnum.PHYSICAL]: Api.getExamPhysicalTest,
    [AppTypeEnum.SPINE]: Api.getExamSpine
  };
  return defHttp.get({ url: Interface[appType], params });
}

export function uploadFile(params) {
  return defHttp.uploadFile({ url: Api.uploadFile }, params);
}
export function importStuScreenExcel(taskId, params) {
  return defHttp.uploadFile({ url: Api.importStuScreenExcel + `?taskId=${taskId}` }, params);
}

// 政府端
export function getApplicationList(params) {
  return defHttp.get({ url: Api.applicationList, params });
}
// export function getTaskList(params) {
//   return defHttp.get({ url: Api.taskList, params });
// }
// export function getTaskDetail(params) {
//   return defHttp.get({ url: Api.taskInfo, params });
// }
export function getPlanTaskRate(params) {
  return defHttp.get({ url: Api.getPlanTaskRate, params });
}
export function addReviewTask(params) {
  return defHttp.post({ url: Api.addReviewTask, params });
}
export function openTask(params) {
  return defHttp.post({ url: Api.openTask, params });
}

export const getPhysicalScore = params => defHttp.get({ url: Api.getPhysicalScore, params });

// 设备配置相关
export function getEquipmentTypeList(params) {
  return defHttp.get({
    url: Api.getEquipmentTypeList,
    params
  });
}

export function getEquipmentVendorList(params) {
  return defHttp.get({
    url: Api.getEquipmentVendorList,
    params
  });
}

export function getEquipmentModelList(params) {
  return defHttp.get({
    url: Api.getEquipmentModelList,
    params
  });
}

export function AddOrgEquipment(params) {
  return defHttp.post({
    url: Api.AddOrgEquipment,
    params
  });
}

export function getEquipmentPageList(params) {
  return defHttp.get({
    url: Api.getEquipmentPageList,
    params
  });
}

// getEquipmentSelectList
export function getEquipmentSelectList(params) {
  return defHttp.get({
    url: Api.getEquipmentSelectList,
    params
  });
}

// 筛查员账号相关
export function GetAccountList(params) {
  return defHttp.get({
    url: Api.GetAccountList,
    params
  });
}

export function CheckExist(params) {
  return defHttp.post(
    {
      url: Api.CheckExist,
      params
    },
    { isTransformResponse: false }
  );
}

export function AddScreenerAccount(params) {
  return defHttp.post({
    url: Api.AddScreenerAccount,
    params
  });
}

export function GetRoleList(params) {
  return defHttp.post({
    url: Api.GetRoleList,
    params
  });
}

export function ArrangeScreenAndDevice(params) {
  return defHttp.post({
    url: Api.ArrangeScreenAndDevice,
    params
  });
}

// 获取学校树
export function getSchoolTree(params) {
  return defHttp.get({ url: `${basic_base_screen}/task/getSchoolTree`, params });
}

export function getUnChangeScreenFields(params) {
  const { appType } = useApplicationStore();
  let basicUrl = '/screen/task/getUnChangeScreenFields';
  const Interface = {
    [AppTypeEnum.VISION]: `${eyesight}${basicUrl}`,
    [AppTypeEnum.CARIES]: `${caries}${basicUrl}`,
    [AppTypeEnum.CHECKUP]: `${checkup}${basicUrl}`,
    [AppTypeEnum.PHYSICAL]: `${physicalTest}${basicUrl}`,
    [AppTypeEnum.SPINE]: `${spine}${basicUrl}`
  };
  return defHttp.get({ url: Interface[appType], params });
}

// 家长同意书开关
export const consentStatusUpdate = data =>
  defHttp.post({
    url: `${basic_base_screen}/task/consentStatusUpdate`,
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  });

// 获取任务是否开启家长同意书
export const getConsentStatus = params =>
  defHttp.get({
    url: `${basic_base_screen}/task/getConsentStatus`,
    params
  });

export function getSubordinateRegion(params) {
  return defHttp.get({
    url: Api.getSubordinateRegion,
    params
  });
}
