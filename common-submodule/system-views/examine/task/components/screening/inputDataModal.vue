<template>
  <basic-modal v-bind="$attrs" class="w-260 relative" @register="register" @after-leave="visibleChange">
    <n-layout class="h-130">
      <n-layout has-sider class="h-100%" position="absolute">
        <n-layout-sider width="150">
          <n-menu
            v-model:value="activeKey"
            :options="formValue.screenOptions"
            key-field="screeningTypeId"
            label-field="screeningTypeName"
            @update:value="handleUpdateValue"
          />
        </n-layout-sider>
        <n-layout :native-scrollbar="false">
          <n-form
            ref="inputRef"
            :model="formValue"
            :disabled="stuInfo.isView"
            require-mark-placement="left"
            label-placement="left"
            label-width="95"
          >
            <template v-for="(ele, j) in formValue.screenOptions" :key="ele.screeningTypeId">
              <div v-show="activeKey === ele.screeningTypeId">
                <n-space vertical>
                  <template v-for="(item, i) in ele.itemList" :key="item.screeningItemId">
                    <Periodontal
                      v-if="item.screeningItemCode === 'yazhou'"
                      :ref="el => setCompRef(el, 'yazhou')"
                      :disabled="stuInfo.isView"
                      :data="formValue"
                      :required="item.selection"
                    />
                    <Permanent
                      v-else-if="item.screeningItemCode === 'hengya'"
                      :ref="el => setCompRef(el, 'hengya')"
                      :disabled="stuInfo.isView"
                      :data="formValue"
                      :required="item.selection"
                      :max="Number(item.itemMax)"
                    />
                    <Saprodontia
                      v-else-if="item.screeningItemCode === 'quchi'"
                      :ref="el => setCompRef(el, 'quchi')"
                      :disabled="stuInfo.isView"
                      :data="formValue.inputCariesScreeningQuery"
                      :age="stuInfo.studentAge || stuInfo.age"
                      :required="item.selection"
                    />
                    <!--视力-->
                    <component
                      :is="visionItem(item.screeningItemCode).component"
                      v-else-if="visionItem(item.screeningItemCode)"
                      :ref="el => setCompRef(el, item.screeningItemCode)"
                      :code="visionItem(item.screeningItemCode).code"
                      :data="formValue"
                      :required="item.selection"
                    />
                    <!--体检-->
                    <component
                      :is="checkupItem(item.screeningItemCode).component"
                      v-else-if="checkupItem(item.screeningItemCode)"
                      :ref="el => setCompRef(el, item.screeningItemCode)"
                      :code="checkupItem(item.screeningItemCode).code"
                      :sex="stuInfo.sex"
                      :age="stuInfo.studentAge || stuInfo.age"
                      :data="formValue"
                      :required="item.selection"
                    />
                    <!--体测-->
                    <component
                      :is="physicalItem(item.screeningItemCode).component"
                      v-else-if="physicalItem(item.screeningItemCode)"
                      :ref="el => setCompRef(el, item.screeningItemCode)"
                      :code="physicalItem(item.screeningItemCode).code"
                      :data="formValue"
                      :required="item.selection"
                      :stu-info="stuInfo"
                    />
                    <!-- 脊柱 -->
                    <component
                      :is="spineItem(item.screeningItemCode).component"
                      v-else-if="spineItem(item.screeningItemCode)"
                      :ref="el => setCompRef(el, item.screeningItemCode)"
                      v-model:data="formValue"
                      :code="spineItem(item.screeningItemCode).code"
                      :disabled="stuInfo.isView"
                    />
                    <!--自定义筛查项-->
                    <InputEle
                      v-else
                      :ref="el => setItemRefs(el, `${j}-${i}`)"
                      :data="item"
                      :idx="[j, i]"
                      :is-set-default="isSetDefault"
                    />
                  </template>
                </n-space>
              </div>
            </template>
          </n-form>
        </n-layout>
      </n-layout>
    </n-layout>
    <n-space v-if="createUser && createUser.creatorName" class="left-35%" justify="center">
      <span>筛查人: {{ createUser.creatorName }}</span>
      <span>筛查时间: {{ createUser.updateTime }}</span>
    </n-space>
    <template #action>
      <n-space justify="end">
        <n-button @click="closeModal()">取消</n-button>
        <n-button v-if="isNext" @click="nextStep">下一项</n-button>
        <n-button v-if="!stuInfo.isView" type="primary" :loading="btnLoading.loading.value" @click="validateAll">
          提交
        </n-button>
      </n-space>
    </template>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed, nextTick, provide } from 'vue';
