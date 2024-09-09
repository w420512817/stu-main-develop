<template>
  <n-space vertical class="w-full">
    <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="top" require-mark-placement="left">
      <n-card v-if="query.id" class="mb-3">
        <h2 class="font-bold">{{ formValue.copyname }}</h2>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">账户信息</p>
        </template>

        <n-grid cols="3" x-gap="60">
          <n-form-item-gi label="学校名称:" path="name">
            <n-input
              v-model:value="formValue.name"
              :allow-input="illegalCharacter"
              type="text"
              placeholder="请输入学校名称"
            />
          </n-form-item-gi>

          <n-form-item-gi label="学校属性:" path="orgProperty">
            <n-radio-group
              v-model:value="formValue.orgProperty"
              name="radiogroup-school"
              @update:value="updateOrgProperty"
            >
              <n-space>
                <n-radio v-for="option in schoolAttrOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-gi>

          <n-form-item-gi
            v-if="formValue.orgProperty == 2"
            label="所属上级学校:"
            path="higherOrgId"
            :show-require-mark="formValue.orgProperty == 2"
          >
            <dropdown-select
              ref="higherOrgan"
              v-model:value="formValue.higherOrgId"
              placeholder="请选择上级学校"
              filterable
              keyword="name"
              :list-api="selectHigherSchool"
              label-field="name"
              value-field="id"
              @update:value="updateHigherOrgan"
            />
          </n-form-item-gi>
          <n-form-item-gi label="统一社会信用代码:" path="socialCreditCode" class="releative">
            <n-input
              v-model:value="formValue.socialCreditCode"
              :disabled="formValue.socialCreditCodeDisabled"
              placeholder="请输入统一社会信用代码"
            />
            <a href="https://www.tianyancha.com/" target="_blank" class="text-primary absolute right-0 -top-24px">
              立即查询
            </a>
          </n-form-item-gi>
          <n-form-item-gi label="所属地区:" path="regionId">
            <region-cascader
              v-model:value="formValue.regionId"
              check-strategy="child"
              placeholder="请选择所属地区"
              @update:value="updateRegion"
            />
          </n-form-item-gi>
          <n-form-item-gi label="详细地址:" path="address">
            <n-input v-model:value="formValue.address" type="text" placeholder="请输入详细地址" maxlength="100" />
          </n-form-item-gi>
          <n-form-item-gi label="机构坐标:" path="lnglat">
            <n-input v-model:value="formValue.lnglat" placeholder="请选择机构坐标" disabled />
            <icon-bxs:map class="ml-10px text-primary text-40px" @click="openMapModal(true, {})" />
          </n-form-item-gi>
          <n-form-item-gi label="学校类型:" path="schoolType">
            <n-select v-model:value="formValue.schoolType" :options="schoolTypeOptions" placeholder="请选择学校类型" />
          </n-form-item-gi>
          <n-form-item-gi label="学段:" path="schoolTypes">
            <n-select
              v-model:value="formValue.schoolTypes"
              :options="schoolLearnPeriod"
              multiple
              max-tag-count="responsive"
              placeholder="请选择学段"
              @update:value="updateSchoolTypes"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学制:" path="schoolSystemId">
            <dropdown-select
              ref="xuezhi"
              v-model:value="formValue.schoolSystemId"
              placeholder="请选择学制"
              :params="{
                schoolType: formValue.schoolTypes,
                hybridSystem: formValue.schoolTypes?.length == 1 ? 0 : 1
              }"
              :list-api="eduSystemInfoBySchoolType"
              label-field="educationalSystem"
              value-field="id"
            />
          </n-form-item-gi>
          <n-form-item-gi label="城乡属性:" path="schoolUrbanRuralAttribute">
            <n-select
              v-model:value="formValue.schoolUrbanRuralAttribute"
              :options="UrbanRuralAttributeOptions"
              placeholder="请选择城乡属性"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学校级别:" path="schoolLevel">
            <n-select
              v-model:value="formValue.schoolLevel"
              :options="schoolLevelOptions"
              placeholder="请选择学校级别"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学区:" path="">
            <dropdown-select
              ref="xuequ"
              v-model:value="formValue.schoolRegionId"
              placeholder="请选择学区"
              :params="{ regionId: formValue.regionId }"
              :list-api="schoolDistrictSelectBox"
              label-field="schoolDistrict"
              value-field="id"
            />
          </n-form-item-gi>
          <n-form-item-gi label="举办者类型:" path="officeCategory">
            <n-select
              v-model:value="formValue.officeCategory"
              :options="officeCategoryOptions"
              type="text"
              placeholder="请选择举办者类型"
            />
          </n-form-item-gi>
          <n-form-item-gi label="联系人:" path="organizer">
            <n-input v-model:value="formValue.organizer" maxlength="20" type="text" placeholder="请输入联系人" />
          </n-form-item-gi>
          <n-form-item-gi label="联系方式:" path="tel">
            <n-input v-model:value="formValue.tel" type="text" placeholder="请输入联系方式" />
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">卫健委信息</p>
        </template>
        <n-grid cols="3" x-gap="60">
          <n-form-item-gi label="省编号:" path="">
            <n-input v-model:value="formValue.provinceCode" type="text" placeholder="请输入省编号" />
          </n-form-item-gi>
          <n-form-item-gi label="地市编号:" path="">
            <n-input v-model:value="formValue.cityCode" type="text" placeholder="请输入地市编号" />
          </n-form-item-gi>
          <n-form-item-gi label="区县编号:" path="">
            <n-input v-model:value="formValue.regionCode" type="text" placeholder="请输入区县编号" />
          </n-form-item-gi>
          <n-form-item-gi label="片区编号:" path="">
            <n-radio-group v-model:value="formValue.areaCode" name="radiogroup-area">
              <n-space>
                <n-radio v-for="option in areaNumOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-gi>
          <n-form-item-gi label="街道名称:" path="">
            <n-input v-model:value="formValue.streetName" type="text" placeholder="请输入街道名称" />
          </n-form-item-gi>
          <n-form-item-gi label="街道编号:" path="">
            <n-input v-model:value="formValue.streetCode" placeholder="请输入街道编号" />
          </n-form-item-gi>
          <n-form-item-gi label="监测点编号:" path="">
            <n-radio-group v-model:value="formValue.monitorCode" name="radiogroup-monitor">
              <n-space>
                <n-radio v-for="option in monitotNumOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-gi>
          <n-form-item-gi label="学校编号:" path="">
            <n-input v-model:value="formValue.orgCode" placeholder="请输入学校编号" />
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
        <template #header>
          <p class="font-bold">账户信息</p>
        </template>
        <n-grid cols="3" x-gap="60">
          <!-- <n-form-item-gi label="机构权限组:" path="roleId">
            <dropdown-select
              ref="roleIdRef"
              v-model:value="formValue.roleId"
              :list-api="roleSelectBox"
              :params="{ departmentId: formValue.orgProperty }"
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
              able
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
            :rule="{ required: true, trigger: ['blur', 'change'], message: '请选择应用名称', key: 'app' }"
          >
            <n-select
              v-model:value="item.appGroupId"
              :options="appGroupOptions"
              label-field="appGroupName"
              value-field="id"
              :disabled="isDisabledApp(item.appGroupId)"
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
        <n-button class="mr-3" @click="go('/institution/school/school-list')">取消</n-button>
        <n-button type="primary" :disabled="loading" @click="submit">提交</n-button>
      </n-card>
    </n-form>
    <MapLngLat title="查找机构坐标" :name="formValue.name" @register="register" @on-success="handleLngLatChange" />
    <Desensitization @register="registerDes" @on-success="updateDesensitization" />
  </n-space>
