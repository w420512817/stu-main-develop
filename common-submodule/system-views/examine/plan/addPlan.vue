<template>
  <n-space vertical>
    <n-spin :show="loading">
      <n-card
        class="shadow-sm mb-3"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <template #header>
          <p class="font-bold">{{ state.edit ? '编辑' : '新增' }}筛查{{ planName }}</p>
        </template>
        <div class="flex items-center justify-center w-full">
          <div class="w-700px">
            <n-steps :current="state.current" status="process">
              <!-- 编辑模式的情况下不显示 -->
              <n-step :title="`完善${planName}信息`" />
              <n-step title="确认筛查项目" />
              <n-step title="完成" />
            </n-steps>
          </div>
        </div>
      </n-card>
      <!-- 第1步 -->
      <n-card
        v-show="getCurrent == 1"
        class="shadow-sm mb-3"
        header-style="border-bottom: 1px solid #eee;font-size: 1rem;"
      >
        <n-form ref="formRef" :rules="rules" :model="formValue">
          <n-grid cols="3" x-gap="100">
            <n-gi span="3"><div class="text-sm font-bold m-b-5">基本信息</div></n-gi>
            <n-form-item-gi label="筛查名称" path="planName">
              <n-input
                v-model:value="formValue.planName"
                :disabled="state.custonDisable"
                :allow-input="illegalCharacter"
                placeholder="请输入计划名称"
                maxlength="50"
                show-count
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :label="`${planName}年份`" path="planYear">
              <n-select
                v-model:value="formValue.planYear"
                :disabled="state.custonDisable"
                clearable
                :placeholder="`请选择${planName}年份`"
                :options="yearList()"
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="state.planMode == 1" :label="`${planName}类型`" path="planType">
              <n-select
                v-model:value="formValue.planType"
                :disabled="state.custonDisable"
                clearable
                :placeholder="`请选择${planName}类型`"
                :options="typeList"
                @update:value="planTypeUpdate"
              />
            </n-form-item-gi>
            <n-form-item-gi label="开始日期-结束日期" path="dateValue">
              <n-date-picker
                v-model:formatted-value="formValue.dateValue"
                type="daterange"
                :disabled="state.custonDisable"
                clearable
                :is-date-disabled="disabledYesterday"
                @update:value="dataChange"
              />
            </n-form-item-gi>
            <n-form-item-gi label="应用组名称" path="appGroupId">
              <n-select
                v-model:value="formValue.appGroupId"
                :disabled="state.custonDisable"
                clearable
                :options="state.appsList"
                label-field="appGroupName"
                value-field="appGroupId"
                @update:value="appGroupNameUpdate"
              />
            </n-form-item-gi>
            <n-form-item-gi :label="`${planName}范围`" path="areaRange">
              <n-cascader
                ref="cascaderRef"
                v-model:value="formValue.areaRange"
                :disabled="state.custonDisable || userStore.userInfo.govLevel == 3"
                multiple
                clearable
                placeholder="请选择"
                max-tag-count="responsive"
                expand-trigger="click"
                value-field="regionId"
                label-field="regionName"
                :options="state.areaList"
                check-strategy="parent"
                :show-path="false"
                @update:value="areaRangeChange"
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="state.planMode == 2" label="任务年级" path="gradeId">
              <n-select
                v-model:value="formValue.gradeId"
                :loading="tableLoading"
                :node-props="
                  () => (state.custonDisable || tableLoading ? { style: 'pointer-events: none;' } : undefined)
                "
                :disabled="state.custonDisable"
                clearable
                multiple
                :max-tag-count="state.custonDisable ? undefined : 'responsive'"
                :options="state.allGradeList"
                label-field="name"
                value-field="gradeId"
                @update:value="changeGrade"
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="state.planMode == 2" label="要求说明">
              <n-input
                v-model:value="formValue.remark"
                placeholder="请输入要求说明"
                type="textarea"
                :autosize="{
                  minRows: 1,
                  maxRows: 3
                }"
                :maxlength="20"
                show-count
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="state.planMode == 1" label="合格率考核指标" path="checkIndex">
              <n-switch
                v-model:value="formValue.checkIndex"
                :disabled="state.custonDisable"
                :checked-value="1"
                :unchecked-value="0"
              />
            </n-form-item-gi>
            <n-form-item-gi v-if="state.planMode == 1" label="合格率考核指标(%)" path="checkNum">
              <n-input-number
                v-model:value="formValue.checkNum"
                :disabled="formValue.checkIndex != 1 || state.custonDisable"
                placeholder="请输入合格率考核指标"
                :min="0"
                :max="100"
                :precision="0"
              />
            </n-form-item-gi>
            <template v-if="formValue.planType == 102 && formValue.areaRange?.length">
              <n-gi span="3">
                <div class="text-sm font-bold m-b-5">筛查条件</div>
              </n-gi>
              <n-gi span="3">
                <n-gi
                  v-for="(item, index) in state.schoolChoice"
                  :key="index"
                  span="3"
                  x-gap="100"
                  class="flex justify-between"
                >
                  <n-form-item-gi label="学校" style="width: 20%">
                    <n-select
                      v-model:value="item.orgId"
                      :disabled="state.custonDisable"
                      filterable
                      :loading="state.schoolLoading"
                      :options="item.allOrg"
                      remote
                      label-field="orgName"
                      value-field="orgId"
                      @update:value="schoolUpdate($event, index)"
                      @focus="schoolSearch('', index)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi label="年级" style="width: 20%">
                    <n-select
                      v-model:value="item.gradeId"
                      :disabled="state.custonDisable"
                      :loading="state.schoolLoading2"
                      clearable
                      :options="item.allGrade"
                      label-field="gradeName"
                      value-field="id"
                      @update:value="gradeIdUpdate($event, index)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi label="班级" style="width: 30%">
                    <n-select
                      v-model:value="item.classIds"
                      :disabled="state.custonDisable"
                      :options="item.allClass"
                      multiple
                      label-field="className"
                      value-field="classId"
                      @update:value="classIdUpdate($event, index)"
                    />
                  </n-form-item-gi>
                  <n-button
                    v-if="!state.custonDisable && index != 0"
                    text
                    type="error"
                    @click="deleteScreenClass(index)"
                    >删除</n-button
                  >
                  <n-button v-if="!state.custonDisable && index == 0" text type="error"
                    ><span class="text-transparent">占位</span></n-button
                  >
                </n-gi>
              </n-gi>

              <n-gi v-if="!state.custonDisable" span="3">
                <n-button type="primary" class="m-b-10" @click="addScreenClass()">新增</n-button>
              </n-gi>
            </template>
            <!-- 任务模式筛查指标不显示 -->
            <template v-if="state.planMode == 1">
              <n-gi span="3"><div class="text-sm font-bold m-b-5">数据设置</div></n-gi>
              <n-form-item-gi label="应筛学生数" path="screenNum">
                <n-input-number
                  v-model:value="formValue.screenNum"
                  :disabled="
                    formValue.screenType == 2 || (state.custonDisable && state.planStatus != 3 && state.planStatus != 4)
                  "
                  :min="state.minScreenNum || 0"
                  :precision="0"
                  placeholder="请输入学校统计应筛数"
                />
              </n-form-item-gi>
              <n-form-item-gi label="" path="screenType">
                手动录入应筛数&nbsp;&nbsp;<n-switch
                  v-model:value="formValue.screenType"
                  :disabled="state.custonDisable && state.planStatus != 3 && state.planStatus != 4"
                  :checked-value="1"
                  :unchecked-value="2"
                  @update:value="screenTypeChange"
                />
              </n-form-item-gi>
            </template>

            <n-gi v-if="state.planMode == 1" span="3"><div class="text-sm font-bold m-b-5">数据控制</div></n-gi>
            <n-gi v-if="state.planMode == 1" span="3">
              <n-radio-group v-model:value="formValue.control" :disabled="state.custonDisable" name="radiogroup">
                <n-space>
                  <n-radio :key="0" :value="0">不开启</n-radio>
                  <n-radio :key="1" :value="1">开启</n-radio>
                </n-space>
              </n-radio-group>
              <div class="text-gray-400 text-xs">开启后，上级机构无法查看该{{ planName }}</div>
            </n-gi>
          </n-grid>
        </n-form>
        <!-- 计划模式才会展示 -->
        <n-spin :show="tableLoading">
          <screen-scope
            v-if="Object.keys(state.areaList).length && state.planMode == 2"
            ref="screenScopeRef"
            :stu-count-field="areaSelfEditTaskTree ? 'gradeNum' : undefined"
            :area-list="state.areaList"
            :area-range-checked="state.areaRangeChecked"
            :area-range="formValue.areaRange"
            :custom-disable="state.planStatus == 1"
          />
        </n-spin>
      </n-card>
      <!-- 第2步 -->
      <n-card
        v-show="getCurrent == 2"
        class="shadow-sm mb-3"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <n-grid v-for="item in state.screenItems" :key="item.screeningTypeId" cols="3" x-gap="100">
          <n-gi span="3"
            ><div class="text-sm font-bold m-b-5">{{ item.screeningTypeName }}</div></n-gi
          >
          <n-form-item-gi
            v-for="ite in item.itemList"
            :key="ite.screeningTypeId"
            :label="ite.screeningItemName"
            path="planName"
          >
            <n-select
              v-model:value="ite.selection"
              :disabled="state.custonDisable || ite.custonDisable"
              :options="screenOptions"
            />
          </n-form-item-gi>
        </n-grid>
      </n-card>
      <!-- 第3步 -->
      <n-card
        v-show="getCurrent == 3"
        class="shadow-sm"
        style="min-height: 66vh"
        header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
      >
        <div class="flex flex-col items-center w-full">
          <icon-zondicons:checkmark-outline text-15 class="text-green-500 m-t-24px m-b-24px" />
          <div class="text-xl font-bold m-b-6">{{ planName }}{{ state.edit ? '编辑' : '新增' }}成功</div>
          <n-descriptions label-placement="left" :column="1" class="w-[30%] text-center">
            <n-descriptions-item :label="`${planName}名称`">
              {{ formValue.planName || state.planeResult.planName }}
            </n-descriptions-item>
            <n-descriptions-item :label="`${planName}日期`">
              {{
                formValue?.dateValue?.length > 0
                  ? `${formValue.dateValue[0]} ~ ${formValue.dateValue[1]}`
                  : state.planeResult.startTime
              }}
            </n-descriptions-item>
            <n-descriptions-item v-if="state.planMode == 1" :label="`${planName}类型`">
              {{ state.planeResult.planTypeLaber }}
            </n-descriptions-item>
            <n-descriptions-item :label="`${planName}范围`"> {{ state.planeResult.planRange }} </n-descriptions-item>
            <n-descriptions-item v-if="state.planMode == 2" :label="`${planName}年级`">
              {{ state.planeResult.gradeName }}
            </n-descriptions-item>
            <n-descriptions-item v-if="state.planMode == 2" :label="`${planName}目标数`">
              {{ state.planeResult.screenNum }}
            </n-descriptions-item>
          </n-descriptions>
        </div>
        <div class="text-center mb-4 mt-8">
          <n-button class="mr-3" @click="goBack()">关闭</n-button>
          <n-button type="primary" @click="goDetail()">查看{{ planName }}</n-button>
        </div>
      </n-card>
      <n-card v-if="getCurrent === 1" class="text-center mb-4">
        <n-button v-if="!state.edit" class="mr-3" @click="goFirstStep()">上一步</n-button>
        <n-button type="primary" :disabled="loading" @click="submit">下一步</n-button>
      </n-card>
      <n-card v-if="getCurrent === 2" class="text-center mb-4">
        <n-button class="mr-3" @click="goUpStep()">上一步</n-button>
        <n-button type="primary" :disabled="loading" @click="submit">{{ state.edit ? '编辑' : '确认' }}</n-button>
      </n-card>
    </n-spin>
  </n-space>