import { object } from 'vue-types';

import { useModalInner } from '@common/components/custom/Modal';
import useLoading from '@common/hooks/useLoading';
import { useApplicationStore } from '@common/store/application';

import InputEle from './custom/input.vue';
import { cariesItems, refOpt } from './mouth/index.data';
import { Saprodontia, Periodontal, Permanent } from './mouth';
import { getInputScreeningList, inputAppScreening, getExam, getUnChangeScreenFields } from '@common/api/examine/task';

import {
  visionData,
  diopterData,
  periodontalData,
  permanentData,
  saprodontiaData,
  spineData,
  examCheckupItems,
  examPhysicalItems,
  eyeScreenItems,
  examSpineItems,
  checkupData,
  physicalData,
  yazhouOptions,
  numAndStringCheckupKeys,
  numAndStringPhysicalKeys,
  multiCheckupKeys,
  multiCheckupStringKeys,
  sectionAndMinte
} from './input.data';
import { cloneDeep } from 'lodash-es';
import { removeNullProperties, convertEmptyStringToNull } from '@common/utils/index';
import { spineRelField } from './input.data';

defineProps({
  userData: object().def({})
});
// emit
const emit = defineEmits(['onSuccess', 'register']);
// / setProps, closeModal,
const [register, { changeLoading, closeModal }] = useModalInner(data => {
  if (data) {
    Object.assign(stuInfo, data);
    onDataReceive();
  }
});
const btnLoading = useLoading();
const { appType } = useApplicationStore();

const stuInfo = reactive({});
const activeKey = ref(); // 左侧【类目】激活状态
const activeIdx = ref(0);
const inputRef = ref(null);
const resultRef = ref(null);
let createUser = reactive({ creatorName: '', updateTime: '' });
// const formValue = reactive(Object.assign({ screenOptions: [] }, visionData, diopterData));
const originData = {
  isVision: false,
  isCaries: false,
  isCheckup: false,
  isPhysical: false,
  screenOptions: [],
  inputEyesScreeningQuery: {
    examEyesightId: null,
    inputSource: 2,
    ...visionData,
    ...diopterData
  },
  inputCariesScreeningQuery: {
    examCariesId: null,
    inputSource: 2,
    photoUrl: [],
    ...periodontalData,
    ...permanentData,
    ...saprodontiaData
  },
  inputCheckUpScreeningQuery: {
    examCheckupId: null,
    inputSource: 2,
    photoUrl: [],
    yazhou: [],
    ...visionData,
    ...diopterData,
    ...periodontalData,
    ...permanentData,
    ...saprodontiaData,
    ...checkupData
  },
  inputPhysicalScreeningQuery: {
    examPhysicalId: null,
    inputSource: 2,
    ...physicalData
  },
  inputSpineScreeningQuery: {
    examSpineId: null,
    inputSource: 2,
    ...spineData
  }
};

const formValue = reactive(cloneDeep(originData));
const screenItems = ref([]);
const itemRefs = {};
const CompRefs = {};
let formData = {};

// const screenTime = ref(formatToDateTime());

const isSetDefault = computed(() => {
  return (
    !stuInfo.examEyesightId &&
    !stuInfo.examCariesId &&
    !stuInfo.examCheckupId &&
    !stuInfo.examPhysicalId &&
    !stuInfo.examSpineId
  );
});
const isNext = computed(() => {
  console.log(activeIdx.value);
  return formValue.screenOptions && formValue.screenOptions?.length > activeIdx.value + 1;
});

