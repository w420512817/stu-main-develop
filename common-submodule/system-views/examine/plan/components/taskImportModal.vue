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
      <n-form-item label="任务数据" path="file" show-require-mark require-mark-placement="left">
        <n-upload
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :max="1"
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
        <n-button text text-primary @click="downTemplate"> 下载导入模板 </n-button>
        <!-- <a download href="/files/学生名单-非内地学生导入模板.xlsx" text-primary></a> -->
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';
import { downloadFile } from '@common/utils/file/download';
import { importScreeningNumber } from '@common/api/examine/import';
import { planRegionExcel } from '@common/api/examine/export';

const emits = defineEmits(['addSuccess', 'register']);

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

const [register, { changeLoading, closeModal }] = useModalInner(data => {
  console.log(data, 'data');
  data && Object.assign(formValue, data);
  console.log(formValue, 'formValue');
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

function onSure() {
  if (!formValue.file) {
    return window.$message.error('请先上传文件');
  }
  emits('addSuccess', formValue.fileUrl);
  closeModal();
}
// 上传文件
async function handleUploadChange(data) {
  changeLoading();
  try {
    if (!data?.fileList?.length) {
      // 清空form的值
      formValue.fileUrl = [];
      formValue.file = null;
      return;
    }
    let file = cloneDeep(data.fileList[0]);

    file.name = 'file';
    formValue.file = file;
    const res = await importScreeningNumber(file);
    if (!res) {
      return window.$message.error('上传失败');
    }
    if (res.data.success) {
      formValue.fileUrl = res.data?.data ?? [];
    } else {
      window.$message.error(res.data.message);
    }
  } catch (e) {
    console.log(e, 'eee');
    window.$message.error('请检查文件并重新上传');
  } finally {
    changeLoading(false);
  }
}
// 下载模版
const downTemplate = async () => {
  changeLoading();
  try {
    let params = {
      regionList: formValue.areaRange.toString()
    };

    const res = await planRegionExcel(params);
    res && downloadFile(res.data, `任务数据导入模板`, 'xlsx');
  } catch (e) {
    window.$message.error('请重新下载');
  } finally {
    changeLoading(false);
  }
};
</script>
