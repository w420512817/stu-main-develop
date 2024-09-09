<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    :mask-closable="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="学校名称：">{{ formValue.taskOrgName }}</n-form-item>
      <n-form-item label="所属计划：">{{ formValue.planName || '/' }}</n-form-item>
      <n-form-item label="任务名称：">{{ formValue.taskName }}</n-form-item>
      <n-form-item label="筛查数据" path="file" show-require-mark require-mark-placement="left">
        <n-upload
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          max="1"
          directory-dnd
          @change="handleUploadChange"
        >
          <n-upload-dragger>
            <div mb-3>
              <icon-et:upload text-16 text-primary />
            </div>
            <n-text text-4> 点击或者拖动文件到该区域来上传 </n-text>
            <n-p depth="3"> 支持上传.xlsx、.xls格式的表格文件 </n-p>
          </n-upload-dragger>
        </n-upload>
      </n-form-item>
      <n-form-item label=" ">
        <n-button text text-primary @click="downTemplate"> 下载学生筛查数据导入模板 </n-button>
        <!-- <a download href="./files/学生名单-非内地学生导入模板.xlsx" text-primary></a> -->
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, toRaw, nextTick, ref } from 'vue';
import { object } from 'vue-types';
import { cloneDeep } from 'lodash-es';

import { useScreenStore, useApplicationStore } from '@/store';
import { useModalInner } from '@common/components/custom/Modal';

import { downloadByUrl } from '@common/utils/file/download';
import { importScreenExcel, submitImportTask } from '@common/api/examine/import';
import { AppTypeEnum } from '@common/enum/pageEnum';

defineProps({
  userData: object().def({})
});

const rules = {
  file: { required: true, trigger: ['change', 'blur'], message: '请选择文件' }
};
const origin = {
  taskId: null,
  taskName: null,
  planName: null,
  taskOrgName: null,
  file: null,
  type: null
};
const formValue = reactive(cloneDeep(origin));
const screenStore = useScreenStore();
const { appType } = useApplicationStore();

// / setProps, closeModal,
const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  data && Object.assign(formValue, data);
});

const formRef = ref(null);

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function reset() {
  Object.assign(formValue, origin);
  formRef.value?.restoreValidation();
}

async function onSure() {
  changeLoading(true);
  changeOkLoading(true);
  try {
    if (!formValue.file) {
      return window.$message.error('请先上传文件');
    }
    const { fileUrl, taskId, type } = toRaw(formValue);
    const params = { fileUrl, taskId, type };
    const importTaskId = await submitImportTask(params);
    onPushSuccess(importTaskId);
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
/**
 * 提交成功后
 */
function onPushSuccess(taskId) {
  closeModal();
  screenStore.setParams({ taskId });
  screenStore.startTimer();
  screenStore.openResultModal();
}

async function handleUploadChange(data) {
  changeLoading();
  try {
    let file = cloneDeep(data.fileList[0]);
    file.name = 'file';
    formValue.file = file;
    const res = await importScreenExcel(file);
    if (!res) {
      return window.$message.error('上传失败');
    }
    if (res.data.success) {
      formValue.fileUrl = res.data?.data ?? {};
      const { tabType } = formValue;
      formValue.type = tabType;
    } else {
      window.$message.error(res.data.message);
    }
  } catch (e) {
    window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}
const downTemplate = async () => {
  changeLoading();
  const { BASE_URL } = import.meta.env;
  const Interface = {
    [AppTypeEnum.VISION]: `./files/vision_screen_template.xlsx`,
    [AppTypeEnum.CARIES]: `${BASE_URL}/files/caries_screen_template.xlsx`,
    [AppTypeEnum.CHECKUP]: `${BASE_URL}/files/checkup_screen_template.xlsx`,
    [AppTypeEnum.PHYSICAL]: `${BASE_URL}/files/physical_screen_template.xlsx`,
    [AppTypeEnum.SPINE]: `${BASE_URL}/files/spine_screen_template.xlsx`
  };
  try {
    const { taskOrgName, taskName } = toRaw(formValue);
    // const res = await exportScreenTemplate({ taskId });
    // res && downloadFile(res.data, `${taskOrgName}-${taskName}-学生筛查数据导入模板`, 'xlsx');
    downloadByUrl({
      url: Interface[appType],
      fileName: `${taskOrgName}-${taskName}-学生筛查数据导入模板`,
      suffix: 'xlsx'
    });
  } catch (e) {
    window.$message.error('请重新下载');
  } finally {
    changeLoading(false);
  }
};
</script>