// 已经录入过的字段 不可再次录入 需审核
const unScreenFields = reactive({});
provide('unScreenFields', unScreenFields);

const setItemRefs = (el, key) => {
  el && (itemRefs[key] = el);
};
const setCompRef = (el, code) => {
  el && (CompRefs[code] = el);
};

function visibleChange() {
  resetForm();
  activeKey.value = null;
  activeIdx.value = 0;
  for (const key in unScreenFields) {
    unScreenFields[key] = undefined;
  }
}
const resetForm = () => {
  // Object.assign(formValue, visionData, diopterData);
  Object.assign(formValue, cloneDeep(originData));
};
const onDataReceive = async () => {
  changeLoading();
  btnLoading.startLoading();
  try {
    const { taskId, studentId } = stuInfo;

    const res = await getInputScreeningList({ taskId, studentId });
    formValue.screenOptions = res || [];

    console.log(formValue.screenOptions, 'formValue.screenOptions');

    activeKey.value = formValue.screenOptions[0]?.screeningTypeId ?? null;
    screenItems.value = formValue.screenOptions[0]?.itemList ?? [];

    checkScreenType();
    await getScreenData(taskId, studentId);
  } finally {
    changeLoading(false);
    btnLoading.endLoading();
  }
};

const handleGetCreateUser = () => {
  console.log(screenItems.value, 'screenItems.value');
  const creatorName = screenItems.value?.[0]?.screeningItemCode + 'CreatorName';
  const updateTime = screenItems.value?.[0]?.screeningItemCode + 'UpdateTime';
  createUser.creatorName = resultRef.value?.[creatorName];
  createUser.updateTime = resultRef.value?.[updateTime];
  console.log(createUser.creatorName, createUser.updateTime);
};

const getScreenData = async (taskId, studentId) => {
  const data = await getExam({ taskId, studentId });

  resultRef.value = data;
  handleGetCreateUser();

  const newData = removeNullProperties(data);
  Object.assign(formValue.inputEyesScreeningQuery, newData);
  Object.assign(formValue.inputCariesScreeningQuery, newData);
  Object.assign(formValue.inputCheckUpScreeningQuery, newData);
  Object.assign(formValue.inputPhysicalScreeningQuery, newData);
  Object.assign(formValue.inputSpineScreeningQuery, newData);
  formValue.screenOptions.map(item => {
    item.itemList.map(opt => {
      const { screeningItemCode, screeningItemType } = opt;
      if (screeningItemType == 1 && !['sl', 'qg'].includes(screeningItemCode)) {
        const res = formValue.inputEyesScreeningQuery?.otherList?.find(
          ele => ele.screeningItemCode === screeningItemCode
        );
        res?.number && (opt.number = res.number);
      } else if (screeningItemType == 2 && !['quchi', 'yazhou', 'hengya'].includes(screeningItemCode)) {
        const res = formValue.inputCariesScreeningQuery?.otherList?.find(
          ele => ele.screeningItemCode === screeningItemCode
        );
        res?.number && (opt.number = res.number);
      } else if (screeningItemType == 3 && !examCheckupItems.find(d => d.code == screeningItemCode)) {
        const res = formValue.inputCheckUpScreeningQuery?.otherList?.find(
          ele => ele.screeningItemCode === screeningItemCode
        );
        res?.number && (opt.number = res.number);
      } else if (screeningItemType == 4 && !examPhysicalItems.find(d => d.code == screeningItemCode)) {
        const res = formValue.inputPhysicalScreeningQuery?.otherList?.find(
          ele => ele.screeningItemCode === screeningItemCode
        );
        res?.number && (opt.number = res.number);
      }
    });
  });
  if (formValue.isCaries) {
    const hasPhotoUrl = Object.keys(formValue.inputCariesScreeningQuery?.photoUrl).length;
    formValue.inputCariesScreeningQuery.photoUrl = hasPhotoUrl
      ? formValue?.inputCariesScreeningQuery?.photoUrl
          ?.split(',')
          ?.map(d => ({ url: d, status: 'finished', name: d, id: d }))
      : [];
  }
  if (formValue.isCheckup) {
    transferCheckupToShow();
  }
  if (formValue.isPhysical) {
    transferPhysicalToShow();
  }
  if (formValue.isSpine) {
    transferSpineToShow();
  }
  // }
  setDefaultVal();
  await getUnScreenFields(newData);
};

