import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/org' : '/org';

const Api = {
  getEquipmentTypeList: `${basic}/device/equipmentTypeList`, // 设备下拉框
  getEquipmentVendorList: `${basic}/device/equipmentVendorList`, // 设备厂商下拉框
  getEquipmentModelList: `${basic}/device/equipmentModelList`, // 设备型号下拉框
  AddOrgEquipment: `${basic}/device/addOrgEquipment`, // 添加学校设备
  getEquipmentPageList: `${basic}/device/equipmentPageList`, // 设备管理列表
  DeleteEquipment: `${basic}/device/deleteEquipment` // 删除学校设备
};

export function getEquipmentTypeList(params) {
  return defHttp.get({
    url: Api.getEquipmentTypeList,
    params
  });
}

export function getEquipmentVendorList(params) {
  return defHttp.get({
    url: Api.getEquipmentVendorList,
    params
  });
}

export function getEquipmentModelList(params) {
  return defHttp.get({
    url: Api.getEquipmentModelList,
    params
  });
}

export function AddOrgEquipment(params) {
  return defHttp.post({
    url: Api.AddOrgEquipment,
    params
  });
}

export function getEquipmentPageList(params) {
  return defHttp.get({
    url: Api.getEquipmentPageList,
    params
  });
}

export function DeleteEquipment(params) {
  return defHttp.post({
    url: Api.DeleteEquipment,
    params
  });
}