</template>
<script setup lang="jsx">
import { cloneDeep, debounce } from 'lodash-es';
import { reactive, ref, nextTick, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  getAreaTreeStu,
  planArea,
  planAdd,
  schoolList,
  gradeList,
  planInfo,
  planEdit,
  screeningNumber
} from '@common/api/examine/plan';
import { getScreenOptions, getApplicationList, schoolGradeList } from '@common/api/common';
import { useGo } from '@common/hooks/usePage';
import { useUserStore, useApplicationStore } from '@/store';
import { useTabs } from '@common/hooks/useTabs';
import useLoading from '@common/hooks/useLoading';
import useApi from '@common/hooks/business/useApi';
import screenScope from './components/screenScope.vue';
import { GovLevelEnum } from '@common/enum/pageEnum';
import { showScreenNumWraning } from '../common.data';
import { typeList, yearList } from './index.data';
import { illegalCharacter } from '@common/utils/common';

const cascaderRef = ref(null);
const screenScopeRef = ref(null);

const { fetch: getAreaTreeStuFetch, loading: tableLoading } = useApi(getAreaTreeStu);
const { closeCurrent, setTitle } = useTabs();
const { query } = useRoute();
const { appType } = useApplicationStore();
const { go } = useGo();
const userStore = useUserStore();
const { loading, startLoading, endLoading } = useLoading();
const screenOptions = [
  { label: '必查', value: 1 },
  { label: '选查', value: 2 }
];
const schoolChoiceOrigin = {
  orgId: null,
  orgName: null,
  allOrg: [],
  grade: null,
  gradeId: null,
  allGrade: [],
  className: [],
  classIds: [],
  allClass: [],
  screenNum: 0
};

