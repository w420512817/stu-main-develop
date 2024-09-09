<template>
  <div>
    <n-card title="基本信息" class="shadow-sm mb-3">
      <n-form ref="formRef" inline>
        <n-grid cols="4">
          <n-form-item-gi label="任务名称">
            {{ formValue.planName }}
          </n-form-item-gi>
          <n-form-item-gi label="开始时间-结束时间">
            {{ formValue.startTime }} - {{ formValue.endTime }}
          </n-form-item-gi>
          <n-form-item-gi label="该学校任务数">
            {{ formValue.screenNum }}
          </n-form-item-gi>
          <n-form-item-gi path="classYear" label="任务年级" style="position: relative">
            <n-select
              v-model:value="formValue.gradeIds"
              value-field="gradeId"
              label-field="name"
              class="!w-280px"
              :options="gradeOpt"
              multiple
              max-tag-count="responsive"
              :disabled="schoolTLoading"
              @update:value="schoolTree"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="4" label="要求说明：">
            {{ formValue.planVO?.remark || '--' }}
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card class="shadow-sm mb-3">
      <q-suspense :loading="tableLoading">
        <n-data-table :columns="columns" :data="tableData" :loading="schoolTLoading" />
      </q-suspense>
    </n-card>
    <n-card title="筛查设备" class="shadow-sm mb-3">
      <template #header-extra>
        <n-button v-auth="[9416, 9420, 9423, 9426]" type="primary" @click="openDeviceModal(true)">
          新增筛查设备
        </n-button>
      </template>
      <n-spin :show="deviceLoading">
        <template v-if="deviceData.length">
          <n-checkbox
            v-model:checked="formOther.equipmentIds.checkALL"
            mb-10px
            :indeterminate="formOther.equipmentIds.checkHalf"
            @update:checked="handleCheckAll('equipmentIds')"
          >
            全选
          </n-checkbox>
          <n-checkbox-group v-model:value="form.equipmentIds">
            <n-space item-style="display: flex;">
              <n-checkbox
                v-for="(item, index) in deviceData"
                :key="index"
                :value="item.equipmentId"
                :label="`${item.equipmentVendor}-${item.equipmentModel}`"
              />
            </n-space>
          </n-checkbox-group>
        </template>
        <div v-else class="color-[#999] pb-20px">暂无筛查设备，请点击【新增筛查设备】添加</div>
      </n-spin>
      <addDeviceModal @register="registerDevice" @on-success="getDeviceList" />
    </n-card>
    <n-card title="筛查人员" class="shadow-sm">
      <template #header-extra>
        <n-button v-auth="[9416, 9419, 9422, 9425]" type="primary" @click="openScreenerModal(true)">
          新增筛查人员
        </n-button>
      </template>
      <n-spin :show="accountLoading">
        <template v-if="accountData.length">
          <n-checkbox
            v-model:checked="formOther.taskWorkerList.checkALL"
            mb-10px
            :indeterminate="formOther.taskWorkerList.checkHalf"
            @update:checked="handleCheckAll('taskWorkerList')"
          >
            全选
          </n-checkbox>
          <n-checkbox-group v-model:value="form.taskWorkerList">
            <n-space item-style="display: flex;">
              <n-checkbox v-for="(item, index) in accountData" :key="index" :value="item.userId" :label="item.name" />
            </n-space>
          </n-checkbox-group>
        </template>
        <div v-else class="color-[#999] pb-20px">暂无筛查人员，请点击【新增筛查人员】添加</div>
      </n-spin>

      <addAccountModal @register="registerScreener" @on-success="getScreenerList" />
    </n-card>

    <n-card class="shadow-sm mt-20px text-center">
      <n-button type="primary" :loading="loading" :disabled="loading" @click="validate()">保存</n-button>
      <n-button ml-30px @click="go(-1)">取消</n-button>
    </n-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, watchEffect } from 'vue';
import addAccountModal from './components/addAccountModal.vue';
import addDeviceModal from './components/addDeviceModal.vue';
import QSuspense from '@common/qd-components/QSuspense/index.vue';

