<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    title="导入教师数据"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item label="学校名称：">{{ formValue.orgName }}</n-form-item>
        <n-form-item label="教师类型：">
          <div>
            <n-radio-group v-model:value="formValue.type" name="radiogroup">
              <n-space>
                <n-radio v-for="item in belongAreaTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
            <p mt-4>
              <a v-if="formValue.type == 0" download href="./files/导入教师信息-内地(有身份证).xlsx" text-primary>
                下载内地（有身份证号）教师导入模板
              </a>
              <a v-if="formValue.type == 1" download href="./files/导入教师信息-内地(无身份证).xlsx" text-primary>
                下载内地（无身份证号）教师导入模板
              </a>
              <a v-if="formValue.type == 2" download href="./files/导入教师信息-非内地.xlsx" text-primary
                >下载非内地教师导入模板</a
              >
            </p>
          </div>
        </n-form-item>
        <n-form-item label="选择文件：" path="file">
          <n-upload
            ref="upload"
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
import { reactive, nextTick, ref, toRaw } from 'vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// api
import { importExcelData1, importExcelData2, importExcelData3 } from '@/api/information/teacher';
import { belongAreaTypeOptions } from '../../common.data';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});

const origin = {
  orgName: null,
  file: null,
  result: null,
  type: 0 // 0, 内地身份证 1,内地无身份证 2外地
};
const formRef = ref();
const formValue = reactive({ ...origin });

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  formRef.value.validate(error => {
    if (!error) {
      onUpload();
    }
  });
}

function reset() {
  Object.assign(formValue, origin);
  formRef.value?.restoreValidation();
}
async function onUpload() {
  changeLoading();
  try {
    let param = toRaw(formValue);
    param.file.name = 'file';
    const api = formValue.type == 0 ? importExcelData1 : formValue.type == 1 ? importExcelData2 : importExcelData3;
    const res = await api(param.file);
    if (!res) {
      return window.$message.error('上传失败');
    }
    if (res.data.success) {
      formValue.result = res.data?.data ?? {};
      emits('onSuccess', formValue);
      closeModal();
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
  let file = data.fileList[0];
  formValue.file = file;
}
</script>