let state = reactive({
  detailInfo: null,
  minScreenNum: null,
  hasStarted: false,
  schoolLoading: false,
  schoolLoading2: false,
  planId: '',
  edit: false,
  planStatus: '',
  custonDisable: false,
  planeResult: {},
  current: 1,
  appsList: [],
  allGradeList: [],
  areaList: [], // 计划范围
  screenItems: [
    {
      screeningTypeId: '1',
      screeningTypeName: '视力',
      itemList: [
        {
          screeningTypeId: '11',
          screeningItemName: '裸眼视力'
        },
        {
          screeningTypeId: '12',
          screeningItemName: '矫正视力'
        }
      ]
    },
    {
      screeningTypeId: '2',
      screeningTypeName: '电脑验光',
      itemList: [
        {
          screeningTypeId: '21',
          screeningItemName: '球镜度数'
        },
        {
          screeningTypeId: '22',
          screeningItemName: '柱镜度数'
        },
        {
          screeningTypeId: '23',
          screeningItemName: '轴位'
        }
      ]
    },
    {
      screeningTypeId: '3',
      screeningTypeName: '其他',
      itemList: [
        {
          screeningTypeId: '31',
          screeningItemName: 'ok镜度数'
        }
      ]
    }
  ],
  schoolChoice: [{ ...schoolChoiceOrigin }],
  planMode: 0,
  areaRangeChecked: '', // 计划范围所有选中的值
  screeningIndex: 0
});

