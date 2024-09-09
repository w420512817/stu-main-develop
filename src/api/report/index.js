import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/config' : '/config';
const basic_qyj = isDevMode() ? '/config' : '/config';
const basic_wxt = isDevMode() ? '/config' : '/config';
const basic_qyx = isDevMode() ? '/config' : '/config';
const basic_qyx2 = isDevMode() ? '/config' : '/config';
const basic_busy = isDevMode() ? '/business-school' : '/business-school';
const basic_busy3 = isDevMode() ? '/org' : '/org';
const basic_busy4 = isDevMode() ? '/business-school' : '/business-school';
const Api = {
  schoolTypesGradeClassTree: `${basic_busy4}/schoolUser/schoolTypesGradeClassTree`, // 学段树
  getReportPlans: `${basic_busy4}/report/getPlanList`, // 计划列表

  getReportArea: `${basic_busy3}/report/getAreaTree`, // 地区树
  getReportSchools: `${basic_busy3}/report/getSchoolList`, // 学校列表

  getEyesightReport: `${basic_busy}/report/getEyesightReport`, // 视力报告详情概览
  getCariesReport: `${basic_busy}/report/getCariesReport`, // 龋齿报告详情

  getSchoolStdInfo: `${basic}/report/city/getSchoolStdInfo`, // 学校学生情况
  getOverallMyopiaInfo: `${basic}/report/city/getOverallMyopiaInfo`, // 近视情况
  getMyopiaInfoByPrefx: `${basic_qyj}/report/city/getMyopiaInfoByPrefx`, // 分学段近视情况
  getClassYearMyopiaInfo: `${basic_wxt}/report/city/getClassYearMyopiaInfo`, // 分年级情况
  getMyopiaInfoByAreaType: `${basic_qyj}/report/city/getMyopiaInfoByAreaType`, // 城市乡镇近视情况
  getMyopiaInfoBySchoolType: `${basic_qyj}/report/city/getMyopiaInfoBySchoolType`, // 不同学校类型近视情况
  getMyopiaInfoByAge: `${basic_qyj}/report/city/getMyopiaInfoByAge`, // 不同年龄近视情况
  getVisionDistribute: `${basic_qyj}/report/city/getVisionDistribute`, // 视力分布情况
  getDiopterSituation: `${basic_qyj}/report/city/getDiopterSituation`, // 屈光度分布情况
  getCityShortSightedBySex: `${basic_wxt}/report/city/getCityShortSightedBySex`, // 分男女情况
  getKeySchoolMyopiaSituation: `${basic_wxt}/report/city/getKeySchoolMyopiaSituation`, // 重点非重点
  getMyopiaCorrectInfo: `${basic_qyj}/report/city/getMyopiaCorrectInfo`, // 近视矫正
  getCityHyperopiaReserve: `${basic_wxt}/report/city/getCityHyperopiaReserve`, // 远视储备
  getMyopiaTypeInfo: `${basic_qyx}/report/city/getMyopiaTypeInfo`, // 近视远视散光情况
  getCityPoorVision: `${basic_wxt}/report/city/getCityPoorVision`, // 视力不良
  getPrefixMyopiaRate: `${basic_wxt}/report/city/getPrefixMyopiaRate`, // 附录-学段近视率

  getSchoolStdInfo_r: `${basic_qyx}/report/region/getSchoolStdInfo`, // 区-学校学生情况
  getOverallMyopiaInfo_r: `${basic_qyx}/report/region/getOverallMyopiaInfo`, // 区-近视情况
  getMyopiaInfoByPrefx_r: `${basic_qyx}/report/region/getMyopiaInfoByPrefx`, // 区-分学段近视情况
  getMyopiaInfoByAreaType_r: `${basic_qyx}/report/region/getMyopiaInfoByAreaType`, // 区-城市乡镇近视情况
  getMyopiaInfoBySchoolType_r: `${basic_qyx}/report/region/getMyopiaInfoBySchoolType`, // 区-不同学校类型近视情况
  getMyopiaInfoByAge_r: `${basic_qyx}/report/region/getMyopiaInfoByAge`, // 区-不同年龄近视情况
  getVisionDistribute_r: `${basic_qyx}/report/region/getVisionDistribute`, // 区-视力分布
  getDiopterSituation_r: `${basic_qyx}/report/region/getDiopterSituation`, // 区-屈光分布
  getMyopiaCorrectInfo_r: `${basic_qyx}/report/region/getMyopiaCorrectInfo`, // 区-近视矫正情况
  getRegionHyperopiaReserve_r: `${basic_qyx}/report/region/getRegionHyperopiaReserve`, // 区-远视储备情况
  getMyopiaTypeInfo_r: `${basic_qyx}/report/region/getMyopiaTypeInfo`, // 区-近视远视散光
  getRegionPoorVision_r: `${basic_qyx}/report/region/getRegionPoorVision`, // 区-视力不良
  getPrefixMyopiaRate_r: `${basic_qyx}/report/region/getPrefixMyopiaRate`, // 区-学段近视率
  getSchoolMyopiaInfo_r: `${basic_qyx}/report/region/getSchoolMyopiaInfo`, // 区-学校近视情况
  getSchoolMyopiaCorrectInfo_r: `${basic_qyx}/report/region/getSchoolMyopiaCorrectInfo`, // 区-学校近视矫正情况
  getSchoolMyopiaTypeInfo_r: `${basic_qyx}/report/region/getSchoolMyopiaTypeInfo`, // 区-学校近视远视散光情况
  getRegionSchoolPoorVision_r: `${basic_qyx}/report/region/getRegionSchoolPoorVision`, // 区-学校视力不良情况

  getOverallMyopiaInfo_s: `${basic_qyx}/report/school/getOverallMyopiaInfo`, // 校-近视情况
  getMyopiaCorrectInfo_s: `${basic_qyx}/report/school/getMyopiaCorrectInfo`, // 校-视力矫正情况
  getMyopiaTrend_s: `${basic_qyx}/report/school/getMyopiaTrend`, // 校-近视趋势
  getSchoolPoorVision_s: `${basic_qyx}/report/school/getSchoolPoorVision`, // 校-视力不良
  getSchoolHyperopiaReserve_s: `${basic_qyx}/report/school/getSchoolHyperopiaReserve`, // 校-远视储备
  getVisionDistribute_s: `${basic_qyx}/report/school/getVisionDistribute`, // 校-视力分布
  getDiopterSituation_s: `${basic_qyx}/report/school/getDiopterSituation`, // 校-屈光分布
  getClassMyopiaInfo_s: `${basic_qyx}/report/school/getClassMyopiaInfo`, // 校-附件：班级近视率
  getClassMyopiaCorrectInfo_s: `${basic_qyx}/report/school/getClassMyopiaCorrectInfo`, // 校-附件：班级近视矫正
  getSchoolMyopiaTypeInfo_s: `${basic_qyx}/report/school/getSchoolMyopiaTypeInfo`, // 校-附件：班级近视远视散光
  getScreeningSituation_s: `${basic_qyx2}/report/caries/school/getScreeningSituation`, // 校-龋齿筛查情况
  getCariesInfo_s: `${basic_qyx2}/report/caries/school/getCariesInfo`, // 校-学校龋齿情况
  getCariesTrend_s: `${basic_qyx2}/report/caries/school/getCariesTrend`, // 校-龋齿患龋率趋势

  getOverallMyopiaInfo_g: `${basic_qyx}/report/grade/getOverallMyopiaInfo`, // 年级-近视情况
  getMyopiaCorrectInfo_g: `${basic_qyx}/report/grade/getMyopiaCorrectInfo`, // 年级-视力矫正情况
  getMyopiaTrend_g: `${basic_qyx}/report/grade/getMyopiaTrend`, // 年级-近视趋势
  getSchoolPoorVision_g: `${basic_qyx}/report/grade/getGradePoorVision`, // 年级-视力不良
  getSchoolHyperopiaReserve_g: `${basic_qyx}/report/grade/getGradeHyperopiaReserve`, // 年级-远视储备
  getVisionDistribute_g: `${basic_qyx}/report/grade/getVisionDistribute`, // 年级-视力分布
  getDiopterSituation_g: `${basic_qyx}/report/grade/getDiopterSituation`, // 年级-屈光分布
  getScreeningSituation_g: `${basic_qyx}/report/caries/grade/getScreeningSituation`, // 年级-龋齿筛查情况
  getCariesInfo_g: `${basic_qyx}/report/caries/grade/getCariesInfo`, // 年级-年级龋齿情况
  getCariesTrend_g: `${basic_qyx}/report/caries/grade/getCariesTrend`, // 年级-患龋率趋势

  getOverallMyopiaInfo_c: `${basic_qyx}/report/class/getOverallMyopiaInfo`, // 班级-近视情况
  getMyopiaCorrectInfo_c: `${basic_qyx}/report/class/getMyopiaCorrectInfo`, // 班级-视力矫正情况
  getMyopiaTrend_c: `${basic_qyx}/report/class/getMyopiaTrend`, // 班级-近视趋势
  getSchoolPoorVision_c: `${basic_qyx}/report/class/getClassPoorVision`, // 班级-视力不良
  getSchoolHyperopiaReserve_c: `${basic_qyx}/report/class/getClassHyperopiaReserve`, // 班级-远视储备
  getVisionDistribute_c: `${basic_qyx}/report/class/getVisionDistribute`, // 班级-视力分布
  getDiopterSituation_c: `${basic_qyx}/report/class/getDiopterSituation`, // 班级-屈光分布
  getScreeningSituation_c: `${basic_qyx}/report/caries/class/getScreeningSituation`, // 班级-龋齿筛查情况
  getCariesInfo_c: `${basic_qyx}/report/caries/class/getCariesInfo`, // 班级-年级龋齿情况
  getCariesTrend_c: `${basic_qyx}/report/caries/class/getCariesTrend` // 班级-患龋率趋势
};