import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import useLoading from '@common/hooks/useLoading';
import { useUserStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';

import {
  getEquipmentPageList,
  getEquipmentSelectList,
  GetAccountList,
  ArrangeScreenAndDevice,
  getSchoolTree,
  getTaskDetail
} from '@common/api/examine/task';
import { schoolGradeList } from '@common/api/common';
import { schoolEditTable } from './index.data';
import { showScreenNumWraning } from '../common.data';

const [registerScreener, { openModal: openScreenerModal }] = useModal();
const [registerDevice, { openModal: openDeviceModal }] = useModal();

const { fetch: taskInfoApi, loading: tableLoading } = useApi(getTaskDetail);
const { fetch: getSchoolTreeApi, loading: schoolTLoading } = useApi(getSchoolTree);
const { fetch: getAccountListApi, loading: accountLoading } = useApi(GetAccountList);
const { fetch: getDeviceListApi, loading: deviceLoading } = useApi(getEquipmentPageList);
const { loading, startLoading, endLoading } = useLoading();
const { go } = useRouter();

const {
  userInfo: { orgId }
} = useUserStore();
const {
  query: { taskId = '' }
} = useRoute();

const accountData = ref([]);
const deviceData = ref([]);
const gradeOpt = ref([]);
const tableData = ref([]);
const columns = ref([]);

const form = reactive({
  taskId,
  taskWorkerList: [],
  equipmentIds: [],
  gradeIds: undefined,
  regionVOS: []
});

const formValue = reactive({});

const formOther = reactive({
  taskWorkerList: { checkALL: false, checkHalf: false },
  equipmentIds: { checkALL: false, checkHalf: false }
});

async function getSchoolGradeList() {
  let res = await schoolGradeList();
  gradeOpt.value = res;
}

async function getDetail() {
  let res = await taskInfoApi({ taskId, schoolId: orgId });
  res.gradeId ||= [];
  Object.assign(formValue, res);

  let gradeIds = [];
  gradeOpt.value.forEach(item => {
    let isCon = formValue.gradeId.some(v => v.indexOf(item.gradeId) != -1);
    if (isCon) {
      gradeIds.push(item.gradeId);
      item.disabled = true;
    }
  });
  formValue.gradeIds = gradeIds;
  columns.value = schoolEditTable(formValue);
  schoolTree();
}

const handleCheckAll = key => {
  formOther[key].checkHalf = false;
  if (!formOther[key].checkALL) {
    form[key] = [];
    return;
  }

  switch (key) {
    case 'taskWorkerList':
      form[key] = accountData.value.map(v => v.userId);
      break;
    case 'equipmentIds':
      form[key] = deviceData.value.map(i => i.equipmentId);
      break;
  }
};

const getScreenerList = async () => {
  const data = await getAccountListApi({ orgId, taskId });
  form.taskWorkerList = data.filter(i => i.status === 1).map(item => item.userId); // 过滤出选中的筛查员
  accountData.value = data;
};
const getDeviceList = async () => {
  const data = await getDeviceListApi({ pageNum: 1, pageSize: 50, orgId });
  const { records = [] } = data;
  deviceData.value = records;
};
const getDeviceSelect = async () => {
  const data = await getEquipmentSelectList({ taskId }); // 选中的筛查设备
  form.equipmentIds = data ?? [];
};

function validate() {
  validateTableNum();
  handleSubmit();
}

const handleSubmit = async () => {
  startLoading();
  try {
    let taskWorkerList = form.taskWorkerList.map(item => {
      return accountData.value.find(v => v.userId == item) || {};
    });
    let gradeName = formValue.gradeIds
      .map(item => {
        let opt = gradeOpt.value.find(v => v.gradeId == item);
        return opt.name;
      })
      .join(',');
    await ArrangeScreenAndDevice({
      ...form,
      gradeIds: formValue.gradeIds.join(','),
      gradeName,
      regionVOS: tableData.value,
      taskWorkerList
    });
    window.$message.success('保存成功');
    go(-1);
  } finally {
    endLoading();
  }
};
async function schoolTree() {
  let res = await getSchoolTreeApi({ taskId, gradeIds: formValue.gradeIds.join(',') });
  res.forEach(item => {
    item.screeningNum ??= item.stuCount;
  });
  tableData.value = res;
}

function validateTableNum() {
  let totalNum = tableData.value.reduce((perv, item) => {
    return perv + ~~item.screeningNum;
  }, 0);

  if (totalNum < formValue.screenNum) {
    let msg = '设置目标数小于学校任务数';
    window.$preDialog({
      type: 'error',
      negativeText: undefined,
      content: msg
    });
    throw new Error(msg);
  }

  let overstep = [];
  tableData.value.forEach(item => {
    let { stuCount, screeningNum, regionName } = item;
    if (screeningNum > stuCount) {
      overstep.push({
        regionName,
        gradeNum: stuCount,
        screeningNum
      });
    }
  });
  if (overstep.length) {
    showScreenNumWraning(overstep, handleSubmit);
    throw new Error('目标数超出各年级学生数');
  }
}

watchEffect(() => {
  const deviceIds = form.equipmentIds;
  if (deviceIds.length === 0) {
    formOther.equipmentIds = { checkALL: false, checkHalf: false };
  } else if (deviceIds.length === deviceData.value?.length) {
    formOther.equipmentIds = { checkALL: true, checkHalf: false };
  } else {
    formOther.equipmentIds = { checkALL: false, checkHalf: true };
  }
});

watch(
  () => form.taskWorkerList,
  val => {
    if (val.length === 0) {
      formOther.taskWorkerList = { checkALL: false, checkHalf: false };
    } else if (val.length === accountData.value?.length) {
      formOther.taskWorkerList = { checkALL: true, checkHalf: false };
    } else {
      formOther.taskWorkerList = { checkALL: false, checkHalf: true };
    }
  }
);

onMounted(async () => {
  startLoading();
  await Promise.all([getScreenerList(), getDeviceList(), getDeviceSelect(), getSchoolGradeList()]);
  await getDetail();
  endLoading();
});
</script>
<style scoped></style>
