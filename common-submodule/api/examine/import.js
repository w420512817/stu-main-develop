import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

import { useApplicationStore } from '@common/store/application';
import { AppTypeEnum } from '@common/enum/pageEnum';

const eyesight = isDevMode() ? '/eyesight' : '/eyesight';
const caries = isDevMode() ? '/caries' : '/caries';
const checkup = isDevMode() ? '/checkup' : '/checkup';
const physicalTest = isDevMode() ? '/physicalTest' : '/physicalTest';
const spine = isDevMode() ? '/spine' : '/spine';
const student = isDevMode() ? '/student' : '/student';
const base_screen = isDevMode() ? '/base-screen' : '/base-screen';

export const importScreenExcel = params => defHttp.uploadFile({ url: `${student}/import/student/uploadFile` }, params);

export function submitImportTask(params) {
  const { appType } = useApplicationStore();
  const Interface = {
    [AppTypeEnum.VISION]: `${eyesight}/screen/import/submitTask`,
    [AppTypeEnum.CARIES]: `${caries}/import/caries/submitTask`,
    [AppTypeEnum.CHECKUP]: `${checkup}/import/checkup/submitTask`,
    [AppTypeEnum.PHYSICAL]: `${physicalTest}/import/physical/submitTask`,
    [AppTypeEnum.SPINE]: `${spine}/import/spine/submitTask`
  };
  return defHttp.post({ url: Interface[appType], params });
}
export function getTaskProgress(params) {
  const { appType } = useApplicationStore();
  const Interface = {
    [AppTypeEnum.VISION]: `${eyesight}/screen/import/getTaskProgress`,
    [AppTypeEnum.CARIES]: `${caries}/import/caries/getTaskProgress`,
    [AppTypeEnum.CHECKUP]: `${checkup}/import/checkup/getTaskProgress`,
    [AppTypeEnum.PHYSICAL]: `${physicalTest}/import/physical/getTaskProgress`,
    [AppTypeEnum.SPINE]: `${spine}/import/spine/getTaskProgress`
  };
  return defHttp.get({ url: Interface[appType], params });
}
export function cancelImportTask(params) {
  const { appType } = useApplicationStore();
  const Interface = {
    [AppTypeEnum.VISION]: eyesight,
    [AppTypeEnum.CARIES]: caries,
    [AppTypeEnum.CHECKUP]: checkup,
    [AppTypeEnum.PHYSICAL]: physicalTest,
    [AppTypeEnum.SPINE]: spine
  };
  return defHttp.get({ url: `${Interface[appType]}/import/student/cancelTask`, params });
}
//  获取任务处理条数
export function getTaskDealCount(params) {
  const { appType } = useApplicationStore();
  const Interface = {
    [AppTypeEnum.VISION]: eyesight,
    [AppTypeEnum.CARIES]: caries,
    [AppTypeEnum.CHECKUP]: checkup,
    [AppTypeEnum.PHYSICAL]: physicalTest,
    [AppTypeEnum.SPINE]: spine
  };
  return defHttp.get({ url: `${Interface[appType]}/screen/import/getTaskDealCount`, params });
}
export function exportErrorData(params) {
  const { appType } = useApplicationStore();
  const Interface = {
    [AppTypeEnum.VISION]: `${eyesight}/screen/import/exportErrorData`,
    [AppTypeEnum.CARIES]: `${caries}/import/caries/exportErrorData`,
    [AppTypeEnum.CHECKUP]: `${checkup}/import/checkup/exportErrorData`,
    [AppTypeEnum.PHYSICAL]: `${physicalTest}/import/physical/exportErrorData`,
    [AppTypeEnum.SPINE]: `${spine}/import/spine/exportErrorData`
  };
  return defHttp.get({ url: Interface[appType], params, responseType: 'blob' }, { isReturnNativeResponse: true });
}

// 市区管理员导入筛查任务
export const importRegionScreeningNumber = params =>
  defHttp.uploadFile({ url: `${student}/spine/task/importRegionScreeningNumber` }, params);

export const importScreeningNumber = params =>
  defHttp.uploadFile({ url: `${base_screen}/plan/task/importScreeningNumber` }, params);
