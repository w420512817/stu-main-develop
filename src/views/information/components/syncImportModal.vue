<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
    :title="importObj.modalTitle"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item label="模板：">
          <a download :href="importObj.tempUrl" text-primary>下载模板</a>
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
import { useRoute } from 'vue-router';
import { importData } from './syncImport.data';

const props = defineProps({
  type: String
});
const importObj = reactive({ ...importData[props.type] });
const { query } = useRoute();
const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, closeModal }] = useModalInner();

const origin = {
  file: null,
  result: null
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
    if (query.schoolId) {
      param.file.data = {};
      param.file.data.schoolId = query.schoolId;
    }
    console.log(param, 'param888zzz');
    const res = await importObj.importApi(param.file);
    if (!res) {
      return window.$message.error('上传失败');
    }
    if (res.data.success) {
      formValue.result = res.data?.data ?? {};
      emits('onSuccess', formValue.result);
      closeModal();
    } else {
      window.$message.error(res.data.message);
    }
  } catch (e) {
    // window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}

function handleUploadChange(data) {
  let file = data.fileList[0];
  formValue.file = file;
}
</script>