const getUnScreenFields = async res => {
  let idEnum = {
    1: 'examEyesightId',
    2: 'examCariesId',
    3: 'examCheckupId',
    4: 'physicalId',
    5: 'spineId'
  };
  let screenIdField = idEnum[appType];
  let id = res[screenIdField];
  if (id) {
    let res = await getUnChangeScreenFields({ id });
    res.forEach(field => {
      unScreenFields[field] = true;
    });
  }
};

const checkScreenType = () => {
  formValue.screenOptions.forEach(item => {
    item.itemList.forEach(opt => {
      const { screeningItemType } = opt;
      if (screeningItemType == 1) {
        formValue.isVision = true;
      }
      if (screeningItemType == 2) {
        formValue.isCaries = true;
      }
      if (screeningItemType == 3) {
        formValue.isCheckup = true;
      }
      if (screeningItemType == 4) {
        formValue.isPhysical = true;
      }
      if (screeningItemType == 5) {
        formValue.isSpine = true;
      }
    });
  });
};

const setDefaultVal = () => {
  formValue.screenOptions?.map(ele => {
    ele?.itemList?.map(item => {
      if (isSetDefault.value) {
        if (item.itemInput === 2) {
          item.number = item.itemStart;
        } else {
          item.number = [];
          item?.itemOptionsList?.map(({ optionsDefault, optionsId }) => {
            optionsDefault === 1 && item.number.push(optionsId);
          });
        }
      } else {
        if (item.itemInput !== 2 && item.number?.includes('[')) {
          item.number = JSON.parse(item.number);
        }
      }
    });
  });
};

const handleUpdateValue = (key, item) => {
  screenItems.value = item.itemList;
  handleGetCreateUser();

  activeIdx.value = formValue.screenOptions?.findIndex(ele => key === ele.screeningTypeId);
};

const visionItem = code => {
  const item = eyeScreenItems.find(d => d.code == code) ?? null;
  return item;
};
const checkupItem = code => {
  const item = examCheckupItems.find(d => d.code == code) ?? null;
  return item;
};
const physicalItem = code => {
  const item = examPhysicalItems.find(d => d.code == code) ?? null;
  return item;
};
const spineItem = code => {
  const item = examSpineItems.find(d => d.code == code) ?? null;
  return item;
};
const validateAll = async () => {
  try {
    await inputRef.value.validate();
    onSubmit();
  } catch (errors) {
    // 校验失败 定位到错误信息
    positionInput(errors[0]);
  }
};

