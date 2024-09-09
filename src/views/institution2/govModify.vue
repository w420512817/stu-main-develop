<template>
  <n-space vertical class="w-full">
    <n-form ref="formRef" :model="formValue" :rules="govRules" label-placement="top" require-mark-placement="left">
      <n-card class="mb-3">
        <h2 v-if="query.id" class="font-bold">{{ formValue.name }}</h2>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">基础信息</p>
        </template>
        <n-grid cols="3" x-gap="50">
          <n-form-item-gi label="政府机构名称:" path="name">
            <n-input v-model:value="formValue.name" :allow-input="illegalCharacter" placeholder="请输入政府机构名称" />
          </n-form-item-gi>
          <n-form-item-gi label="政府机构类型:" path="orgAttribute">
            <n-select
              v-model:value="formValue.orgAttribute"
              :options="governmentAttrOptions"
              placeholder="请选择政府机构类型"
            />
          </n-form-item-gi>
          <n-form-item-gi label="统一社会信用代码:" path="socialCreditCode" class="releative">
            <n-input v-model:value="formValue.socialCreditCode" placeholder="请输入统一社会信用代码" />
            <a href="https://www.tianyancha.com/" target="_blank" class="text-primary absolute right-0 -top-24px">
              立即查询
            </a>
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:" path="regionId">
            <n-cascader
              v-model:value="formValue.regionId"
              check-strategy="child"
              placeholder="请选择所属地区"
              :options="selfArea"
              label-field="regionName"
              value-field="regionId"
              show-path
              remote
              @update:value="updateRegion"
            />
          </n-form-item-gi>
          <n-form-item-gi label="详细地址:" path="address">
            <n-input v-model:value="formValue.address" type="text" placeholder="请输入详细地址" maxlength="100" />
          </n-form-item-gi>
          <n-form-item-gi label="机构坐标:" path="lnglat">
            <n-input v-model:value="formValue.lnglat" placeholder="请选择机构坐标" disabled />
            <icon-bxs:map class="ml-10px text-primary text-40px" @click="openMapModal" />
          </n-form-item-gi>
          <n-form-item-gi label="管理区域:" path="manageAreaId">
            <area-cascader
              v-model:value="formValue.manageAreaId"
              :disabled="!formValue.regionId"
              check-strategy="all"
              placeholder="请选择管理区域"
              :options="manageAreaOpt"
              @update:val="updateManageArea"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="formValue.regionType == 3 || formValue.manageEduDistrictId" label="管理学区:" path="">
            <dropdown-select
              ref="xuequ"
              v-model:value="formValue.manageEduDistrictId"
              multiple
              max-tag-count="responsive"
              :list-api="schoolDistrictSelectBox"
              :params="{ regionId: formValue.manageAreaId }"
              label-field="schoolDistrict"
              value-field="id"
              placeholder="请选择管理学区"
            />
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">账户信息</p>
        </template>
        <n-grid cols="3" x-gap="50">
          <!-- <n-form-item-gi label="机构权限组:" path="roleId">
            <dropdown-select
              ref="roleIdRef"
              v-model:value="formValue.roleId"
              :list-api="roleSelectBox"
              :params="{ departmentId: '8' }"
              placeholder="请选择机构权限组"
              label-field="name"
              value-field="id"
            />
          </n-form-item-gi> -->
          <n-form-item-gi label="账号数量:" path="accountNumber">
            <n-select
              v-model:value="formValue.accountNumber"
              :options="accountNumberOptions"
              placeholder="请选择账号数量"
            />
          </n-form-item-gi>
          <n-form-item-gi label="机构有效期:" path="dateRange">
            <n-date-picker
              v-model:formatted-value="formValue.dateRange"
              type="daterange"
              format="yyyy-MM-dd"
              :is-date-disabled="disabledYesterday"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi label="脱敏设置:" path="dataMaskingType">
            <n-switch v-model:value="formValue.switch" disabled />
            <n-text class="text-primary ml-12px">{{ formValue.switch ? '已开启' : '已关闭' }}</n-text>
            <n-text
              class="text-primary ml-12px cursor-pointer"
              @click="openDesModal(true, { radioVal: formValue.switch, checkboxVals: formValue.dataMaskingType })"
            >
              设置
            </n-text>
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">应用信息</p>
        </template>
        <n-button type="primary" ghost text class="mb-4" @click="addApp">添加应用组</n-button>
        <n-grid v-for="(item, index) in formValue.appList" :key="index" cols="3" x-gap="60" class="items-center">
          <n-form-item-gi
            label="应用组名称:"
            :path="`appList[${index}].appGroupId`"
            :rule="{ required: true, trigger: ['blur'], message: '请选择应用名称', key: 'app' }"
          >
            <n-select
              v-model:value="item.appGroupId"
              :options="appGroupOptions"
              :disabled="isDisabledApp(item.appGroupId)"
              label-field="appGroupName"
              value-field="id"
              placeholder="请选择应用名称"
              @update:value="setDisabledAppGroup"
            />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-button
              v-if="formValue.appList.length > 1"
              type="primary"
              ghost
              text
              class="mb-3"
              :disabled="isDisabledApp(item.appGroupId)"
              @click="deleteApp(index)"
            >
              删除应用
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card class="text-right mb-8">
        <n-button class="mr-3" @click="go('/institution/government-list')">取消</n-button>
        <n-button type="primary" :disabled="loading" @click="submit">提交</n-button>
      </n-card>
    </n-form>
    <Desensitization @register="registerDes" @on-success="updateSelect" />
    <MapLngLat title="查找机构坐标" :name="formValue.name" @register="registerMap" @on-success="handleLngLatChange" />
  </n-space>