function addScreenClass() {
  state.schoolChoice.push({
    ...schoolChoiceOrigin
  });
  let i = state.schoolChoice.length - 1;
  schoolSearch2('', i);
}
async function deleteScreenClass(i) {
  state.schoolChoice.splice(i, 1);
  await nextTick();
  // console.log(calculateSelectSum(), 'calculateSelectSum()');
  // updateScreenNum(calculateSelectSum());
  setScreeningNumber();
}
const initFormValue = {
  planName: '',
  planYear: null,
  planType: null,
  planRange: null,
  areaRange: [],
  dateValue: null,
  copyDataValue: [],
  appGroupId: null,
  applicationId: '',
  checkIndex: 0,
  checkNum: null,
  screenNum: null,
  screenType: 2,
  control: 0,
  appVersion: '',
  screeningCondition: [],
  gradeId: []
};
let formValue = reactive(cloneDeep(initFormValue));

// 获取当前的步骤如果是编辑的话就+1，因为编辑状态不显示【选择计划】这个步骤
const getCurrent = computed(() => {
  return state.current;
});

// 根据选择的筛查模式来显示文案是 计划还是任务
const planName = computed(() => {
  return state.planMode == 2 ? '任务' : '计划';
});

// 区编辑任务模式 只有自己的任务才用gradeNum
const areaSelfEditTaskTree = computed(() => {
  let { govLevel, orgId } = userStore.userInfo;
  let isRegion = govLevel == 3;
  let regionAdd = isRegion && query.edit != 1;
  let regionEdit = isRegion && query.edit == 1 && orgId == formValue.creatorOrg;
  return regionAdd || regionEdit;
});

const formRef = ref();
const rbq = { required: true, trigger: ['input', 'blur'] };
const rules = {
  planName: { ...rbq, message: `请输入${planName.value}名称` },
  planYear: { ...rbq, message: `请选择${planName.value}年份`, type: 'number' },
  planType: { ...rbq, message: `请选择${planName.value}类型`, type: 'number' },
  dateValue: { ...rbq, message: `请选择${planName.value}时间`, type: 'array' }
  // areaRange: { ...rbq, message: `请选择${planName.value}范围`, type: 'array' },
  // appGroupId: { ...rbq, message: '请选择应用组名称' },
  // gradeId: { ...rbq, message: '请选择任务年级', type: 'array' }
};
async function dataChange() {
  await nextTick();
  if (state.hasStarted && formValue.dateValue[0] != formValue.copyDataValue[0]) {
    formValue.dateValue[0] = formValue.copyDataValue[0];
    formValue.dateValue[1] = formValue.copyDataValue[1];
    window.$message.error(`${planName.value}已经开始，不可修改开始时间，请重新选择`);
  }
}

// 设置禁用时间 只能是今天和以后的时间
const disabledYesterday = ts => {
  let day = 86400000;
  return ts < Date.now() - day;
};

onMounted(async () => {
  // 如果是编辑计划，就获取详情，根据计划范围获取地区信息
  if (query.planId) {
    setTitle(`编辑筛查`);
    state.planId = query.planId;
    state.edit = query.edit;
    // 先回显详情
    await getDetail();
    let screenNum = formValue.screenNum;
    await setScreeningNumber();
    formValue.screenNum = screenNum;
    // 再回显
  } else {
    setTitle(`新增筛查`);
  }
  state.planMode = query.planMode;
  getAppsList();
  await getAllGradeList();
  getAreaList();
});