const positionInput = async error => {
  const { field } = error[0];
  let j = null,
    i = null;
  if (field.includes('[')) {
    // 自定义筛查项
    let arr = field.split(']');
    j = arr[0].substring(arr[0].indexOf('[') + 1);
    i = arr[1].substring(arr[1].indexOf('[') + 1);
    activeKey.value = formValue.screenOptions[j].screeningTypeId;
    activeIdx.value = j;
    await nextTick();
    if (formValue.screenOptions[j].itemList[i].itemInput === 2) {
      itemRefs[`${j}-${i}`]?.scRef?.focus();
    } else {
      itemRefs[`${j}-${i}`]?.scItemRef?.labelElementRef?.scrollIntoView();
    }
  } else {
    //  系统默认的筛查项
    let _id = null; // 类目的id
    let _i = null; // 当前项的下标
    // 筛查项信息， 5个类型
    const objRef = [...cariesItems, ...eyeScreenItems, ...examCheckupItems, ...examPhysicalItems, ...examSpineItems];
    let screenItem = [
      'inputEyesScreeningQuery',
      'inputCariesScreeningQuery',
      'inputCheckUpScreeningQuery',
      'inputPhysicalScreeningQuery',
      'inputSpineScreeningQuery'
    ];
    let curScreenField = screenItem.find(key => !!field.includes(`${key}.`));

    const _field = field.split(`${curScreenField}.`)[1];
    const _type = curScreenField;

    const screenRef = objRef.find(d => d.type == _type && d.formItem.includes(_field));
    formValue.screenOptions.map(item => {
      item.itemList.map((opt, i) => {
        const { screeningItemCode } = opt;
        if (screeningItemCode == screenRef.code) {
          _id = item.screeningTypeId;
          _i = i;
        }
      });
    });
    // 左侧激活的类目
    activeKey.value = _id;
    activeIdx.value = _i + 1;
    await nextTick();
    // 滚动到类目对应的表单内容
    if (screenRef.code === 'quchi' || screenRef.code === 'tz_quchi') {
      CompRefs[screenRef.code]?.boxRef?.scrollIntoView();
    } else {
      // 体检 体测 视力 的筛查项
      CompRefs[screenRef.code]?.elRefs[_field]?.labelElementRef?.scrollIntoView();
    }
  }
};
// 体检筛查项保存前格式转换
const transferCheckupToSave = () => {
  yazhouOptions.forEach(d => {
    if (formData.inputCheckUpScreeningQuery.yazhou.includes(d.value)) {
      formData.inputCheckUpScreeningQuery[d.value] = 1;
    } else {
      formData.inputCheckUpScreeningQuery[d.value] = 0;
    }
  });

  multiCheckupKeys.forEach(key => {
    let val = formData.inputCheckUpScreeningQuery[key];
    formData.inputCheckUpScreeningQuery[key] = val ? val.join?.(',') : '';
  });

  multiCheckupStringKeys.forEach(key => {
    let val = formData.inputCheckUpScreeningQuery[key];
    formData.inputCheckUpScreeningQuery[key] = val ? val.join?.(',') : '';
  });

  numAndStringCheckupKeys.forEach(key => {
    formData.inputCheckUpScreeningQuery[key] = formData.inputCheckUpScreeningQuery[key]
      ? formData.inputCheckUpScreeningQuery[key].toString()
      : '';
  });
};
// 体检筛查项获取数据准换
const transferCheckupToShow = () => {
  yazhouOptions.forEach(d => {
    if (formValue.inputCheckUpScreeningQuery[d.value]) {
      formValue.inputCheckUpScreeningQuery.yazhou.push(d.value);
    }
  });

  multiCheckupKeys.forEach(key => {
    let val = formValue.inputCheckUpScreeningQuery[key];
    formValue.inputCheckUpScreeningQuery[key] = val ? val.split(',').map(d => +d) : [];
  });

  multiCheckupStringKeys.forEach(key => {
    let val = formValue.inputCheckUpScreeningQuery[key];
    formValue.inputCheckUpScreeningQuery[key] = val ? val.split(',').map(d => d) : [];
  });

  numAndStringCheckupKeys.forEach(key => {
    let val = formValue.inputCheckUpScreeningQuery[key];
    formValue.inputCheckUpScreeningQuery[key] = val ? +formValue.inputCheckUpScreeningQuery[key] : null;
  });

  formValue.inputCheckUpScreeningQuery.photoUrl =
    formValue.inputCheckUpScreeningQuery.photoUrl
      ?.split(',')
      .map(d => ({ url: d, status: 'finished', name: d, id: d })) ?? [];
};
const transferPhysicalToShow = () => {
  sectionAndMinte.forEach(key => {
    let val = formValue.inputPhysicalScreeningQuery[key];
    formValue.inputPhysicalScreeningQuery[key] = val ? Math.floor(val / 60) : null;
    formValue.inputPhysicalScreeningQuery[`${key}2`] = val ? val % 60 : null;
  });

  numAndStringPhysicalKeys.forEach(key => {
    let val = formValue.inputPhysicalScreeningQuery[key];
    formValue.inputPhysicalScreeningQuery[key] = val ? +formValue.inputPhysicalScreeningQuery[key] : null;
  });
};
// 把分秒加回来
const transferPhysicalToSave = () => {
  sectionAndMinte.forEach(key => {
    let val = formData.inputPhysicalScreeningQuery[key];
    formData.inputPhysicalScreeningQuery[key] = val
      ? formData.inputPhysicalScreeningQuery[key] * 60 + formData.inputPhysicalScreeningQuery[`${key}2`]
      : null;
  });
};

