import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';
const Api = {
  getFloorList: `${basic}/floor/pageInfo`, //  楼层分页
  addFloor: `${basic}/floor/add`,
  editFloor: `${basic}/floor/edit`,
  getFloorDetail: `${basic}/floor/editShow`,
  deleteFloor: `${basic}/floor/delete`,
  importExcelData: `${basic}/floor/importExcelFloorData`, // 文件导入
  exportExcelError: `${basic}/floor/exportExcelFloorData`, // 导出错误信息
  exportExcelList: `${basic}/floor/exportExcelList` // 导出
};

export function getFloorList(params) {
  return defHttp.get({
    url: Api.getFloorList,
    params
  });
}
export function addFloor(params) {
  return defHttp.post({
    url: Api.addFloor,
    params
  });
}
export function editFloor(params) {
  return defHttp.post({
    url: Api.editFloor,
    params
  });
}

export function getFloorDetail(params) {
  return defHttp.get({
    url: Api.getFloorDetail,
    params
  });
}
export function deleteFloor(params) {
  return defHttp.post({
    url: Api.deleteFloor,
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
