<template>
  <div class="text-8">
    <n-spin :show="loading">
      <!--  label-placement="left" label-width="auto" -->
      <n-card class="shadow-sm mb-3">
        <template #header>
          <span class="text-6 font-bold">{{ isEdit ? '编辑' : '新增' }}{{ titleName }}</span>
        </template>
        <n-space vertical class="mb-3">
          <n-steps :current="currentRef" class="pl-30">
            <n-step title="完善任务信息" />
            <n-step title="确认筛查项目" />
            <n-step title="完成" />
          </n-steps>
        </n-space>
      </n-card>
      <template v-if="currentRef === 1">
        <n-form ref="taskRef" :model="taskForm" :rules="taskRules">
          <n-card v-if="!isSelfCheck" title="计划信息" class="shadow-sm mb-3">
            <n-grid x-gap="30" :cols="3">
              <n-gi>
                <n-form-item label="所属计划" path="planId">
                  <n-select
                    v-model:value="taskForm.planId"
                    :disabled="isEdit"
                    :options="taskPlanList"
                    placeholder="请选择所属计划"
                    label-field="planName"
                    value-field="planId"
                    @update:value="handlePlanChange"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="筛查学校">
                  <n-input v-model:value="planInfo.orgName" disabled placeholder="请选择所属计划" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="计划类型">
                  <n-input v-model:value="planInfo.planTypeLaber" disabled placeholder="请选择所属计划" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="计划年份">
                  <n-input v-model:value="planInfo.planYear" disabled placeholder="请选择所属计划" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="应用组名称">
                  <n-input v-model:value="planInfo.appGroupName" disabled placeholder="请选择所属计划" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="地区">
                  <n-input v-model:value="planInfo.planRange" disabled placeholder="请选择所属计划" />
                  <!--  @update:val="updateSelect" -->
                  <!-- <area-cascader v-model:value="formValue.regionId" check-strategy="child" /> -->
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card title="基本信息" class="shadow-sm mb-3">
            <p
              v-if="!isSelfCheck"
              class="bg-info_active border border-primary text-primary p-2.5 flex items-center mb-5"
            >
              <icon-carbon:information class="text-4" />
              <n-text class="text-primary pl-1">
                一个计划下可以创建多个任务，但是不同任务的班级不能重复；当前所选计划已创建
                {{ planInfo.taskNum }} 个任务。
              </n-text>
            </p>
            <n-grid x-gap="30" :cols="3">
              <n-gi v-if="isSelfCheck">
                <n-form-item label="任务年份" path="taskYear">
                  <n-select
                    v-model:value="taskForm.taskYear"
                    :disabled="isProgress"
                    placeholder="请选择任务年份"
                    :options="yearList()"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="任务名称" path="taskName">
                  <n-input
                    v-model:value="taskForm.taskName"
                    :disabled="isProgress"
                    :allow-input="illegalCharacter"
                    placeholder="请输入任务名称"
                    :maxlength="50"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="开始日期 - 结束日期" path="dateValue">
                  <n-date-picker
                    v-model:formatted-value="taskForm.dateValue"
                    type="daterange"
                    clearable
                    :disabled="isProgress"
                    :is-date-disabled="disabledYesterday"
                  />
                </n-form-item>
              </n-gi>

              <n-gi v-if="isSelfCheck">
                <n-form-item label="应用组名称" path="appGroupId">
                  <n-select
                    v-model:value="taskForm.appGroupId"
                    :disabled="isEdit"
                    :options="appGroupList"
                    placeholder="请选择应用组"
                    label-field="appGroupName"
                    value-field="appGroupId"
                    @update:value="handleAppGroupChange"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="筛查设备" path="equipmentIds">
                  <n-select
                    v-model:value="taskForm.equipmentIds"
                    multiple
                    :options="deviceList"
                    placeholder="请选择筛查设备"
                    label-field="equipmentModel"
                    value-field="id"
                    :disabled="isProgress"
                  />
                </n-form-item>
              </n-gi>
              <template v-if="!isSelfCheck">
                <n-gi>
                  <n-form-item label="应筛查学生" path="screenNum">
                    <n-input-number
                      v-model:value="taskForm.screenNum"
                      :show-button="false"
                      clearable
                      :min="taskForm.planNum"
                      :disabled="!taskForm.screenBoolean"
                      placeholder="请输入应筛查学生数"
                    >
                      <template #suffix> 人</template>
                    </n-input-number>
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="手动录入应筛数">
                    <n-switch
                      v-model:value="taskForm.screenBoolean"
                      :disabled="isProgress"
                      @update:value="handleSwitchChange"
                    />
                    <!-- <n-input v-model:value="taskForm.screenNum" disabled placeholder="请选择所属计划" /> -->
                  </n-form-item>
                </n-gi>
              </template>
            </n-grid>
          </n-card>
          <n-card title="筛查人员" class="shadow-sm mb-3">
            <span v-if="!taskPersonList?.length">暂无筛查员</span>
            <n-form-item v-else>
              <n-space vertical>
                <n-checkbox v-model:checked="checkAllWorkRaido" :indeterminate="halfCheckWork" @click="checkAllWork">
                  全选
                </n-checkbox>
                <n-checkbox-group v-model:value="taskForm.taskWorkerIdList">
                  <n-card v-if="directorList.length" title="年级主任" size="small" :bordered="false">
                    <n-space>
                      <n-checkbox
                        v-for="item in directorList"
                        :key="item.userId"
                        :value="item.userId"
                        :label="item.name"
                      />
                    </n-space>
                  </n-card>
                  <n-card v-if="screenList.length" title="筛查员" size="small" :bordered="false">
                    <n-space>
                      <n-checkbox
                        v-for="item in screenList"
                        :key="item.userId"
                        :value="item.userId"
                        :label="item.name"
                      />
                    </n-space>
                  </n-card>
                </n-checkbox-group>
              </n-space>
            </n-form-item>
          </n-card>
          <n-card title="筛查班级" class="shadow-sm mb-3">
            <span v-if="!classInfoList.length">暂无筛查班级，请选择{{ isSelfCheck ? '应用组' : '计划' }}重试</span>
            <n-form-item v-else path="classIdList">
              <n-space vertical>
                <n-checkbox v-model:checked="checkAllRaido" :indeterminate="halfCheck" @click="checkAll">
                  全选
                </n-checkbox>
                <template v-for="item in classInfoList" :key="item.prefx">
                  <n-card
                    v-for="ele in item.tackGradeList"
                    :key="`${item.prefx} + ${ele.className}`"
                    :title="`${item.prefxName}·${ele.gradeName}（${ele.classYear}级）`"
                    size="small"
                    :bordered="false"
                  >
                    <n-checkbox-group v-model:value="taskForm.classIdList">
                      <n-space>
                        <n-checkbox
                          v-for="info in ele.classList"
                          :key="info.classId"
                          :value="info.classId"
                          :label="info.className"
                          :disabled="info.disabled === 1"
                        />
                      </n-space>
                    </n-checkbox-group>
                  </n-card>
                </template>
              </n-space>
            </n-form-item>
          </n-card>
        </n-form>
      </template>
      <template v-if="currentRef === 2">
        <n-form ref="screenRef" :model="screenForm" :rules="taskRules">
          <n-card title="筛查项目">
            <n-card
              v-for="item in screenOptionList"
              :key="item.screeningTypeId"
              size="small"
              :title="item.screeningTypeName"
            >
              <n-grid x-gap="30" :cols="3">
                <n-gi v-for="ele in item.itemList" :key="ele.screeningItemId">
                  <n-form-item :label="ele.screeningItemName" path="className">
                    <n-select
                      v-model:value="ele.selection"
                      :disabled="ele.disabled"
                      :options="selectionList"
                      placeholder="请选择"
                    />
                  </n-form-item>
                </n-gi>
              </n-grid>
            </n-card>
          </n-card>
        </n-form>
      </template>
      <template v-if="currentRef === 3">
        <n-space vertical justify="center" class="flex-y-center bg-light">
          <icon-carbon:checkmark-filled class="text-20 text-primary" />
          <text class="text-6 font-bold mb-5"> 任务{{ isEdit ? '编辑' : '新增' }}成功 </text>
          <n-space vertical>
            <text class="text-4 mb-3"> {{ isSelfCheck ? '自查' : '筛查' }}学校：{{ sucData.taskOrgName }} </text>
            <text class="text-4 mb-3"> 任务名称： {{ sucData.taskName }} </text>
            <text class="text-4 mb-3"> 任务日期： {{ sucData.startTime }} - {{ sucData.endTime }} </text>
            <text class="text-4 mb-3"> 任务类型： {{ taskTypeName }} </text>
            <text v-if="!isSelfCheck" class="text-4 mb-3"> 所属计划： {{ sucData.planName }} </text>
          </n-space>
        </n-space>
      </template>
      <n-space justify="center" class="bg-[#fff] p-5 shadow-sm">
        <template v-if="currentRef === 1">
          <n-button key="cancel" size="large" @click="cancel">取消</n-button>
          <n-button key="next" size="large" type="primary" @click="next">下一步</n-button>
        </template>
        <template v-else-if="currentRef === 2">
          <n-button key="prev" size="large" @click="prev">上一步</n-button>
          <n-button key="submit" size="large" type="primary" @click="submit">提交</n-button>
        </template>
        <template v-else-if="currentRef === 3">
          <n-button key="see" size="large" type="primary" @click="cancel('view')">查看任务</n-button>
          <n-button key="close" size="large" @click="cancel('close')">关闭</n-button>
        </template>
      </n-space>
    </n-spin>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, provide, computed, watch } from 'vue';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { useRoute } from 'vue-router';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';