</template>

<script setup>
import { reactive, onBeforeMount, ref, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useRoute } from 'vue-router';
// api
import {
  getSchoolDetailModify,
  editSchool,
  addSchool,
  eduSystemInfoBySchoolType,
  selectHigherSchool,
  childSchoolCreditCode,
  bindPlanOrg
} from '@/api/institution2/school';
import { schoolDistrictSelectBox, getAppGroupSelectBox } from '@/api/institution2';

// static data, utils
import { disabledYesterday } from '@common/utils/common/date';
import { illegalCharacter } from '@common/utils/common';
import {
  schoolAttrOptions,
  schoolTypeOptions,
  schoolLevelOptions,
  monitotNumOptions,
  areaNumOptions,
  officeCategoryOptions,
  UrbanRuralAttributeOptions,
  schoolLearnPeriod,
  accountNumberOptions
} from './common.data';
import { schoolRules } from './school.data';
// modal
import MapLngLat from './components/MapLngLat.vue';
import Desensitization from './components/Tuomin.vue';
// hooks
import { useModal } from '@common/components/custom/Modal';
import { useGo } from '@common/hooks/usePage';
import useLoading from '@common/hooks/useLoading';
import { useTabs } from '@common/hooks/useTabs';
import useApi from '@common/hooks/business/useApi';

