import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const student = isDevMode() ? '/student' : '/student';
const base_screen = isDevMode() ? '/base-screen' : '/base-screen';

// 学生转入/转出-名单列表
export const studentTransferList = params => defHttp.post({ url: `${student}/govAudit/studentTransferList`, params });

// 转入转出审核-政府端
export const transferCheck = params => defHttp.post({ url: `${student}/govAudit/transferCheck`, params });

// 设置转入学校
export const setTransferSchool = params => defHttp.post({ url: `${student}/govAudit/setTransferSchool`, params });

// 学生信息修改审核列表
export const studentEditList = params => defHttp.post({ url: `${student}/govAudit/studentEditList`, params });

// 学生信息修改审核
export const studentEditCheck = params => defHttp.post({ url: `${student}/govAudit/studentEditCheck`, params });

// 任务审核数据列表-政府端
export const taskApplyList = params => defHttp.get({ url: `${base_screen}/screening/audit/task/list`, params });

// 任务审核-政府端
export const taskCheck = params => defHttp.post({ url: `${base_screen}/screening/audit/task/check`, params });

// 获取计划下拉列表-政府端
export const planSelectBox = params => defHttp.get({ url: `${base_screen}/screening/audit/plan/selectBox`, params });