import { useUserStore, useApplicationStore } from '@/store';

import {
  getTaskPlanList,
  getDeviceList,
  getTaskPersonList,
  getClassList,
  getClassListBySelf,
  getPlanScreenOptions,
  addTask,
  getTaskDetail,
  editTask
} from '@common/api/examine/task';
import { getApplicationList, getScreenOptions } from '@common/api/common/index';
import { taskRulesFn, selectionList } from '../index.data';
import { yearList, typeList } from '../../common.data';
import { illegalCharacter } from '@common/utils/common';
// import { getDaysInMonth } from 'date-fns';

// import { rules } from './index.data.jsx';
const { go } = useGo();
const { query } = useRoute();
const { closeCurrent, setTitle } = useTabs();
// const { appType } = query;
const { appType } = useApplicationStore();

const {
  userInfo: { orgId }
} = useUserStore();
provide('query', query);

const isEdit = ref(!!query.id);

const taskData = {
  planId: null,
  taskName: null,
  dateValue: null,
  equipmentIds: null,
  taskWorkerIdList: null,
  classIdList: null,
  screenNum: null,
  screenBoolean: false,
  taskType: query.type,
  appGroupId: null,
  taskYear: null,
  appType
};
const taskForm = reactive(cloneDeep(taskData));
const taskRef = ref();
const initTaskStartDate = ref(null);