export function schoolTypesGradeClassTree(params) {
  return defHttp.get({ url: Api.schoolTypesGradeClassTree, params });
}
export function getReportArea(params) {
  return defHttp.get({ url: Api.getReportArea, params });
}
export function getReportSchools(params) {
  return defHttp.get({ url: Api.getReportSchools, params });
}
export function getReportPlans(params) {
  return defHttp.get({ url: Api.getReportPlans, params });
}

export function getEyesightReport(params) {
  return defHttp.get({ url: Api.getEyesightReport, params });
}
export function getCariesReport(params) {
  return defHttp.get({ url: Api.getCariesReport, params });
}

export function getSchoolStdInfo(params) {
  return defHttp.get({ url: Api.getSchoolStdInfo, params });
}
export function getOverallMyopiaInfo(params) {
  return defHttp.get({ url: Api.getOverallMyopiaInfo, params });
}
export function getMyopiaInfoByPrefx(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByPrefx, params });
}
export function getMyopiaInfoByAreaType(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByAreaType, params });
}
export function getMyopiaInfoBySchoolType(params) {
  return defHttp.get({ url: Api.getMyopiaInfoBySchoolType, params });
}
export function getMyopiaInfoByAge(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByAge, params });
}
export function getVisionDistribute(params) {
  return defHttp.get({ url: Api.getVisionDistribute, params });
}
export function getDiopterSituation(params) {
  return defHttp.get({ url: Api.getDiopterSituation, params });
}
export function getClassYearMyopiaInfo(params) {
  return defHttp.get({ url: Api.getClassYearMyopiaInfo, params });
}
export function getCityShortSightedBySex(params) {
  return defHttp.get({ url: Api.getCityShortSightedBySex, params });
}
export function getKeySchoolMyopiaSituation(params) {
  return defHttp.get({ url: Api.getKeySchoolMyopiaSituation, params });
}
export function getMyopiaCorrectInfo(params) {
  return defHttp.get({ url: Api.getMyopiaCorrectInfo, params });
}
export function getCityHyperopiaReserve(params) {
  return defHttp.get({ url: Api.getCityHyperopiaReserve, params });
}
export function getMyopiaTypeInfo(params) {
  return defHttp.get({ url: Api.getMyopiaTypeInfo, params });
}
export function getCityPoorVision(params) {
  return defHttp.get({ url: Api.getCityPoorVision, params });
}
export function getPrefixMyopiaRate(params) {
  return defHttp.get({ url: Api.getPrefixMyopiaRate, params });
}
export function getSchoolStdInfo_r(params) {
  return defHttp.get({ url: Api.getSchoolStdInfo_r, params });
}
export function getOverallMyopiaInfo_r(params) {
  return defHttp.get({ url: Api.getOverallMyopiaInfo_r, params });
}
export function getMyopiaInfoByPrefx_r(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByPrefx_r, params });
}
export function getMyopiaInfoByAreaType_r(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByAreaType_r, params });
}
export function getMyopiaInfoBySchoolType_r(params) {
  return defHttp.get({ url: Api.getMyopiaInfoBySchoolType_r, params });
}
export function getMyopiaInfoByAge_r(params) {
  return defHttp.get({ url: Api.getMyopiaInfoByAge_r, params });
}
export function getVisionDistribute_r(params) {
  return defHttp.get({ url: Api.getVisionDistribute_r, params });
}
export function getDiopterSituation_r(params) {
  return defHttp.get({ url: Api.getDiopterSituation_r, params });
}
export function getMyopiaCorrectInfo_r(params) {
  return defHttp.get({ url: Api.getMyopiaCorrectInfo_r, params });
}
export function getRegionHyperopiaReserve_r(params) {
  return defHttp.get({ url: Api.getRegionHyperopiaReserve_r, params });
}
export function getMyopiaTypeInfo_r(params) {
  return defHttp.get({ url: Api.getMyopiaTypeInfo_r, params });
}
export function getRegionPoorVision_r(params) {
  return defHttp.get({ url: Api.getRegionPoorVision_r, params });
}
export function getPrefixMyopiaRate_r(params) {
  return defHttp.get({ url: Api.getPrefixMyopiaRate_r, params });
}
export function getSchoolMyopiaInfo_r(params) {
  return defHttp.get({ url: Api.getSchoolMyopiaInfo_r, params });
}
export function getSchoolMyopiaCorrectInfo_r(params) {
  return defHttp.get({ url: Api.getSchoolMyopiaCorrectInfo_r, params });
}
export function getSchoolMyopiaTypeInfo_r(params) {
  return defHttp.get({ url: Api.getSchoolMyopiaTypeInfo_r, params });
}
export function getRegionSchoolPoorVision_r(params) {
  return defHttp.get({ url: Api.getRegionSchoolPoorVision_r, params });
}

