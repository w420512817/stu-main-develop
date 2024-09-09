import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getBuildingList: `${basic}/teachingBuilding/pageInfo`, //  教学楼分页
  addBuilding: `${basic}/teachingBuilding/add`,
  editBuilding: `${basic}/teachingBuilding/edit`,
  deleteBuilding: `${basic}/teachingBuilding/delete`,
  getBuildingdetail: `${basic}/teachingBuilding/editShow`,
  importExcelData: `${basic}/teachingBuilding/importExcelBuildingData`, // 文件导入
  exportExcelError: `${basic}/teachingBuilding/exportExcelBuildingData`, // 导出错误信息
  exportExcelList: `${basic}/teachingBuilding/exportExcelList` // 导出
};

export function getBuildingList(params) {
  return defHttp.get({
    url: Api.getBuildingList,
    params
  });
}
export function addBuilding(params) {
  return defHttp.post({
    url: Api.addBuilding,
    params
  });
}
export function editBuilding(params) {
  return defHttp.post({
    url: Api.editBuilding,
    params
  });
}

export function getBuildingdetail(params) {
  return defHttp.get({
    url: Api.getBuildingdetail,
    params
  });
}
export function deleteBuilding(params) {
  return defHttp.post({
    url: Api.deleteBuilding,
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