const loading = ref(false);
const currentRef = ref(1);
const planInfo = reactive({});
const taskPlanList = ref([]);
const deviceList = ref([]);
const taskPersonList = ref([]);
const directorList = ref([]);
const screenList = ref([]);
const classInfoList = ref([]);
const checkAllRaido = ref(false);
const checkAllWorkRaido = ref(false);

const appGroupList = ref([]);
// 默认的班级id
const classIdsOrgin = ref([]);
// 默认的筛查员id
const taskWorkerIdListOrgin = ref([]);

const screenForm = reactive({});
const screenRef = ref();
const screenOptionList = ref([]);
const appGroupInfo = reactive({});
const sucData = reactive({});
// 任务进行中和超时可编辑筛查员
const isProgress = computed(() => {
  return ['1', '4'].includes(taskForm.taskStatus);
});

const taskRules = taskRulesFn(initTaskStartDate, isProgress);

const allClassIds = computed(() => {
  let allIds = []; // 所有的班级集合
  let clsIds = []; // 除了disabled外的所有，都可以勾选的班级集合
  classInfoList.value?.map(item => {
    item?.tackGradeList?.map(ele => {
      ele?.classList?.map(info => {
        allIds.push(info.classId);
        info.disabled === 0 && clsIds.push(info.classId);
      });
    });
  });
  return { allIds, clsIds };
});