async function getDetail() {
  startLoading();
  const d = await planInfo({
    planId: state.planId
  });
  state.detailInfo = d;
  state.planStatus = d.planStatus;
  state.custonDisable = d.planStatus != 2;
  // 设置模式
  state.planMode = d.planMode;
  console.log(d, 'ddd');
  // handleSetAreaList(d);
  await fillData(d);
  let startTime = new Date(d.startTime);
  let timeStamp = startTime.getTime();
  let nowStamp = new Date().getTime();
  if (timeStamp <= nowStamp) {
    state.hasStarted = true;
  }
  endLoading();
}
async function fillData(d) {
  formValue.planName = d.planName;
  formValue.planYear = d.planYear;
  formValue.planType = d.planType;
  formValue.startTime = d.startTime;
  formValue.endTime = d.endTime;
  formValue.appGroupId = d.appGroupId;
  formValue.planRange = d.planRange;
  formValue.checkIndex = d.checkIndex;
  formValue.checkNum = d.checkNum;
  formValue.screenNum = d.screenNum;
  formValue.screenType = d.screenType;
  formValue.control = d.control;
  formValue.screeningCondition = Array.isArray(d.screeningCondition) ? d.screeningCondition : [];
  formValue.ScreeningOpitons = d.ScreeningOpitons;
  formValue.remark = d.remark;
  formValue.creatorOrg = d.creatorOrg;
  formValue.gradeId = d.gradeId;
  formValue.dateValue = [d.startTime, d.endTime];
  formValue.copyDataValue = [d.startTime, d.endTime];
  // 设置选中状态
  formValue.areaRange = d.planRange.split(',');
  formValue.applicationId = d.applicationId;
  formValue.appVersion = d.appVersion;
  // appGroupNameUpdate('', { appId: d.applicationId, appVersion: d.appVersion });
  state.screenItems = d.screeningOptions;
  if (d.planType == 102) {
    // 抽查
    await fillSchool(d.screeningConditionList);
  }
}
async function fillSchool(d) {
  if (d && d[0]) {
    let allSettings = [];
    for await (const v of d) {
      let obj = {
        orgId: '',
        orgName: '',
        allOrg: [],
        gradeId: null,
        grade: null,
        allGrade: [],
        classIds: [],
        className: [],
        allClass: []
      };
      obj['orgId'] = v.orgId;
      obj['orgName'] = v.orgName;
      // 获取当前的
      const d = await schoolList({
        current: 1,
        size: 50,
        name: '',
        planRange: formValue.areaRange.join(',')
      });
      obj['allOrg'] = d.records;
      const gradeAll = await gradeList({
        orgId: v.orgId
      });
      obj['allGrade'] = gradeAll;
      if (v.gradeId) {
        obj['gradeId'] = v.gradeId || null;
        obj['grade'] = v.grade || null;

        obj['allClass'] = gradeAll.find(item => item.id == v.gradeId)?.classList || [];
      }
      if (v.classIds && v.classIds[0]) {
        obj['classIds'] = v.classIds.split(',');
        obj['className'] = v.className.split(',');
        let len = v.classIds.split(',');
        let len2 = v.className.split(',');
        len.forEach((v, i) => {
          let classItem = {};
          classItem['classId'] = v;
          classItem['className'] = len2[i];
        });

        let classes = [];
        obj?.allGrade?.forEach(vv => {
          if (vv.id == v.gradeId) {
            classes = vv.classList;
          }
        });

        obj['allClass'] = classes;
      }
      allSettings.push(obj);
    }
    state.schoolChoice = allSettings;
  }
}
function appGroupNameUpdate(value, option) {
  if (!value) {
    // state.screeningIndex = 0;
    return;
  }
  formValue.applicationId = option.appId;
  formValue.appVersion = option.appVersion;
  getScreenOptions({ appId: option.appId, version: option.appVersion }).then(d => {
    state.screenItems = d;
  });
  // 如果是应用组名称选择的是未开启筛目标
  if (option.screeningIndex == 0) {
    setScreeningNumber();
  }

  if (state.planMode == 2) {
    state.areaRangeChecked = getAreaRangeChecked();
  }
}