import dayjs from 'dayjs';

const { fetch: getAppGroups } = useApi(getAppGroupSelectBox);
const [register, { openModal: openMapModal }] = useModal();
const [registerDes, { openModal: openDesModal }] = useModal();
const { loading, startLoading, endLoading } = useLoading();
const { setTitle } = useTabs();

const { go } = useGo();
const { query } = useRoute();

const origin = {
  switch: true,
  name: '',
  dateRange: [dayjs().format('YYYY-MM-DD'), dayjs().add(5, 'year').format('YYYY-MM-DD')],
  startDate: null,
  endDate: null,
  provinceId: null,
  cityId: null,
  regionId: null,
  areaName: '',
  address: '',
  lng: null,
  lat: null,
  lnglat: '',
  officeCategory: null,
  orgProperty: null,
  organizer: '',
  schoolLevel: null,
  schoolType: null,
  schoolTypes: null,
  schoolUrbanRuralAttribute: null,
  tel: '',
  schoolSystemId: null,
  socialCreditCode: '',
  socialCreditCodeDisabled: false,
  provinceCode: null,
  cityCode: null,
  regionCode: null,
  orgCode: null,
  areaCode: null,
  roleId: null,
  dataMaskingType: [1, 2, 3, 4, 5, 6, 7, 8],
  isDataMasking: 1,
  schoolTypesStr: '',
  streetName: '',
  streetCode: null,
  monitorCode: null,
  schoolRegionId: null,
  higherOrgId: null,
  copyname: '',
  region: [110000, 110100, 110101],
  appList: [{ appGroupId: '' }],
  accountNumber: 10
};

const formRef = ref();
const formValue = reactive(cloneDeep(origin));
const appGroupOptions = ref([]);
const xuequ = ref();
const xuezhi = ref();
const higherOrgan = ref();
const rules = schoolRules(formValue);
// const roleIdRef = ref();

