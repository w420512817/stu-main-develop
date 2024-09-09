<template>
  <n-spin :show="loading">
    <n-form>
      <n-space justify="space-between" class="mb-3 bg-light pa-5">
        <p class="font-bold text-6">{{ formValue.taskName }}</p>
        <n-space>
          <n-button
            v-auth="[9023, 9071, 9119, 9167]"
            :disabled="isCanEdit"
            attr-type="button"
            type="primary"
            @click="handleClick(AC_EDIT)"
          >
            编辑
          </n-button>
          <n-button v-auth="[9024, 9072, 9120, 9168]" attr-type="button" @click="handleClick('no_screen_list')">
            不可筛查名单
          </n-button>
          <n-button v-auth="[9025, 9073, 9121, 9169]" attr-type="button" @click="handleClick(AC_EXPORT)">
            下载数据
          </n-button>
        </n-space>
      </n-space>
      <n-card :title="`筛查进度 ${studentInfo.title || ''}`" class="shadow-sm mb-3">
        <template #header-extra>
          <n-button v-if="isClassDetail" @click="handleClick('back_up')"> 返回上一级 </n-button>
        </template>
        <n-grid x-gap="10" :cols="2">
          <n-gi>
            <n-card :bordered="false" size="small" title="学生概况">
              <n-grid x-gap="10" :cols="3">
                <n-gi>
                  <n-progress
                    type="circle"
                    :percentage="studentInfo.studentRate"
                    :offset-degree="180"
                    :stroke-width="10"
                  >
                    <n-space vertical class="text-center">
                      <span>筛查进度</span>
                      <span>{{ studentInfo.studentRate }}%</span>
                    </n-space>
                  </n-progress>
                </n-gi>
                <n-gi :span="2">
                  <n-grid x-gap="10" y-gap="20" :cols="2">
                    <n-gi> {{ isClassDetail ? '在读人数' : '计划筛查' }}：{{ studentInfo.planScreeningNum }} 人 </n-gi>
                    <n-gi> 不可筛查：{{ studentInfo.notScreeningNum }} 人 </n-gi>
                    <n-gi> 应筛查：{{ studentInfo.shouldScreeningNum }} 人 </n-gi>
                    <n-gi> 未开始：{{ studentInfo.notStartedScreeningNum }} 人 </n-gi>
                    <n-gi> 进行中：{{ studentInfo.onScreeningNum }} 人 </n-gi>
                    <n-gi> 已筛查：{{ studentInfo.haveScreeningNum }} 人 </n-gi>
                  </n-grid>
                </n-gi>
              </n-grid>
            </n-card>
          </n-gi>
        </n-grid>
        <template v-if="isClassDetail">
          <n-form label-placement="left" :model="formData">
            <n-grid :cols="4">
              <n-form-item-gi label="姓名：">
                <n-input v-model:value="formData.studentName" />
              </n-form-item-gi>
              <n-form-item-gi label="身份证：" ml-7>
                <n-input v-model:value="formData.idcard" />
              </n-form-item-gi>
              <n-form-item-gi ml-7>
                <search-buttons @search="handleSearch" @reset="onReset" />
              </n-form-item-gi>
            </n-grid>
          </n-form>
          <n-space>
            <n-button
              v-auth="[9030, 9078, 9126, 9174]"
              :disabled="!['1', '3', '4', '0'].includes(formValue.taskStatus)"
              attr-type="button"
              @click="handleTableClick('remove_all')"
            >
              移除
            </n-button>
          </n-space>
          <n-data-table
            v-model:checked-row-keys="checkRow"
            remote
            striped
            :render-cell="v => v ?? '/'"
            :columns="stuColumns"
            :data="taskStuDetailList"
            :bordered="false"
            :pagination="pagination"
            :row-key="row => row.id"
            :row-class-name="row => (row.parentIsAgree == 0 && isConsentStatus ? 'disabled' : '')"
          />
        </template>
        <n-space v-else vertical>
          <n-table
            v-for="item in prefixGradeInfo"
            :key="item.prefx"
            :bordered="false"
            :single-line="false"
            size="small"
          >
            <tbody>
              <tr>
                <td class="font-bold w-200px">{{ item.prefxLaber }}</td>
                <td>应筛学生：{{ item.screenNum }} 人</td>
                <td><n-progress type="line" :percentage="item.rate" /></td>
                <td>&nbsp;</td>
              </tr>
              <tr v-for="(ele, i) in item.tackGradeList" :key="i">
                <td w-200px>{{ ele.gradeName }}（{{ ele.classYear }}级）</td>
                <td>应筛学生：{{ ele.screenNum }}人</td>
                <td class="w-25%"><n-progress type="line" :percentage="ele.rate" /></td>
                <td class="w-45%">
                  <n-space class="pl-10">
                    <n-button
                      v-for="info in ele.classList"
                      :key="info.classId"
                      v-auth="[9026, 9074, 9122, 9170]"
                      :disabled="disabled"
                      size="small"
                      @click="handleClick(AC_DETAILS, info)"
                    >
                      {{ info.className }}
                    </n-button>
                  </n-space>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-space>
      </n-card>
      <n-card title="基本信息" class="shadow-sm mb-3">
        <n-grid x-gap="10" :cols="3">
          <n-gi>
            <n-form-item label="任务名称"> {{ formValue.taskName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="开始日期-结束日期"> {{ formValue.startTime }} ~ {{ formValue.endTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="筛查设备"> {{ formValue.equipment }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="应筛查学生"> {{ formValue.screenNum }} 人 </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建时间"> {{ formValue.createTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建人"> {{ formValue.creatorName }} </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>
      <n-card v-if="formValue.taskType !== 104" title="计划信息" class="shadow-sm mb-3">
        <n-grid x-gap="10" :cols="3">
          <n-gi>
            <n-form-item label="计划名称"> {{ formValue.planVO.planName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="计划年份"> {{ formValue.planVO.planYear }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="开始日期-结束日期">
              {{ formValue.planVO.startTime }} ~ {{ formValue.planVO.endTime }}
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="计划类型"> {{ formValue.planVO.planType }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="计划范围"> {{ formValue.planVO.planRange }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="应筛查学生"> {{ formValue.planVO.screenNum }} 人 </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建时间"> {{ formValue.planVO.createTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建机构"> {{ formValue.planVO.orgName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建人"> {{ formValue.planVO.creatorName }} </n-form-item>
          </n-gi>
          <n-gi span="3">
            <n-form-item label="要求说明"> {{ formValue.planVO.remark }} </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>
      <n-card v-if="formValue.taskType === 102" title="筛查条件" class="shadow-sm mb-3">
        <n-card
          v-for="(item, i) in formValue.planVO.screeningConditionList"
          :key="i"
          :bordered="false"
          size="small"
          :title="`筛选条件${i + 1}`"
        >
          <n-grid x-gap="10" :cols="3">
            <n-gi>
              <n-form-item label="学校"> {{ item.orgName }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="年级"> {{ item.grade }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="班级"> {{ item.className }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="抽查人数"> {{ item.number }} 人 </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-card>
      <n-card title="筛查项目" class="shadow-sm mb-3">
        <n-card
          v-for="item in formValue.screeningOptions"
          :key="item.screeningTypeId"
          :bordered="false"
          size="small"
          :header-style="{ 'padding-left': 0, 'padding-right': 0 }"
          :content-style="{ 'padding-left': 0, 'padding-right': 0 }"
          :title="item.screeningTypeName"
        >
          <!-- TODO:确认一下有没有数据 -->
          <n-grid x-gap="10" :cols="3">
            <n-gi v-for="ele in item.itemList" :key="ele.id">
              <n-form-item label-style="font-size:15px" :label="ele.screeningItemName">
                {{ ele.selectionLaber }}
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-card>

      <n-card title="筛查人员" class="shadow-sm mb-3">
        <n-data-table
          striped
          :render-cell="v => v ?? '/'"
          :columns="columns"
          :data="formValue.taskWorkerList"
          :bordered="false"
        />
      </n-card>
      <NotScreenStu title="不可筛查名单" @register="register" @on-success="getStuTableData" />
      <DownloadModal title="下载数据" @register="registerDown" />
      <RemoveStuModal title="移除" @register="registerRemove" @on-success="getStuTableData" />
      <ClearModal title="清除数据" @register="registerClear" @on-success="getStuTableData" />
      <InputDataModal :title="inputTitle" @register="registerInput" @on-success="getStuTableData" />
    </n-form>
  </n-spin>
</template>

<script setup lang="jsx">
import { reactive, ref, onBeforeMount, provide, computed, toRaw } from 'vue';
// import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { useGo } from '@common/hooks/usePage';
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';

import {
  getTaskDetail,
  getTaskRate,
  getTaskScreeningRate,
  getTaskScreeningRateClass,
  getTaskRateClass,
  getConsentStatus
} from '@common/api/examine/task';

import { screenPersonColumns, taskDetailColumns } from '../index.data.jsx';
import { textFormat } from '../../common.data.jsx';
import { AC_EDIT, AC_EXPORT, AC_DETAILS, AC_IMPORT, AC_CLEAR, AC_DELETE } from '@common/enum/pageEnum';

import NotScreenStu from '../components/notScreenStu.vue';
import DownloadModal from '../components/downloadModal.vue';
import RemoveStuModal from '../components/removeStuModal.vue';
import ClearModal from '../components/clearModal.vue';
import InputDataModal from '../components/screening/inputDataModal.vue';

const { fetch: getTaskDetailApi } = useApi(getTaskDetail);
const { fetch: getTaskRateApi } = useApi(getTaskRate);
const { fetch: getTaskScreeningRateApi } = useApi(getTaskScreeningRate);
const { fetch: getTaskScreeningRateClassApi } = useApi(getTaskScreeningRateClass);
const { fetch: getTaskRateClassApi } = useApi(getTaskRateClass);
const { pagination, setCount, setPage } = usePagination(() => {
  getStuTableData();
});
const { go } = useGo();
const { query } = useRoute();
provide('query', query);
const [register, { openModal }] = useModal();
const [registerDown, { openModal: openModalDown }] = useModal();
const [registerRemove, { openModal: openModalRemove }] = useModal();
const [registerClear, { openModal: openModalClear }] = useModal();
const [registerInput, { openModal: openModalInput }] = useModal();

const originData = {
  studentName: null,
  idcard: null
};

const formData = reactive({ ...originData });
const formValue = reactive({ planVO: {} });
const loading = ref(false);
const isConsentStatus = ref(false);
const columns = screenPersonColumns();
const stuColumns = taskDetailColumns({ handleTableClick });

const studentInfo = reactive({});
const prefixGradeInfo = ref([]);
const isClassDetail = ref(!!query.classId);
const taskStuDetailList = ref([]);
const checkRow = ref([]);
const inputTitle = ref('录入数据');

const isCanEdit = computed(() => {
  // 计划模式下 只有待开始 进行中 可以编辑
  let planModeEdit = query.planMode == 1 && !['0', '1'].includes(formValue.taskStatus);
  // 任务模式下 除了已完成都可以编辑
  let taskMode = query.planMode == 2 && ['2'].includes(formValue.taskStatus);
  return planModeEdit || taskMode;
});

const getDetail = async () => {
  const { id, classId } = query;
  if (!id) return;
  loading.value = true;
  try {
    const apiList = [getTaskDetailApi({ taskId: id })];
    if (isClassDetail.value) {
      apiList.push(getTaskScreeningRateClassApi({ taskId: id, classId }));
      apiList.push(getStuTableData());
      consentStatus();
    } else {
      apiList.push(getTaskScreeningRateApi({ taskId: id }));
      apiList.push(getTaskRateApi({ taskId: id }));
    }
    const res = await Promise.all(apiList);

    Object.assign(formValue, res[0]);
    Object.assign(studentInfo, res[1]);

    !isClassDetail.value && (prefixGradeInfo.value = res[2]);
    dataFormat();
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
const dataFormat = () => {
  formValue.equipment = formValue.equipment?.length ? formValue.equipment.join(',') : '/';
  formValue.planVO.screeningConditionList.forEach(item => {
    Object.keys(item).forEach(key => {
      item[key] = textFormat(item[key]);
    });
  });
};
const getStuTableData = () => {
  return new Promise((resolve, reject) => {
    const { classId, id } = query;
    const { page: current, pageSize: size } = pagination;
    const params = {
      ...toRaw(formData),
      taskId: id,
      classId,
      current,
      size
    };
    getTaskRateClassApi(params)
      .then(data => {
        taskStuDetailList.value = data?.records ?? [];
        setCount(+data.total);
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
};

async function consentStatus() {
  let res = await getConsentStatus({ taskId: query.id });
  isConsentStatus.value = res;
}

function handleTableClick(key, row = {}) {
  const { taskId, planId } = formValue;
  if (+row.parentIsAgree == 0 && isConsentStatus.value) {
    window.$preDialog({
      title: '温馨提示',
      positiveText: '确认',
      negativeText: undefined,
      content: () => <div className="my-2 text-15px">该学生家长未同意此次任务《知情同意书》，不可参与筛查</div>,
      showIcon: false,
      type: 'info'
    });
    return;
  }
  switch (key) {
    case AC_IMPORT:
    case AC_DETAILS:
      inputTitle.value = `${key === AC_DETAILS ? '查看' : '录入'}数据-${row.studentName}-${row.age}岁`;
      openModalInput(true, {
        isView: key === AC_DETAILS,
        taskId,
        planId,
        studentId: row.studentId,
        examEyesightId: row.examEyesightId,
        examCariesId: row.examCariesId,
        examCheckupId: row.examCheckupId,
        examPhysicalId: row.examPhysicalId,
        studentAge: row.age,
        sex: row.sex == '男' ? 1 : 2
      });
      break;
    // console.log('查看');
    // break;
    case AC_CLEAR:
      openModalClear(true, {
        taskId,
        studentId: row.studentId,
        id: row.id,
        examEyesightId: row.examEyesightId,
        examCariesId: row.examCariesId,
        examCheckupId: row.examCheckupId,
        examPhysicalId: row.examPhysicalId,
        examSpineId: row.examSpineId
      });
      break;
    case AC_DELETE:
      openModalRemove(true, { list: [row] });
      break;
    case 'remove_all':
      if (!checkRow.value.length) {
        window.$message.warning('至少要选择一个学生');
        return;
      }
      openModalRemove(true, { list: taskStuDetailList.value.filter(ele => checkRow.value.includes(ele.id)) });
      break;
  }
}
const handleClick = (key, row) => {
  const { taskId, taskType, appType, taskName, taskOrgId, taskOrgName, planId, taskOrgId: schoolId } = formValue;
  switch (key) {
    case AC_EDIT:
      if (query.planMode == 2) {
        go({
          name: 'TaskConfiguration',
          query: { taskId }
        });
      } else {
        go({
          name: 'TaskModify',
          query: { id: taskId, type: taskType, schoolId: taskOrgId, appType }
        });
      }

      break;
    case AC_DETAILS:
      go({
        name: 'TaskDetail',
        query: { id: taskId, classId: row.classId, planMode: query.planMode }
      });
      break;

    case 'no_screen_list':
      openModal(true, { taskId });
      break;
    case AC_EXPORT:
      openModalDown(true, { taskId, taskName, taskOrgName, planId, schoolId });
      break;
    case 'back_up':
      go({ name: 'TaskDetail', query: { id: taskId, planMode: query.planMode } });
      break;
  }
};
function handleSearch() {
  setPage(1);
  getStuTableData();
}

function onReset() {
  Object.assign(formData, originData);
  setPage(1);
  getStuTableData();
}

onBeforeMount(() => {
  getDetail();
});
</script>

<style scoped lang="less">
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  width: 45px;
}
:deep(.disabled) {
  opacity: 0.5;
}
</style>