const submit = async () => {
  // console.log(formValue, 'formValue');
  // const realAreaList = screenScopeRef?.value?.getFieldValue();
  // console.log(realAreaList, 'realAreaListrealAreaListrealAreaList');
  await formRef.value.validate();
  let startTime = formValue.dateValue[0];
  let endTime = formValue.dateValue[1];
  let sy = startTime.substr(0, 4) * 1;
  let sm = startTime.substr(5, 2) * 1;
  let ey = endTime.substr(0, 4) * 1;
  let em = endTime.substr(5, 2) * 1;
  if (ey - sy >= 2) {
    window.$message.error(`${planName.value}时间不得跨新一年的9月1号`);
    return false;
  }
  if (ey - sy == 0 && sm < 9 && em >= 9) {
    window.$message.error(`${planName.value}时间不得跨同年的9月1号`);
    return false;
  }
  if (ey - sy == 1 && sm < 9) {
    window.$message.error(`${planName.value}时间不得跨今年的9月1号`);
    return false;
  }
  if (ey - sy == 1 && em >= 9) {
    window.$message.error(`${planName.value}时间不得跨次年的9月1号`);
    return false;
  }
  if (formValue.planType == 102) {
    let flag2 = false;
    let arr = [];
    state.schoolChoice.forEach(v => {
      v.classIds.forEach(vv => {
        if (arr.indexOf(vv) == -1) {
          arr.push(vv);
        } else if (vv) {
          flag2 = true;
        }
      });
    });
    if (flag2) {
      window.$message.error('抽查计划存在同学校的重复班级');
      return false;
    }
  }
  if (formValue.screenNum < state.minScreenNum) {
    window.$message.error('应筛学生数不得小于系统中存在的学生数');
    return false;
  }
  // 如果是第二步则不提交
  if (getCurrent.value == 1) {
    if (state.planMode == 2) {
      validateTableNum();
    }

    state.current++;
    return false;
  }
  onAdd();
};
const onAdd = async () => {
  startLoading();
  try {
    const realAreaList = screenScopeRef?.value?.getFieldValue();
    console.log(realAreaList, 'realAreaListrealAreaListrealAreaList');
    formValue['startTime'] = formValue.dateValue[0];
    formValue['endTime'] = formValue.dateValue[1];
    formValue['planRange'] = formValue.areaRange.join(',');
    setScreemItems();
    if (formValue.planType == 102) {
      setClasses();
    } else {
      formValue['screeningCondition'] = [];
    }
    // 如果筛查指标开启，那么同步一下region里面的screenNumber和formValue里面的值
    if (realAreaList) {
      formValue.screenNum = realAreaList?.[0]?.screeningNum ?? 0;
    }

    let result = {};
    let gradeId;
    if (state.planMode == 2) {
      formValue.gradeName = formValue.gradeId
        .map(item => {
          let opt = state.allGradeList.find(v => v.gradeId == item);
          return opt.name;
        })
        .join(',');
      gradeId = formValue.gradeId.join(',');
    }
    if (state.edit) {
      result = await planEdit({
        ...formValue,
        gradeId,
        planId: state.planId,
        appType,
        planMode: state.planMode,
        region: realAreaList?.[0]
      });
    } else {
      result = await planAdd({ ...formValue, appType, planMode: state.planMode, region: realAreaList?.[0], gradeId });
    }
    state.planeResult = result;
    state.current++;
  } finally {
    endLoading();
  }
};
function setScreemItems() {
  let arr = [];
  state.screenItems.forEach(v => {
    let screeningTypeId = v.screeningTypeId;
    v.itemList.forEach(vv => {
      let obj = {
        screeningItemId: '',
        screeningItemName: '',
        screeningItemCode: '',
        screeningItemType: '',
        selection: '',
        id: '',
        planId: '',
        taskId: ''
      };
      obj.screeningItemId = vv.screeningItemId;
      obj.screeningItemName = vv.screeningItemName;
      obj.screeningItemCode = vv.screeningItemCode;
      obj.screeningItemType = vv.screeningItemType;
      obj.selection = vv.selection;
      if (state.edit) {
        obj.id = vv.id;
        obj.planId = vv.planId;
        obj.taskId = vv.taskId;
      }
      arr.push({ ...obj, screeningTypeId });
    });
  });
  formValue['ScreeningOpitons'] = arr;
}
function setClasses() {
  let arr = [];
  if (state.schoolChoice[0] && state.schoolChoice[0].orgId) {
    state.schoolChoice.forEach(v => {
      let obj = {};
      obj['orgId'] = v.orgId;
      obj['orgName'] = v.orgName;
      obj['grade'] = v.grade;
      obj['gradeId'] = v.gradeId;
      obj['className'] = v.className.join(',');
      obj['classIds'] = v.classIds.join(',');
      arr.push(obj);
    });
  }
  formValue['screeningCondition'] = arr;
}
const getAppsList = async () => {
  state.appsList = await getApplicationList({ orgId: userStore.userInfo.orgId, appType });
};

const getAllGradeList = async () => {
  // 放开对接接口
  state.allGradeList = await schoolGradeList();
  if (query.edit != 1) {
    formValue.gradeId = state.allGradeList?.map(item => item.gradeId);
  }
};

const changeGrade = async () => {
  let res = await getAreaTreeApi();
  res = getInitData([res]);
  state.areaList = res;
};

// 初始化的时候和学生总数对齐;
const getInitData = data => {
  data.forEach(item => {
    item.children && getInitData(item.children);
    // 给默认值0 组件移除空字段 字段为undefined输入框不监听 最后一次的值不被清除
    item.screeningNum = (areaSelfEditTaskTree.value ? item.gradeNum : item.stuCount) || 0;
  });
  return data;
};