const updateOrgProperty = async val => {
  await nextTick();
  formValue.higherOrgId = null;
  formValue.roleId = null;
  formValue.socialCreditCodeDisabled = false;
  if (val == 2) {
    higherOrgan.value.getOptions(formValue.name);
    formValue.socialCreditCodeDisabled = true;
  } else {
    formValue.socialCreditCode = '';
  }

  // roleIdRef.value.getOptions();
};
const updateSchoolTypes = async () => {
  await nextTick();
  formValue.schoolSystemId = null;
  xuezhi.value.getOptions();
};
const updateHigherOrgan = async () => {
  const data = await childSchoolCreditCode({ id: formValue.higherOrgId });
  if (data) {
    // 选择上级机构，js直接通过校验
    formValue.socialCreditCode = data;
    formValue.socialCreditCodeDisabled = true;
    formRef.value.validate(
      _errors => {},
      rule => rule?.key === 'socialCreditCode'
    );
  }
};
const updateRegion = async (val, option, pathValues) => {
  const [
    { regionId: provinceId, regionName: province },
    { regionId: cityId, regionName: city },
    { regionId: regionId, regionName: region }
  ] = pathValues;
  const areaName = province + '-' + city + '-' + region;
  Object.assign(formValue, { provinceId, cityId, regionId, areaName });
  await nextTick();
  xuequ.value.getOptions();
  formValue.schoolRegionId = null;
  formValue.schoolRegion = '';
};
const updateDesensitization = async option => {
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
/**
 * 新建学校默认选中视力  => 特殊要求
 */

const setSystemDefaultApp = () => {
  if (formValue.id) return;
  if (!appGroupOptions.value?.length) return;
  const { id: appGroupId } = appGroupOptions.value.find(item => item.appGroupName == '视力筛查应用组');
  formValue.appList[0] = { appGroupId };
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
    orgProperty,
    isDataMasking,
    schoolType,
    schoolLevel,
    schoolTypes,
    schoolSystemId,
    schoolUrbanRuralAttribute,
    startDate,
    endDate,
    accountNumber,
    lng,
    lat,
    socialCreditCode,
    dataMaskingType,
    roleId,
    provinceCode,
    cityCode,
    regionCode,
    orgCode,
    areaCode,
    organizer,
    tel,
    streetName,
    streetCode,
    monitorCode,
    schoolRegionId,
    officeCategory,
    higherOrgId,
    appList
  } = formValue;

  startLoading();
  console.log(formValue, 'formValue888');
  try {
    let params = {
      higherOrgId,
      roleId,
      dataMaskingType,
      appGroupIds: appList.map(d => d.appGroupId),
      orgSchoolVO: {
        name,
        provinceId,
        cityId,
        regionId,
        areaName,
        address,
        orgProperty,
        isDataMasking,
        schoolType,
        schoolLevel,
        schoolTypes: schoolTypes?.join(','),
        schoolSystemId,
        schoolUrbanRuralAttribute,
        startDate,
        endDate,
        accountNumber,
        lng,
        lat,
        socialCreditCode,
        provinceCode,
        cityCode,
        regionCode,
        orgCode,
        areaCode,
        tel,
        organizer,
        streetName,
        streetCode,
        monitorCode,
        schoolRegionId,
        officeCategory
      }
    };
    let api = addSchool;
    if (query.id) {
      params.orgSchoolVO.id = query.id;
      api = editSchool;
    }
    const data = await api(params);
    // 如果是新增的话需要绑定学校
    if (!query.id) {
      const { id } = data ?? {};
      bindPlanOrg({ orgId: id });
    }

    data &&
      go({
        path: '/information/school'
      });
  } finally {
    endLoading();
  }
}

/**
 * 选完坐标后
 * */
function handleLngLatChange({ lng, lat } = {}) {
  formValue.lng = lng;
  formValue.lat = lat;
  lng && lat && (formValue.lnglat = `${lng},${lat}`);
  formRef.value.validate(
    _errors => {},
    rule => {
      return rule?.key === 'lnglat';
    }
  );
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

function setPageTitle() {
  if (!query.id) {
    setTitle('新建学校');
  }
}
function isDisabledApp(id) {
  return formValue.usedApp?.includes(id) ?? false;
}
onBeforeMount(async () => {
  if (query.id) {
    const { id, orgProperty } = query;
    const params = { id, orgProperty };
    const data = await getSchoolDetailModify(params);

    if (data) {
      const schoolTypes = data?.schoolTypes.split(',').map(d => Number(d)) ?? null;
      Object.assign(formValue, data, {
        switch: !!data.isDataMasking,
        schoolTypes: schoolTypes,
        lnglat: data.lng + ',' + data.lat,
        socialCreditCodeInit: data.socialCreditCode,
        dateRange: [data.startDate, data.endDate],
        copyname: data.name
      });
      // 获取学区, 学制，权限组，上级机构.
      await nextTick();
      xuequ.value.getOptions();
      xuezhi.value.getOptions();
      // roleIdRef.value.getOptions();
      if (data.orgProperty == 2) {
        higherOrgan.value.getOptions(data.higherOrgName);
        formValue.socialCreditCodeDisabled = true;
      }
    }
  }

  const appgroups = await getAppGroups();
  appGroupOptions.value = appgroups || [];
  setSystemDefaultApp();
  setDisabledAppGroup();
});

setPageTitle();
defineOptions({ name: 'SchoolModify' });
</script>

<style lang="less"></style>