// 计算选中的列表中，去除原来的id，留下本次选择的id
const currentIds = () => {
  const ids = taskForm.classIdList?.reduce((pre, next) => {
    if (!classIdsOrgin?.value?.includes(next)) {
      pre.push(next);
    }
    return pre;
  }, []);
  return ids;
};
// 所有的人员
const AllTaskPersonListIds = computed(() => {
  const res = taskPersonList?.value?.reduce((pre, next) => {
    return [...pre, next.userId];
  }, []);
  return res;
});

const isSelfCheck = computed(() => {
  return query.type == 104;
});
const taskTypeName = computed(() => {
  return `${typeList.find(({ value }) => value == taskForm.taskType)?.label}任务`;
});
const titleName = computed(() => {
  return `${isSelfCheck.value ? '自查' : '筛查'}任务`;
});

const halfCheck = computed(() => {
  const currentIds1 = currentIds()?.length;
  const isEqul = allClassIds.value.clsIds?.length !== currentIds()?.length;
  return currentIds1 && isEqul;
});

const halfCheckWork = computed(() => {
  // if (taskForm.taskWorkerIdList?.length === taskWorkerIdListOrgin?.value?.length) {
  //   return false;
  // }
  return taskForm.taskWorkerIdList?.length && AllTaskPersonListIds.value?.length !== taskForm.taskWorkerIdList?.length;
});

setTitle(`${isEdit.value ? '编辑' : '新增'}${titleName.value}`);

watch([() => taskForm.classIdList, classInfoList], () => {
  // currentIds本次选择的id-之前选择的集合，与可选全量的集合相等时就全选
  if (!allClassIds.value.clsIds.length) {
    checkAllRaido.value = false;
    return;
  }
  checkAllRaido.value = allClassIds.value.clsIds.length === currentIds()?.length;
});

watch([() => taskForm.taskWorkerIdList], () => {
  // 如果选中的长度和原来的长度相等 那么checkAllWorkRaido = false
  // if (taskForm.taskWorkerIdList?.length === taskWorkerIdListOrgin.value?.length) {
  //   checkAllWorkRaido.value = false;
  //   return;
  // }
  // 所有人的集合 = 选择的人的集合
  checkAllWorkRaido.value = AllTaskPersonListIds.value?.length === taskForm.taskWorkerIdList?.length;
});

const init = async () => {
  loading.value = true;
  let apiList = [getDeviceList({ orgId }), getTaskPersonList({ orgId, taskId: query?.id })];
  if (isSelfCheck.value) {
    apiList.push(getApplicationList({ orgId, appType }));
    apiList.push(getClassListFn());
  } else {
    apiList.push(getTaskPlanList({ appType, isAll: isEdit.value ? 1 : 0 })); // 编辑获取全部计划，新增需过滤自动模式和未开始的计划
  }
  try {
    const res = await Promise.all(apiList);
    deviceList.value = res[0];
    taskPersonList.value = res[1];
    if (isSelfCheck.value) {
      appGroupList.value = res[2];
    } else {
      taskPlanList.value = res[2];
    }
    directorList.value = taskPersonList.value.filter(item => item.workerType == 2);
    // 管理员workerType为null 也可选
    screenList.value = taskPersonList.value.filter(item => item.workerType == 1 || !item.workerType);
    await getDetail();
  } finally {
    loading.value = false;
  }
};

