import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const base_screen = isDevMode() ? '/base-screen' : '/base-screen';

// 获取计划学生列表-学校端
export const auditPlanStudent = params =>
  defHttp.get({ url: `${base_screen}/screening/audit/task/auditPlanStudent`, params });