export function getOverallMyopiaInfo_s(params) {
  return defHttp.get({ url: Api.getOverallMyopiaInfo_s, params });
}
export function getMyopiaCorrectInfo_s(params) {
  return defHttp.get({ url: Api.getMyopiaCorrectInfo_s, params });
}
export function getMyopiaTrend_s(params) {
  return defHttp.get({ url: Api.getMyopiaTrend_s, params });
}
export function getSchoolPoorVision_s(params) {
  return defHttp.get({ url: Api.getSchoolPoorVision_s, params });
}
export function getSchoolHyperopiaReserve_s(params) {
  return defHttp.get({ url: Api.getSchoolHyperopiaReserve_s, params });
}
export function getVisionDistribute_s(params) {
  return defHttp.get({ url: Api.getVisionDistribute_s, params });
}
export function getDiopterSituation_s(params) {
  return defHttp.get({ url: Api.getDiopterSituation_s, params });
}
export function getClassMyopiaInfo_s(params) {
  return defHttp.get({ url: Api.getClassMyopiaInfo_s, params });
}
export function getClassMyopiaCorrectInfo_s(params) {
  return defHttp.get({ url: Api.getClassMyopiaCorrectInfo_s, params });
}
export function getSchoolMyopiaTypeInfo_s(params) {
  return defHttp.get({ url: Api.getSchoolMyopiaTypeInfo_s, params });
}
export function getScreeningSituation_s(params) {
  return defHttp.get({ url: Api.getScreeningSituation_s, params });
}
export function getCariesInfo_s(params) {
  return defHttp.get({ url: Api.getCariesInfo_s, params });
}
export function getCariesTrend_s(params) {
  return defHttp.get({ url: Api.getCariesTrend_s, params });
}
export function getOverallMyopiaInfo_g(params) {
  return defHttp.get({ url: Api.getOverallMyopiaInfo_g, params });
}
export function getMyopiaCorrectInfo_g(params) {
  return defHttp.get({ url: Api.getMyopiaCorrectInfo_g, params });
}
export function getMyopiaTrend_g(params) {
  return defHttp.get({ url: Api.getMyopiaTrend_g, params });
}
export function getSchoolPoorVision_g(params) {
  return defHttp.get({ url: Api.getSchoolPoorVision_g, params });
}
export function getSchoolHyperopiaReserve_g(params) {
  return defHttp.get({ url: Api.getSchoolHyperopiaReserve_g, params });
}
export function getVisionDistribute_g(params) {
  return defHttp.get({ url: Api.getVisionDistribute_g, params });
}
export function getDiopterSituation_g(params) {
  return defHttp.get({ url: Api.getDiopterSituation_g, params });
}
export function getScreeningSituation_g(params) {
  return defHttp.get({ url: Api.getScreeningSituation_g, params });
}
export function getCariesInfo_g(params) {
  return defHttp.get({ url: Api.getCariesInfo_g, params });
}
export function getCariesTrend_g(params) {
  return defHttp.get({ url: Api.getCariesTrend_g, params });
}
export function getOverallMyopiaInfo_c(params) {
  return defHttp.get({ url: Api.getOverallMyopiaInfo_c, params });
}
export function getMyopiaCorrectInfo_c(params) {
  return defHttp.get({ url: Api.getMyopiaCorrectInfo_c, params });
}
export function getMyopiaTrend_c(params) {
  return defHttp.get({ url: Api.getMyopiaTrend_c, params });
}
export function getSchoolPoorVision_c(params) {
  return defHttp.get({ url: Api.getSchoolPoorVision_c, params });
}
export function getSchoolHyperopiaReserve_c(params) {
  return defHttp.get({ url: Api.getSchoolHyperopiaReserve_c, params });
}
export function getVisionDistribute_c(params) {
  return defHttp.get({ url: Api.getVisionDistribute_c, params });
}
export function getDiopterSituation_c(params) {
  return defHttp.get({ url: Api.getDiopterSituation_c, params });
}
export function getScreeningSituation_c(params) {
  return defHttp.get({ url: Api.getScreeningSituation_c, params });
}
export function getCariesInfo_c(params) {
  return defHttp.get({ url: Api.getCariesInfo_c, params });
}
export function getCariesTrend_c(params) {
  return defHttp.get({ url: Api.getCariesTrend_c, params });
}