const disabledYesterday = ts => {
  const { startTime, endTime } = planInfo;
  let flag = false;
  if (taskForm.taskType != null && (endTime || startTime)) {
    flag = dayjs(ts) > dayjs(endTime) || dayjs(ts) < dayjs(startTime);
  }
  return flag;
};

const getClassListFn = () => {
  return new Promise(resolve => {
    const { planId } = taskForm;
    let params = { orgId };
    const api = isSelfCheck.value ? getClassListBySelf : getClassList;
    !isSelfCheck.value && (params.planId = planId);
    api(params).then(data => {
      classInfoList.value = data;
      resolve();
    });
  });
};
const handlePlanChange = (val, option) => {
  Object.assign(planInfo, option);
  getClassListFn();
  taskForm.dateValue = null;
  taskForm.screenNum = option.studentNum;
  taskForm.planNum = option.studentNum;
  taskForm.taskType = option.planType;
};
const handleAppGroupChange = (val, option) => {
  Object.assign(appGroupInfo, option);
};
const handleSwitchChange = val => {
  if (!val) {
    taskForm.screenNum = planInfo.studentNum || 0;
  }
};

const checkAll = () => {
  if (!checkAllRaido.value) {
    // 这个是默认的班级id
    taskForm.classIdList = classIdsOrgin.value;
  } else {
    // 排除disabled后的id+默认的id
    taskForm.classIdList = [...cloneDeep(allClassIds.value.clsIds), ...classIdsOrgin.value];
  }
};

const checkAllWork = () => {
  if (!checkAllWorkRaido.value) {
    // taskForm.taskWorkerIdList = taskWorkerIdListOrgin.value;
    taskForm.taskWorkerIdList = [];
  } else {
    taskForm.taskWorkerIdList = cloneDeep(AllTaskPersonListIds.value);
  }
};

const getScreenOptionsFn = async () => {
  loading.value = true;
  try {
    const { planId } = taskForm;
    const { appId: applicationId, appVersion: version } = appGroupInfo;
    const api = isSelfCheck.value ? getScreenOptions : getPlanScreenOptions;
    let params = isSelfCheck.value ? { appId: applicationId, version } : { planId };
    screenOptionList.value = await api(params);
    // 筛查状态 selection 0-不查 1-必查 2-选查 如果等于1的话就是disabled状态
    screenOptionList.value?.map(item => {
      item.itemList?.map(ele => {
        ele.disabled = ele.selection === 1;
      });
    });
  } catch (error) {
    loading.value = false;
  }
};

onBeforeMount(() => {
  init();
});
const submit = async () => {
  console.log('submit');

  loading.value = true;
  try {
    const { dateValue, classIdList, taskWorkerIdList, screenBoolean, planId, screenNum, taskYear, ...info } = taskForm;
    const [startTime, endTime] = dateValue;

    let taskWorkerList = [];
    taskPersonList.value?.map(({ userId, workerType, userOrgId }) => {
      if (taskWorkerIdList?.includes(userId)) {
        taskWorkerList.push({ userId, workerType, userOrgId });
      }
    });
    let classList = [];
    classInfoList?.value?.map(({ prefx, tackGradeList }) => {
      tackGradeList?.map(({ classList: classItem, classYear, gradeName }) => {
        classItem?.map(({ classId }) => {
          if (classIdList?.includes(classId)) {
            classList.push({ classId, prefx, classYear, gradeName });
          }
        });
      });
    });
    let screeningOpitons = [];
    screenOptionList.value?.map(({ itemList }) => {
      // eslint-disable-next-line no-unused-vars
      itemList?.map(({ id, planId, taskId, disabled, selectionLaber, ...info }) => {
        let opt = isEdit.value ? { id, planId, taskId, ...info } : { ...info };
        screeningOpitons.push(opt);
      });
    });
    let params = {
      ...info,
      startTime,
      endTime,
      screenType: screenBoolean ? 1 : 2,
      taskWorkerList,
      classList,
      screeningOpitons
    };
    if (isSelfCheck.value) {
      const { appId: applicationId, appVersion } = appGroupInfo;
      Object.assign(params, { applicationId, planYear: taskYear, appVersion });
      isEdit.value && Object.assign(params, { taskId: query.id });
    } else {
      const { applicationId, appGroupId, appVersion } = planInfo;
      if (isEdit.value) {
        Object.assign(params, { screenNum, taskId: query.id });
      } else {
        Object.assign(params, { planId, screenNum, applicationId, appGroupId, appVersion });
      }
    }
    // console.log(params);
    let subApi = isEdit.value ? editTask : addTask;
    const data = await subApi(params);
    Object.assign(sucData, data);
    currentRef.value = 3;
  } finally {
    loading.value = false;
  }
};

