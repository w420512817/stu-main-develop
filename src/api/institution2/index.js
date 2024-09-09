import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const org = isDevMode() ? '/org' : '/org';
const auth = isDevMode() ? '/auth' : '/auth';

// 学生转入/转出-名单列表
export const getAreaOrg = params => defHttp.post({ url: `${org}/orgManager/getAreaOrg`, params });

// 启用/停用政府机构
export const changeGovernmentStatus = params =>
  defHttp.post({ url: `${org}/organization/government/changeStatus`, params });

// 删除政府机构
export const deleteGovernment = params => defHttp.post({ url: `${org}/organization/government/delete`, params });

// 政府详情
export const detailGovernment = params => defHttp.get({ url: `${org}/organization/government/detail`, params });

export const schoolPermissionList = params => defHttp.get({ url: `${auth}/backstage/schoolPermission/list`, params });

export const schoolPermissionUsed = params => defHttp.get({ url: `${auth}/backstage/schoolPermission/used`, params });

export const getAppGroupSelectBox = params => defHttp.get({ url: `${org}/organization/appSelectBox`, params });

export const schoolDistrictSelectBox = params =>
  defHttp.get({ url: `${org}/organization/school/schoolDistrictSelectBox`, params });

export const editShowVO = params => defHttp.get({ url: `${org}/organization/government/editShow`, params });

export const editGovernment = params => defHttp.post({ url: `${org}/organization/government/edit`, params });

export const addGovernment = params => defHttp.post({ url: `${org}/organization/government/add`, params });

export const verifyCreditCode = params => defHttp.get({ url: `${org}/organization/verifyCreditCode`, params });

export const checkOrgNameExist = params => defHttp.get({ url: `${org}/organization/checkOrgNameExist`, params });

export const getSchoolList = params => defHttp.get({ url: `${org}/organization/school/PageList`, params });

export const changeSchoolStatus = params => defHttp.post({ url: `${org}/organization/school/changeStatus`, params });

export const deleteSchool = params => defHttp.post({ url: `${org}/organization/school/delete`, params });

export const eduListVO = params => defHttp.get({ url: `${org}/basicConfig/eduListVO`, params });

export const getSchoolDetail = params => defHttp.post({ url: `${org}/organization/school/detail`, params });

export const childSchoolSelectBoxList = params =>
  defHttp.get({ url: `${org}/organization/school/childSchoolSelectBoxList`, params });

export const addChildOrg = params => defHttp.post({ url: `${org}/organization/addChildOrg`, params });

export const orgChildList = params => defHttp.post({ url: `${org}/organization/orgChildList`, params });

export const removeChildSchool = params => defHttp.post({ url: `${org}/organization/orgRemoveChildSchool`, params });