const getAreaTreeApi = async () => {
  // console.log(state.screeningIndex, 'state.screeningIndex');
  // 如果有筛查指标，就选复杂树，如果是没有就选简单树
  if (state.planMode == 2) {
    return await getAreaTreeStuFetch({ gradeIds: formValue.gradeId?.join(',') });
  } else {
    return await planArea();
  }
};

const getAreaList = async () => {
  if (!state.edit) {
    const treeStu = await getAreaTreeApi();
    let d = [treeStu];
    // 新增的情况下 筛查学生数量等于总数量
    d = getInitData(d);
    // 1 如果新增状态，那么默认全选
    state.areaList = d;
    formValue.areaRange = [state.areaList?.[0]?.regionId];
    if (state.planMode == 1) {
      // 设置应筛查人数
      setScreeningNumber();
    }
  } else {
    // 有筛查目标
    if (state.planMode == 2) {
      const treeStu = await getAreaTreeApi();
      let regionAll = [];
      // 拿到所有编辑的节点
      let editArr = [state.detailInfo?.region];
      for (let i = 0; i < editArr.length; i++) {
        const item = editArr[i];
        regionAll.push(item);
        if (item.children?.length) {
          editArr.push(...item.children);
        }
      }

      // 所有的省市区回显编辑节点
      let treeStuArr = [treeStu];
      for (let i = 0; i < treeStuArr.length; i++) {
        if (!regionAll.length) break;
        const item = treeStuArr[i];
        if (item.children?.length) {
          treeStuArr.push(...item.children);
        }
        let editVIndex = regionAll.findIndex(v => item.regionId === v.regionId);
        if (editVIndex != -1) {
          let [v] = regionAll.splice(editVIndex, 1);
          let { children: _children, ...value } = v;
          Object.assign(item, value);
        } else {
          item.screeningNum = (areaSelfEditTaskTree.value ? item.gradeNum : item.stuCount) || 0;
        }
      }
      state.areaList = [treeStu];
    } else {
      // 没有筛查目标
      const treeStu = await getAreaTreeApi();
      let d = [treeStu];
      // 没有筛查目标的情况下 筛查学生数量等于总数量
      d = getInitData(d);
      state.areaList = d;
    }
  }

  await nextTick();
  // 根据计划范围的选中状态 设置一下筛查指标下面应该选的数据
  state.areaRangeChecked = getAreaRangeChecked();
};

let schoolSearch = debounce(schoolSearch2, 500, { maxWait: 2000 });
function schoolSearch2(query, i) {
  // debugger;
  state.schoolLoading = true;
  schoolList({
    current: 1,
    size: 50,
    name: query,
    planRange: formValue.areaRange.join(',')
  })
    .then(d => {
      state.schoolChoice[i].allOrg = d.records;
    })
    .finally(() => {
      state.schoolLoading = false;
    });

  console.log(state.schoolChoice, 'state.schoolChoice');
}
function schoolUpdate(value, i) {
  state.schoolChoice[i].grade = null;
  state.schoolChoice[i].gradeId = null;
  state.schoolChoice[i].allGrade = [];
  state.schoolChoice[i].className = [];
  state.schoolChoice[i].classIds = [];
  state.schoolChoice[i].allClass = [];
  state.schoolChoice[i].allOrg.forEach(v => {
    if (v.orgId == value) {
      state.schoolChoice[i].orgName = v.orgName;
    }
  });
  state.schoolLoading2 = true;
  gradeList({
    orgId: value
  })
    .then(d => {
      state.schoolChoice[i].allGrade = d;
    })
    .finally(() => {
      state.schoolLoading2 = false;
    });
  setScreeningNumber(i);
}
function gradeIdUpdate(value, i) {
  state.schoolChoice[i].className = [];
  state.schoolChoice[i].classIds = [];
  state.schoolChoice[i].allClass = [];
  let classes = [];
  state.schoolChoice[i].allGrade.forEach(v => {
    if (v.id == value) {
      state.schoolChoice[i].grade = v.gradeName;
      classes = v.classList;
    }
  });
  state.schoolChoice[i].allClass = classes;
  setScreeningNumber(i);
}
function classIdUpdate(value, i) {
  let arr = [];
  let allClass = state.schoolChoice[i].allClass;
  let classIds = state.schoolChoice[i].classIds;
  allClass.forEach(v => {
    classIds.forEach(vv => {
      if (v.classId == vv) {
        arr.push(v.className);
      }
    });
  });
  state.schoolChoice[i].className = arr;
  setScreeningNumber(i);
}

