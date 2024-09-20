/*
 * @Author: wjq-work\wjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wjq-work\wjq
 * @LastEditTime: 2024-09-20 17:15:32
 */
import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/data-center' : '/data-center';

const Api = {
  screenVisionOverview: `${basic}/screenVision/overview`, // 全省/全市筛查数据总览（左上）
  batchContrast: `${basic}/screenVision/batchContrast`, // 筛查批次对比图（左中）
  prefixOverview: `${basic}/screenVision/prefixOverview`, // 各学段筛查数据总览（左下）
  myopiaRate: `${basic}/screenVision/myopiaRate`, // 按地区近视率（中上） 右上-地区
  currentReport: `${basic}/screenVision/currentReport`, // 实时筛查（中下）
  prefixRate: `${basic}/screenVision/prefixRate`, // 右上-学段
  myopiaLevel: `${basic}/screenVision/myopiaLevel`, // 右中-地区
  prefixlevel: `${basic}/screenVision/prefixlevel`, // 右中-学段
  hyperopiaRate: `${basic}/screenVision/hyperopiaRate` // 各年级远视储备情况
};

export function screenVisionOverview(params) {
  return defHttp.get({ url: Api.screenVisionOverview, params });
}
export function batchContrast(params) {
  return defHttp.get({ url: Api.batchContrast, params });
}
export function prefixOverview(params) {
  return defHttp.get({ url: Api.prefixOverview, params });
}
export function getMyopiaRate(params) {
  return defHttp.get({ url: Api.myopiaRate, params });
}
export function getCurrentReport(params) {
  return defHttp.get({ url: Api.currentReport, params });
}
export function getPrefixRate(params) {
  return defHttp.get({ url: Api.prefixRate, params });
}
export function getMyopiaLevel(params) {
  return defHttp.get({ url: Api.myopiaLevel, params });
}
export function getPrefixlevel(params) {
  return defHttp.get({ url: Api.prefixlevel, params });
}
export function hyperopiaRate(params) {
  return defHttp.get({ url: Api.hyperopiaRate, params });
}
