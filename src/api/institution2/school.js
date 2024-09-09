import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const org = isDevMode() ? '/org' : '/org';
const base_screen = isDevMode() ? '/base-screen' : '/base-screen';

export const getSchoolDetailModify = params => defHttp.post({ url: `${org}/organization/school/editShowVO`, params });

export const editSchool = params => defHttp.post({ url: `${org}/organization/school/edit`, params });

export const addSchool = params => defHttp.post({ url: `${org}/organization/school/add`, params });

export const eduSystemInfoBySchoolType = params =>
  defHttp.post({ url: `${org}/organization/school/eduSystemInfoBySchoolType`, params });

export const selectHigherSchool = params =>
  defHttp.get({ url: `${org}/organization/school/selectHigherSchool`, params });

export const childSchoolCreditCode = params =>
  defHttp.get({ url: `${org}/organization/school/childSchoolCreditCode`, params });

export const bindPlanOrg = params => defHttp.get({ url: `${base_screen}/plan/syncPlanOrg`, params });
