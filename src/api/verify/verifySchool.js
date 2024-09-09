import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const student = isDevMode() ? '/student' : '/student';
const base_screen = isDevMode() ? '/base-screen' : '/base-screen';

// 学生转入/转出-名单列表
export const studentTransferList = params =>
  defHttp.post({ url: `${student}/studentTransfer/studentTransferList`, params });

// 搜索学生信息
export const searchStudent = params => defHttp.get({ url: `${student}/studentTransfer/searchStudent`, params });

// 学生信息转出
export const transferOut = params => defHttp.post({ url: `${student}/studentTransfer/transferOut`, params });

// 学生信息转出
export const studentEditRecordDe = params => defHttp.get({ url: `${student}/studentEditRecord/deleted`, params });

// 学生转入-审核
export const check = params => defHttp.post({ url: `${student}/studentTransfer/check`, params });

// 学生转入/转出-撤回
export const studentTransferDetele = params => defHttp.get({ url: `${student}/studentTransfer/delete`, params });

// 学生信息修改列表
export const studentEditRecord = params => defHttp.post({ url: `${student}/studentEditRecord/pageList`, params });

// 学生信息修改申请
export const studentEditApply = params => defHttp.post({ url: `${student}/studentEditRecord/apply`, params });

// 学生信息修改重新提交
export const studentEditReset = params => defHttp.post({ url: `${student}/studentEditRecord/edit`, params });

// 发起审核列表-学校端
export const taskApplyList = params => defHttp.get({ url: `${base_screen}/screening/audit/task/applyList`, params });

// 发起审核-学校端
export const taskApply = params => defHttp.post({ url: `${base_screen}/screening/audit/task/apply`, params });

// 发起审核-重新提交
export const taskApplyEdit = params => defHttp.post({ url: `${base_screen}/screening/audit/task/applyEdit`, params });

// 获取发起计划列表-学校端
export const getCheckPlan = params => defHttp.get({ url: `${base_screen}/screening/audit/plan/getCheckPlan`, params });

// 获取计划学生列表-学校端
export const studentList = params => defHttp.get({ url: `${base_screen}/screening/audit/task/studentList`, params });

// 获取计划学生列表-学校端
export const applyDeleted = params => defHttp.get({ url: `${base_screen}/screening/audit/task/applyDeleted`, params });