const getAreaRangeChecked = () => {
  // console.log(cascaderRef.value.getCheckedData(), 'cascaderRef.value.getCheckedData()');
  const checked = cascaderRef.value.getCheckedData()?.keys;
  const halfChecked = cascaderRef.value.getIndeterminateData()?.keys;

  const areaRangeChecked = [...halfChecked, ...checked];
  return areaRangeChecked;
};
// 计划范围更新

async function areaRangeChange() {
  await nextTick();
  // console.log(cascaderRef.value, 'cascaderRef');
  // console.log(cascaderRef.value.getCheckedData(), 'getCheckedData');
  // console.log(cascaderRef.value.getIndeterminateData(), 'getIndeterminateData');
  // console.log(value, options, path, 'value,options,path');

  // 计划范围变化时 新增抽查类型 都需要清空原有的学校筛查条件
  if (formValue.planType === 102) {
    resetSchoolSelect();
    // 获取学校列表
    schoolSearch2('', 0);
  }

  // 计划模式
  if (state.planMode == 1) {
    // 设置应筛查人数
    setScreeningNumber();
  } else if (state.planMode == 2) {
    // 任务模式
    state.areaRangeChecked = getAreaRangeChecked();
  }
}
async function planTypeUpdate(e) {
  await nextTick();
  if (e === 102) {
    resetSchoolSelect();
    formValue.areaRange?.length && schoolSearch2('', 0);
  }
  setScreeningNumber();
}
function resetSchoolSelect() {
  state.schoolChoice = [{ ...schoolChoiceOrigin }];
}
function screenTypeChange(e) {
  if (e == 2 && formValue.screenNum != state.minScreenNum) {
    // formValue.screenNum = state.minScreenNum;
    setScreeningNumber();
    window.$message.warning('已更新应筛学生数');
  }
}

// 设置应筛人数
async function setScreeningNumber(index) {
  // 没有选择抽查类型 或者 没有选择计划范围  或者 选择了筛查指标并且是普查的情况下不用更新应筛人数
  if (!formValue.planType || !formValue.areaRange[0] || state.planMode == 2) {
    return false;
  }
  if (formValue.planType == 102) {
    setClasses();
  }

  let d = await screeningNumber({
    planRange: formValue.areaRange.join(','),
    planType: formValue.planType ? formValue.planType : null,
    screeningCondition: formValue['screeningCondition']
  });
  let num = d * 1;
  if (formValue.planType == 102 && (index || index == 0)) {
    // 抽查计划类型特殊应筛学生数是累加的
    state.schoolChoice[index].screenNum = num;
    // num = calculateSelectSum();
  }

  updateScreenNum(num);
}

// 更新应筛学生数
function updateScreenNum(num) {
  state.minScreenNum = num;
  formValue.screenNum = state.minScreenNum;
  window.$message.warning('已更新应筛学生数');
}

// 计算抽查累计应筛学生数
// function calculateSelectSum() {
//   const total = state.schoolChoice.reduce((pre, cur) => {
//     return cur.screenNum ? pre + cur.screenNum : pre;
//   }, 0);
//   return total;
// }

function goBack() {
  closeCurrent();
  go('/examine/plan-manage', 'isReplace');
}
function goDetail() {
  closeCurrent();
  go(`/examine/plan-detail?planId=${state.planeResult.planId}&planMode=${state.planMode}`, 'isReplace');
}

function goFirstStep() {
  goBack();
}
function goUpStep() {
  state.current = state.current - 1;
}
// 判断筛查指标 目标学生数量是否超过总数 弹出警告
function validateTableNum() {
  let res = screenScopeRef.value?.getFieldValue();
  let arr = [...res];
  let overstep = [];
  let stuCountField = userStore.userInfo.govLevel == 3 ? 'gradeNum' : 'stuCount';
  let school = GovLevelEnum[userStore.userInfo.govLevel] === 'REGION';
  // for (let i = 0; i < arr.length; i++) {
  //   const item = arr[i];
  //   let area = GovLevelEnum[item.level] === 'REGION';
  //   if (item.screeningNum > item[stuCountField]) {
  //     let vstrp = {
  //       regionName: item.regionName,
  //       gradeNum: item[stuCountField],
  //       screeningNum: item.screeningNum
  //     };
  //     // 账号为学校身份 并且筛查树为学校
  //     if (school && GovLevelEnum[item.level] === 'SCHOOL') {
  //       overstep.push(vstrp);
  //     } else if (area && !school) {
  //       // 账号为政府身份 并且筛查树不为为学校
  //       overstep.push(vstrp);
  //     }
  //   }
  //   if (item.children?.length) {
  //     arr.push(...item.children);
  //   }
  // }
  // if (overstep.length) {
  showScreenNumWraning(
    overstep,
    () => {
      state.current++;
    },
    { title: '是否进行下一步', positiveText: '下一步' }
  );

  throw Error('目标学生数量超过学生总数');
  // }
}
</script>
