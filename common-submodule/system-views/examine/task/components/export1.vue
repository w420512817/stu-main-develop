<template>
  <basic-modal
    v-bind="$attrs"
    class="w-182"
    @register="register"
    @ok="handleSubmit"
    @visible-change="handleVisibleChange"
  >
    <n-space h-400px overflow-y-auto>
      <h3>请选择下载内容</h3>
      <n-form ref="formRef" :label-width="110" :model="formValue" label-placement="left" label-align="right">
        <n-form-item label="学生信息" path="studentInfo">
          <div>
            <n-checkbox
              v-model:checked="state.studentInfo.checkall"
              my-2
              :indeterminate="state.studentInfo.indeterminate"
              @update:checked="updateCheckall('studentInfo')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group v-model:value="formValue.studentInfo" @update:value="updateGroupCheck('studentInfo')">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.studentInfo"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                  :disabled="item.value == 8"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-form-item>
        <n-form-item label="视力筛查信息" path="slScreening">
          <div>
            <n-checkbox
              v-model:checked="state.slScreening.checkall"
              my-2
              :indeterminate="state.slScreening.indeterminate"
              @update:checked="updateCheckall('slScreening')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group v-model:value="formValue.slScreening" @update:value="updateGroupCheck('slScreening')">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.slScreening"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-form-item>
        <n-form-item label="屈光度筛查信息" path="qgScreening">
          <div>
            <n-checkbox
              v-model:checked="state.qgScreening.checkall"
              :indeterminate="state.qgScreening.indeterminate"
              my-2
              @update:checked="updateCheckall('qgScreening')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group v-model:value="formValue.qgScreening" @update:value="updateGroupCheck('qgScreening')">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.qgScreening"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-form-item>
        <n-form-item label="筛查情况" path="screeningInfo">
          <div>
            <n-checkbox
              v-model:checked="state.screeningInfo.checkall"
              my-2
              :indeterminate="state.screeningInfo.indeterminate"
              @update:checked="updateCheckall('screeningInfo')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group v-model:value="formValue.screeningInfo" @update:value="updateGroupCheck('screeningInfo')">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.screeningInfo"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-form-item>
        <n-form-item label="视力情况" path="slInfo">
          <div>
            <n-checkbox
              v-model:checked="state.slInfo.checkall"
              my-2
              :indeterminate="state.slInfo.indeterminate"
              @update:checked="updateCheckall('slInfo')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group v-model:value="formValue.slInfo" @update:value="updateGroupCheck('slInfo')">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.slInfo"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-form-item>
        <n-form-item label="其他筛查项信息" path="otherScreening">
          <div v-if="exportGroupCheckbox.otherScreening.length">
            <n-checkbox
              v-model:checked="state.otherScreening.checkall"
              my-2
              :indeterminate="state.otherScreening.indeterminate"
              @update:checked="updateCheckall('otherScreening')"
            >
              全选
            </n-checkbox>
            <n-checkbox-group
              v-model:value="formValue.otherScreening"
              @update:value="updateGroupCheck('otherScreening')"
            >
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="(item, index) in exportGroupCheckbox.otherScreening"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
          <p v-else>暂无其他筛查信息</p>
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { ref, reactive, nextTick, toRaw } from 'vue';
import { cloneDeep } from 'lodash-es';

import { useModalInner } from '@common/components/custom/Modal';

import { dataGroupCheckbox } from '../../common.data.jsx';
import { downloadFile } from '@common/utils/file/download';

import { getTaskScreeningItem, exportVisionScreeningData } from '@common/api/examine/export.js';

const originData = {
  taskId: null,
  studentInfo: [1, 2, 3, 5, 7, 8, 9, 10],
  slScreening: [1, 2, 3, 4],
  qgScreening: [1, 2, 3],
  screeningInfo: [],
  slInfo: [],
  otherScreening: []
};
const originStatue = {
  studentInfo: { indeterminate: true, checkall: false },
  slScreening: { indeterminate: true, checkall: false },
  qgScreening: { indeterminate: true, checkall: false },
  slInfo: { indeterminate: false, checkall: false },
  screeningInfo: { indeterminate: false, checkall: false },
  otherScreening: { indeterminate: false, checkall: false }
};

const formValue = reactive(cloneDeep(originData));
const formRef = ref(null);
const state = reactive(cloneDeep(originStatue));
const exportGroupCheckbox = reactive(cloneDeep(dataGroupCheckbox));

const [register, { changeLoading, closeModal }] = useModalInner(data => {
  if (data) {
    Object.assign(formValue, data);
    getScreenList();
  }
});

const handleVisibleChange = async visible => {
  await nextTick();
  !visible && resetForm();
};

const resetForm = () => {
  Object.assign(formValue, originData);
  Object.assign(state, originStatue);
};
const getScreenList = async () => {
  const data = await getTaskScreeningItem({ taskId: formValue.taskId });
  if (data?.length) {
    exportGroupCheckbox['otherScreening'] = data.map((d, i) => ({
      label: d.screeningItemName,
      value: i + 1,
      id: d.screeningItemId
    }));
  }
};
const handleSubmit = e => {
  e.preventDefault();
  formRef.value.validate(async errors => {
    if (!errors) {
      onDownload();
    }
  });
};
const filterIds = (key, list) => {
  return exportGroupCheckbox[key].filter(d => !!list.includes(d.value)).map(d => d.id);
};
const onDownload = async () => {
  changeLoading(true);
  try {
    const { taskId, otherScreening, studentInfo, slScreening, qgScreening, screeningInfo, slInfo } = toRaw(formValue);

    const otherScreen = filterIds('otherScreening', otherScreening);
    const stuInfo = filterIds('studentInfo', studentInfo);
    const slScreen = filterIds('slScreening', slScreening);
    const qgScreen = filterIds('qgScreening', qgScreening);
    const screenInfo = filterIds('screeningInfo', screeningInfo);
    const SlInfo = filterIds('slInfo', slInfo);
    const arr = [...stuInfo, ...slScreen, ...qgScreen, ...screenInfo, ...SlInfo];
    const params = {
      taskId: taskId,
      otherScreening: otherScreen.length ? otherScreen.toString() : [],
      studentInfo: arr.toString()
    };
    const res = await exportVisionScreeningData(params);
    res?.data && downloadFile(res.data, `${formValue.planName}-${formValue.taskOrgName}-视力检测数据`, 'xlsx');
    closeModal();
  } finally {
    changeLoading(false);
  }
};

const updateGroupCheck = key => {
  const len = toRaw(formValue[key]).length;
  if (len == exportGroupCheckbox[key].length) {
    state[key].checkall = true;
    state[key].indeterminate = false;
  } else if (len) {
    state[key].checkall = false;
    state[key].indeterminate = true;
  } else {
    state[key].checkall = false;
    state[key].indeterminate = false;
  }
};
const updateCheckall = key => {
  if (state[key].checkall) {
    const max = exportGroupCheckbox[key].length;
    const arr = setNum(max);
    formValue[key] = arr;
    state[key].checkall = true;
    state[key].indeterminate = false;
  } else {
    if (key == 'studentInfo') {
      formValue[key] = [8];
      state[key].checkall = false;
      state[key].indeterminate = true;
    } else {
      formValue[key] = [];
      state[key].checkall = false;
      state[key].indeterminate = false;
    }
  }
};
const setNum = max => {
  return Array.from(Array(max), (v, k) => k + 1);
};
</script>

<style scoped></style>
