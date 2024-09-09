import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';
import { useApplicationStore } from '@/store';
import { AppTypeEnum } from '@common/enum/pageEnum';

const { appType } = useApplicationStore();

const base = isDevMode() ? '/base-screen' : '/base-screen';
const base_qyx = isDevMode() ? '/base-screen-qyx' : '/base-screen';
const eyesight = isDevMode() ? '/eyesight' : '/eyesight';
const caries = isDevMode() ? '/caries' : '/caries';
const checkup = isDevMode() ? '/checkup' : '/checkup';
const physicalTest = isDevMode() ? '/physicalTest' : '/physicalTest';
const spine = isDevMode() ? '/spine' : '/spine';

const Api = {
  exportEyesightScreenTemplate: `${eyesight}/screen/plan/exportScreeningtExcelModel`, //  导出筛查数据模板
  exportCariesScreenTemplate: `${caries}/screen/plan/exportScreeningtExcelModel`, //  导出筛查数据模板
  exportCheckupScreenTemplate: `${checkup}/screen/plan/exportScreeningtExcelModel`, //  导出筛查数据模板
  exportPhysicalTestScreenTemplate: `${physicalTest}/screen/plan/exportScreeningtExcelModel`, //  导出筛查数据模板

  exportEyesightTaskExcel: `${eyesight}/screen/export/exportTaskScreeningtExcel`, //  导出任务筛查数据
  exportCariesTaskExcel: `${caries}/screen/export/exportTaskScreeningtExcel`, //  导出任务筛查数据
  exportCheckupTaskExcel: `${checkup}/screen/export/exportTaskScreeningtExcel`, //  导出任务筛查数据
  exportPhysicalTestTaskExcel: `${physicalTest}/screen/export/exportTaskScreeningtExcel`, //  导出任务筛查数据
  exportSpineTaskExcel: `${spine}/screen/plan/getSpineScreeningList`, //  导出任务筛查数据

  exportEyesightNoScreenStu: `${eyesight}/screen/plan/exportNoScreeningStudent`, //  导出未筛查学生名单
  exportCariesNoScreenStu: `${caries}/screen/plan/exportNoCariesScreeningStudent`, //  导出未筛查学生名单
  exportCheckupNoScreenStu: `${checkup}/screen/plan/exportNoCheckUpScreeningStudent`, //  导出未筛查学生名单
  exportPhysicalTestNoScreenStu: `${physicalTest}/screen/plan/exportNoPhysicalScreeningStudent`, //  导出未筛查学生名单
  exportSpineScreenStu: `${spine}/screen/plan/getSpineNotScreeningList`, //  导出未筛查学生名单

  exportNotScreenStu: `${base}/plan/exportNotScreeningStudent`, //  导出不可筛查学生名单
  exportCountryVisionData: `${eyesight}/screen/task/exportCountryVisionData`, //  国家监测视力表下载

  exportVisionScreeningData: `${eyesight}/screen/task/exportVisionScreeningData`, // 导出视力检测数据
  getTaskScreeningItem: `${base}/plan/getTaskScreeningItem` // 查询任务得筛查项目
};

export function exportScreenTemplate(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.exportEyesightScreenTemplate,
    [AppTypeEnum.CARIES]: Api.exportCariesScreenTemplate,
    [AppTypeEnum.CHECKUP]: Api.exportCheckupScreenTemplate,
    [AppTypeEnum.PHYSICAL]: Api.exportPhysicalTestScreenTemplate
  };
  return defHttp.get({ url: Interface[appType], params, responseType: 'blob' }, { isReturnNativeResponse: true });
}
export function exportTaskExcel(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.exportEyesightTaskExcel,
    [AppTypeEnum.CARIES]: Api.exportCariesTaskExcel,
    [AppTypeEnum.CHECKUP]: Api.exportCheckupTaskExcel,
    [AppTypeEnum.PHYSICAL]: Api.exportPhysicalTestTaskExcel,
    [AppTypeEnum.SPINE]: Api.exportSpineTaskExcel
  };

  return defHttp.get(
    { url: Interface[appType], params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
}
export function exportNoScreenStu(params) {
  const Interface = {
    [AppTypeEnum.VISION]: Api.exportEyesightNoScreenStu,
    [AppTypeEnum.CARIES]: Api.exportCariesNoScreenStu,
    [AppTypeEnum.CHECKUP]: Api.exportCheckupNoScreenStu,
    [AppTypeEnum.PHYSICAL]: Api.exportPhysicalTestNoScreenStu,
    [AppTypeEnum.SPINE]: Api.exportSpineScreenStu
  };

  return defHttp.get(
    { url: Interface[appType], params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
}
export function exportNotScreenStu(params) {
  return defHttp.get(
    { url: Api.exportNotScreenStu, params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
}

export function exportVisionScreeningData(params) {
  return defHttp.get(
    {
      url: Api.exportVisionScreeningData,
      params,
      responseType: 'blob'
      // headers: { 'content-type': ContentTypeEnum.FORM_URLENCODED }
    },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
}

export function getTaskScreeningItem(params) {
  return defHttp.get({ url: Api.getTaskScreeningItem, params });
}

export function exportCountryVisionData(params) {
  return defHttp.get(
    { url: Api.exportCountryVisionData, params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
}

export const planClassExcel = params =>
  defHttp.get(
    { url: `${base}/spine/task/planClassExcel`, params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
export const planSchoolExcel = params =>
  defHttp.get(
    { url: `${base}/spine/task/planSchoolExcel`, params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
// 导出任务地区excel模板
export const planRegionExcel = params =>
  defHttp.get(
    { url: `${base_qyx}/plan/task/planRegionExcel`, params, responseType: 'blob' },
    { isReturnNativeResponse: true, timeout: 1000 * 60 }
  );
