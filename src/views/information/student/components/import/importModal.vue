<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-600px"
    :title="title"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="left"
      >
        <n-form-item label="学校名称：">{{ formValue.orgName }}</n-form-item>
        <n-form-item label="学段：" path="schoolType">
          <n-radio-group v-model:value="formValue.schoolType" name="radiogroup">
            <n-space>
              <n-radio v-for="item in formValue.collapseData" :key="item.key" :value="item.key">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="学生类型：">
          <div>
            <n-radio-group v-model:value="formValue.tabType" name="radiogroup">
              <n-space>
                <n-radio v-for="item in belongAreaTypeOptions" :key="item.stuValue" :value="item.stuValue">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
            <p mt-4>
              <a
                v-if="formValue.tabType == 8"
                download
                href="./files/学生名单-内地(有身份证)学生导入模板.xlsx"
                text-primary
              >
                下载内地（有身份证号）学生导入模板
              </a>
              <a
                v-if="formValue.tabType == 9"
                download
                href="./files/学生名单-内地(无身份证)学生导入模板.xlsx"
                text-primary
              >
                下载内地（无身份证号）学生导入模板
              </a>
              <a v-if="formValue.tabType == 10" download href="./files/学生名单-非内地学生导入模板.xlsx" text-primary
                >下载非内地学生导入模板</a
              >
            </p>
          </div>
        </n-form-item>
        <n-form-item label="选择文件：" path="file">
          <n-upload
            :max="1"
            directory-dnd
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref, toRaw, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// api
import { submitTask, uploadFile } from '@/api/information/student';

import { belongAreaTypeOptions } from '../../../common.data';

import { useStudentStore } from '@/store';

const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});
const studentStore = useStudentStore();

const origin = {
  schoolType: null,
  tabType: 8,
  type: 8,
  schoolName: null,
  collapseData: [],
  file: null,
  fileUrl: null,
  isDivideClass: false // 是否分班
};
const rules = {
  schoolType: { required: true, trigger: ['change', 'blur'], message: '请选择学段', type: 'number' },
  file: { required: true, trigger: ['change', 'blur'], message: '请选择文件', type: 'object' }
};
const formRef = ref();
const formValue = reactive({ ...origin });
const title = computed(() => {
  return formValue.isDivideClass ? '导入分班学生数据' : '导入学生数据';
});

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  validateItems().then(res => {
    if (res) {
      onModify();
    }
  });
}
/**
 * 添加、编辑
 */
async function onModify() {
  changeLoading(true);
  changeOkLoading(true);
  try {
    const { fileUrl, schoolType, type, isDivideClass, schoolId, schoolName } = toRaw(formValue);
    const params = { fileUrl, schoolType, type, isDivideClass, schoolId, schoolName };
    const taskId = await submitTask(params);
    onPushSuccess(taskId);
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
  studentStore.setParams({ taskId });
  studentStore.startTimer();
  studentStore.updateImportResult({}); // 清除原有导入结果
  studentStore.openResultModal();
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

function reset() {
  Object.assign(formValue, origin);
  formRef.value?.restoreValidation();
}
async function onUpload() {
  changeLoading();
  try {
    formValue.file.name = 'file';
    const res = await uploadFile(formValue.file);
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

function handleUploadChange(data) {
  if (data.fileList.length) {
    let file = data.fileList[0];
    formValue.file = cloneDeep(file);
    onUpload();
  } else {
    formValue.file = null;
  }
}
</script>