</template>

<script setup>
import { reactive, onBeforeMount, ref, nextTick, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import { disabledYesterday } from '@common/utils/common/date';
import { illegalCharacter } from '@common/utils/common';
import { useRoute } from 'vue-router';

import { getAppGroupSelectBox, schoolDistrictSelectBox, editShowVO } from '@/api/institution2';
import { editGovernment, addGovernment } from '@/api/institution2';

import MapLngLat from './modal/MapLngLat.vue';
import Desensitization from './modal/Tuomin.vue';

import { governmentAttrOptions, accountNumberOptions, createGovRules } from './index.data';

import { useModal } from '@common/components/custom/Modal';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';
import useLoading from '@common/hooks/useLoading';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';

const { getAreaTree, userInfo } = useUserStore();

const { fetch: getAppGroups } = useApi(getAppGroupSelectBox);
const { setTitle } = useTabs();
const [registerMap, { openModal: openMapModal }] = useModal();
const [registerDes, { openModal: openDesModal }] = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { go } = useGo();
const { query } = useRoute();

const origin = {
  dateRange: null,
  switch: true,
  name: '',
  isDataMasking: 1,
  dataMaskingType: [1, 2, 3, 4, 5, 6, 7, 8],
  orgAttribute: null,
  manageAreaId: null,
  regionType: null,
  copyname: '',
  appList: [{ appGroupId: null }]
};

const formRef = ref();
const xuequ = ref();
// const roleIdRef = ref();
const appGroupOptions = ref([]);
const formValue = reactive(cloneDeep(origin));
const govRules = createGovRules(formValue);
const manageAreaOpt = ref([]);
const selfArea = computed(() => {
  let arr = [...getAreaTree];
  for (let index = 0; index < arr.length; index++) {
    const area = arr[index];
    if (area.regionId === userInfo.manageAreaId) {
      return [area];
    }
    if (area.children) {
      arr.push(...area.children);
    }
  }
  return [];
});

const updateRegion = (val, option, pathValues) => {
  manageAreaOpt.value = [pathValues[0]];
  formValue.manageAreaId = null;
  const [
    { regionId: provinceId, regionName: province },
    { regionId: cityId, regionName: city },
    { regionId: regionId, regionName: region }
  ] = pathValues;
  const areaName = province + '-' + city + '-' + region;
  Object.assign(formValue, { provinceId, cityId, regionId, areaName });
};
const updateManageArea = async option => {
  Object.assign(formValue, { manageAreaId: option.regionId, regionType: option.regionType });
  if (option.regionType == 3) {
    //  获取学区
    await nextTick();
    xuequ.value.getOptions();
  }
};
const updateSelect = async option => {
  Object.assign(formValue, option);
};

/* *
 * 设置不允许选中的应用组
 * */
const setDisabledAppGroup = () => {
  const selectIdArr = formValue.appList.map(item => item.appGroupId);
  appGroupOptions.value.forEach(item => {
    item.disabled = selectIdArr.includes(item.id);
  });
};

const addApp = () => {
  formRef.value.validate(
    _errors => {
      if (!_errors) {
        formValue.appList.push({ appGroupId: '' });
      }
    },
    rule => {
      return rule?.key === 'app';
    }
  );
};
const deleteApp = index => {
  let [opt] = formValue.appList.splice(index, 1);
  let selectOpt = appGroupOptions.value.find(item => item.id === opt.appGroupId);
  selectOpt && (selectOpt.disabled = false);
};
function submit() {
  validateItems().then(res => {
    if (res) {
      formValue.startDate = formValue.dateRange[0];
      formValue.endDate = formValue.dateRange[1];
      toAddEdit();
    }
  });
}
/**
 * 编辑, 编辑
 */
async function toAddEdit() {
  const {
    name,
    provinceId,
    cityId,
    regionId,
    areaName,
    address,
    orgAttribute,
    isDataMasking,
    startDate,
    endDate,
    accountNumber,
    lng,
    lat,
    socialCreditCode,
    dataMaskingType,
    manageEduDistrictId,
    manageAreaId,
    roleId,
    appList
  } = formValue;

  startLoading();

  try {
    let params = {
      roleId,
      dataMaskingType,
      orgGovernmentVO: {
        name,
        provinceId,
        cityId,
        regionId,
        areaName,
        address,
        orgAttribute,
        isDataMasking,
        startDate,
        endDate,
        accountNumber,
        lng,
        lat,
        socialCreditCode,
        manageEduDistrictId: manageEduDistrictId?.join(','),
        manageAreaId
      },
      appGroupIds: appList.map(d => d.appGroupId)
    };
    let api = addGovernment;
    if (query.id) {
      params.orgGovernmentVO.id = query.id;
      api = editGovernment;
    }
    const data = await api(params);
    endLoading();
    data &&
      go({
        name: 'GovDetail',
        query: {
          id: data.id,
          orgProperty: 8
          // orgType: 12
        }
      });
  } finally {
    endLoading();
  }
}
/**
 * 校验
 */
function validateItems() {
  return new Promise(resolve => {
    formRef.value.validate(errors => {
      if (!errors) {
        resolve(true);
      } else {
        throw new Error('表单验证错误');
      }
    });
  });
}
/**
 * 选完坐标后
 * */
function handleLngLatChange({ lng, lat } = {}) {
  lng && lat && (formValue.lnglat = `${lng},${lat}`);
  formValue.lng = lng;
  formValue.lat = lat;
  formRef.value.validate(
    _errors => {},
    rule => {
      return rule?.key === 'lnglat';
    }
  );
}

function setPageTitle() {
  if (!query.id) {
    setTitle('新建政府');
  }
}
function isDisabledApp(id) {
  return formValue.usedApp?.includes(id) ?? false;
}
onBeforeMount(async () => {
  if (query.id) {
    const data = await editShowVO({ id: query.id });
    data &&
      Object.assign(formValue, data, {
        switch: !!data.isDataMasking,
        lnglat: data.lng + ',' + data.lat,
        socialCreditCodeInit: data.socialCreditCode,
        dateRange: [data.startDate, data.endDate],
        manageEduDistrictId: data.manageEduDistrictId?.split(',') ?? null,
        copyname: data.name
      });
    manageAreaOpt.value = getAreaTree.filter(item => item.regionId == data.provinceId);
  }
  await nextTick();
  const appgroups = await getAppGroups();
  appGroupOptions.value = appgroups || [];
  setDisabledAppGroup();
  formValue.manageEduDistrictId && xuequ.value.getOptions();
});

setPageTitle();

defineOptions({ name: 'GovernmentModify' });
</script>

<style scoped></style>