const saprodontiaEntryNotice = data => {
  const reg1 = /^[AaBbCcDdEeXxQq]$/;
  const reg2 = /^[0123459]$/;
  const pTeethArr3 = ['leftTop8', 'rightTop8', 'leftBottom8', 'rightBottom8'];
  const pTeethArr2 = ['leftTop7', 'rightTop7', 'leftBottom7', 'rightBottom7'];
  let msg = '';

  if (stuInfo.studentAge < 17) {
    for (const item of pTeethArr3) {
      if (data[item] != null && data[item] != '') {
        msg += `一般人17岁开始萌出第三恒磨牙，该学生${stuInfo.studentAge}岁却已录入`;
        break;
      }
    }
  }
  if (stuInfo.studentAge < 11) {
    for (const item of pTeethArr2) {
      if (data[item] != null && data[item] != '') {
        let tag = '';
        if (msg) tag = '；';
        msg += `${tag}一般人11岁开始萌出第二恒磨牙，该学生${stuInfo.studentAge}岁却已录入`;
        break;
      }
    }
  }
  if (stuInfo.studentAge >= 13) {
    for (const item of refOpt) {
      if (reg1.test(data[item])) {
        let tag = '';
        if (msg) tag = '；';
        msg += `${tag}一般人13岁已换完乳牙，该学生${stuInfo.studentAge}岁却录入乳牙数据`;
        break;
      }
    }
  }
  if (stuInfo.studentAge > 6) {
    let flag = false;
    for (const item of refOpt) {
      if (reg2.test(data[item])) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      let tag = '';
      if (msg) tag = '；';
      msg += `${tag}一般人6岁开始萌生出恒牙，该学生${stuInfo.studentAge}岁未录入恒牙数据`;
    }
  }
  if (msg) {
    msg += '，请确认是否继续保存？';
  }
  return msg;
};
// 脊柱筛查项数据转换
const transferSpine = () => {
  let formValue = formData.inputSpineScreeningQuery;
  let { historyDisease, bendGeneralInspection, suggestion, ...formV } = formValue;
  let params = {
    ...formV,
    historyDisease: historyDisease.join(','),
    bendGeneralInspection: bendGeneralInspection.join(','),
    suggestion: suggestion?.join(',')
  };
  let isEmp = spineRelField.every(key => formValue[key] == '1');
  params.spinalMovementTest = isEmp ? 0 : 1;
  if (isEmp) {
    Object.assign(params, {
      thoracicSegmentAtr: undefined,
      thoracolumbarSegmentAtr: undefined,
      lumbarSegmentAtr: undefined
    });
  }
  if (formV.bfBendGeneralInspection === '1') {
    params.proneTest = undefined;
  }
  return params;
};
const transferSpineToShow = () => {
  let data = formValue.inputSpineScreeningQuery;
  Object.assign(formValue.inputSpineScreeningQuery, {
    historyDisease: data.historyDisease?.split?.(',') ?? ['1'],
    bendGeneralInspection: data.bendGeneralInspection?.split?.(',') ?? ['1'],
    suggestion: data.suggestion?.split?.(',') ?? ['1']
  });
};

