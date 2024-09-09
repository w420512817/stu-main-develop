const { VITE_APP_INDEX_URL = '' } = import.meta.env;
export const PageEnum = {
  // basic login path
  BASE_LOGIN: import.meta.env.VITE_AUTH_CENTER_URL,
  // basic home path
  BASE_HOME: VITE_APP_INDEX_URL || '/dashboard/overview',
  // error page path
  ERROR_PAGE: '/exception',
  // not found page name
  NOT_FOUND_NAME: 'NotFound'
};

/**
 * 各子应用类型相关，值与后端已约定，后续考虑从接口层面获取
 * */
export const AppTypeEnum = {
  VISION: 1, // 视力应用
  CARIES: 2, // 口腔龋齿应用
  CHECKUP: 3, // 体检应用
  PHYSICAL: 4, // 体测应用
  SPINE: 5 // 正脊应用
};
// 应用名称
export const AppNameEnum = {
  VISION: '视力', // 视力应用
  CARIES: '龋齿', // 口腔龋齿应用
  CHECKUP: '体检', // 体检应用
  PHYSICAL: '体测', // 体测应用
  SPINE: '正脊' // 正脊应用
};

/**
 * 各角色机构类型枚举
 *  */
export const OrgTypeEnum = {
  10: 'SCHOOL',
  20: 'HOSPITAL',
  30: 'GOVERMENT',
  40: 'SOCIAL',
  50: 'PARENT_ADMIN',
  90: 'CONSOLE'
};
/**
 * 各政府机构类型枚举
 *  */
export const GovLevelEnum = {
  1: 'PROVINCE',
  2: 'CITY',
  3: 'REGION',
  4: 'SCHOOL'
};
/**
 * 筛查管理模式
 *  */
export const chooseModeEnum = {
  1: '计划模式',
  2: '任务模式'
};
/**
 * 筛查管理模式
 *  */

/**
 * 页面操作按钮相关
 * */
export const AC_SEARCH = 'SEARCH'; // 搜索
export const AC_TRIGGER = 'TRIGGER'; // 切换
export const AC_ADD = 'ADD'; // 新增
export const AC_EDIT = 'EDIT'; // 编辑
export const AC_DELETE = 'DELETE'; // 删除
export const AC_DETAILS = 'DETAILS'; // 详情
export const AC_CANCEL = 'CANCEL'; // 取消
export const AC_STOP_START = 'STOP_START'; // 启用暂停
export const AC_RESET = 'RESET'; // 重置
export const AC_PREVIEW = 'PREVIEW '; // 预览
export const AC_PASS = 'PASS '; // 通过
export const AC_REJECT = 'REJECT '; // 驳回
export const AC_TRUN_OUT = 'TRUN_OUT'; // 转出
export const AC_REPORT = 'REPORT'; // 报告
export const AC_IMPORT = 'IMPORT '; // 导入
export const AC_EXPORT = 'EXPORT '; // 导出
export const AC_COMPLETE = 'COMPLETE'; // 完成
export const AC_UP_REPORT = 'UP_REPORT'; // 上报
export const AC_PRINT = 'PRINT'; // 打印
export const AC_CLEAR = 'CLEAR'; // 清除
export const AC_ASSOCITED = 'ASSOCITED'; // 关联
export const AC_LOGIN = 'LOGIN'; // 登录
export const AC_OPEN = 'OPEN';
export const AC_SCHOOL = 'SCHOOL'; // 学校
export const AC_HOSPTIAL = 'HOSPTIAL'; // 医院
export const AC_SOCIETY = 'SOCIETY'; // 社会机构
export const AC_JOIN = 'JOIN'; // 加入筛查
export const AC_CONFIG = 'CONFIG'; // 配置
export const AC_CLASS_MANAGER = 'CLASS_MANAGER'; // 班级管理