const getDetail = async () => {
  const { id } = query;
  if (!id) return;
  const params = { taskId: id };
  loading.value = true;
  try {
    const res = await getTaskDetail(params);
    const {
      planId,
      taskName,
      startTime,
      endTime,
      equipmentIds,
      taskWorkerList,
      classIds,
      screenNum,
      screenType,
      screeningOptions,
      appGroupId,
      planYear,
      taskStatus
    } = res;
    initTaskStartDate.value = [startTime, endTime];
    let form = {
      taskName,
      // dateValue: [startTime.substr(0, 10), endTime.substr(0, 10)],
      dateValue: [startTime, endTime],
      equipmentIds,
      classIdList: classIds,
      screenNum,
      taskStatus
    };
    form.taskWorkerIdList = taskWorkerList.map(item => item.userId);
    classIdsOrgin.value = classIds;
    taskWorkerIdListOrgin.value = form.taskWorkerIdList;
    screenOptionList.value = screeningOptions;
    screenOptionList.value?.map(item => {
      item.itemList?.map(ele => {
        ele.disabled = ele.selection === 1;
      });
    });
    if (isSelfCheck.value) {
      form.appGroupId = appGroupId;
      Object.assign(taskForm, form, { taskYear: planYear });
      Object.assign(
        appGroupInfo,
        appGroupList.value.find(item => item.appGroupId == appGroupId)
      );
    } else {
      form.planId = planId;
      form.screenBoolean = screenType == 1;
      Object.assign(taskForm, form);
      Object.assign(
        planInfo,
        taskPlanList.value.find(item => item.planId == planId)
      );
      getClassListFn();
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({});
    }, 1000);
  });
};
const next = async () => {
  loading.value = true;
  try {
    // // 校验完其他的之后校验一下筛查员和筛查班级
    await taskRef.value?.validate();

    if (!taskForm.taskWorkerIdList?.length) {
      window.$message?.error('至少添加一个筛查员');
      return;
    }
    if (!taskForm.classIdList?.length) {
      window.$message?.error('至少添加一个班级');
      return;
    }
    if (!isEdit.value) {
      getScreenOptionsFn();
    }
    currentRef.value++;
  } finally {
    loading.value = false;
  }

  // if (currentRef.value === null) currentRef.value = 1;
  // else if (currentRef.value >= 3) currentRef.value = null;
  // else currentRef.value++;
};
const prev = () => {
  if (currentRef.value === 0) currentRef.value = null;
  else if (currentRef.value === null) currentRef.value = 3;
  else currentRef.value--;
};
const cancel = key => {
  switch (key) {
    case 'view':
      closeCurrent();
      go({
        name: 'TaskDetail',
        query: { id: sucData.taskId }
      });
      break;
    case 'close':
      closeCurrent();
      // go('/examine/task-list');
      go(`/examine/task-list?appType=${appType}`);
      break;
    default:
      // go(`/examine/task-list?appType=${appType}`);
      go(`/examine/task-list?appType=${appType}`);
      break;
  }
};
</script>

<style scoped lang="less"></style>