const nextStep = () => {
  activeIdx.value = activeIdx.value + 1;
  activeKey.value = formValue.screenOptions[activeIdx.value].screeningTypeId;
  handleGetCreateUser();
};
const onSubmit = async () => {
  changeLoading();
  try {
    const { screenOptions, isCaries, isCheckup, isPhysical, isVision, isSpine, ...form } = formValue;
    formData = cloneDeep(form);
    transferCheckupToSave();
    transferPhysicalToSave();
    const params = transferSpine();
    const { studentId, planId, taskId, examEyesightId, examCariesId, examPhysicalId, examCheckupId, examSpineId } =
      stuInfo;
    const stuData = { studentId, planId, taskId };
    screenOptions.map(item => {
      item.itemList.map(opt => {
        const { screeningItemId, screeningItemName, screeningItemCode, itemInput, screeningItemType, number } = opt;

        if (screeningItemType == 1 && !['sl', 'qg'].includes(screeningItemCode)) {
          let otherList = [];
          otherList.push({ screeningItemId, screeningItemName, screeningItemCode, itemInput, number });
          formData.inputEyesScreeningQuery.otherList = otherList;
        }
        if (screeningItemType == 2 && !['quchi', 'yazhou', 'hengya'].includes(screeningItemCode)) {
          let otherList = [];
          otherList.push({ screeningItemId, screeningItemName, screeningItemCode, itemInput, number });
          formData.inputCariesScreeningQuery.otherList = otherList;
        }
        if (screeningItemType == 3 && !examCheckupItems.find(d => d.code == screeningItemCode)) {
          let otherList = [];
          otherList.push({ screeningItemId, screeningItemName, screeningItemCode, itemInput, number });
          formData.inputCheckUpScreeningQuery.otherList = otherList;
        }
        if (screeningItemType == 4 && !examPhysicalItems.find(d => d.code == screeningItemCode)) {
          let otherList = [];
          otherList.push({ screeningItemId, screeningItemName, screeningItemCode, itemInput, number });
          formData.inputPhysicalScreeningQuery.otherList = otherList;
        }
      });
    });

    Object.assign(formData.inputEyesScreeningQuery, stuData, { examEyesightId });
    Object.assign(formData.inputCariesScreeningQuery, stuData, { examCariesId });
    Object.assign(formData.inputPhysicalScreeningQuery, stuData, { examPhysicalId });
    Object.assign(formData.inputCheckUpScreeningQuery, stuData, { examCheckupId });
    Object.assign(formData.inputSpineScreeningQuery, stuData, { examSpineId }, params);

    if (!isVision) {
      formData.inputEyesScreeningQuery = null;
    }
    if (!isCaries) {
      formData.inputCariesScreeningQuery = null;
    }
    if (!isCheckup) {
      formData.inputCheckUpScreeningQuery = null;
    }
    if (!isPhysical) {
      formData.inputPhysicalScreeningQuery = null;
    }

    if (!isSpine) {
      formData.inputSpineScreeningQuery = null;
    }

    if (isCaries) {
      const cariesPhotoUrls = formData.inputCariesScreeningQuery.photoUrl?.map(item => item.url);
      formData.inputCariesScreeningQuery.photoUrl = cariesPhotoUrls.length ? cariesPhotoUrls.join(',') : null;

      const msg = saprodontiaEntryNotice(formData.inputCariesScreeningQuery);
      if (msg) {
        return window.$dialogWarning(msg, () => {
          return inputAppScreening(formData).then(() => {
            window.$message.success('保存成功，该学生已完成筛查');
            emit('onSuccess');
            closeModal();
          });
        });
      }
    }

    if (isCheckup) {
      const checkupPhotoUrls = formData.inputCheckUpScreeningQuery.photoUrl?.map(item => item.url);
      formData.inputCheckUpScreeningQuery.photoUrl = checkupPhotoUrls.length ? checkupPhotoUrls.join(',') : null;

      const msg = saprodontiaEntryNotice(formData.inputCheckUpScreeningQuery);
      if (msg) {
        return window.$dialogWarning(msg, () => {
          return inputAppScreening(formData).then(() => {
            window.$message.success('保存成功，该学生已完成筛查');
            emit('onSuccess');
            closeModal();
          });
        });
      }
    }
    // 视力录入戴镜类型和备注互斥
    if (isVision && formData.inputEyesScreeningQuery.remarkType) {
      formData.inputEyesScreeningQuery.isGlasses = null;
    }
    convertEmptyStringToNull(formData);
    await inputAppScreening(formData);
    window.$message.success('保存成功，该学生已完成筛查');
    emit('onSuccess');
    closeModal();
  } finally {
    changeLoading(false);
  }
};
</script>
