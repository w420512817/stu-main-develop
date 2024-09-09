<template>
  <basic-modal
    v-bind="$attrs"
    class="w-100"
    @register="register"
    @ok="handleSubmit"
    @visible-change="handleVisibleChange"
  >
    <n-space>
      <n-form
        ref="formRef"
        :label-width="120"
        :model="formValue"
        :rules="formRules"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="复查机构" path="name">
          <span>{{ taskInfo.orgName }}</span>
        </n-form-item>

        <n-form-item label="复查人数比例" path="scale">
          <!-- <n-input-number v-model:value="formValue.scale" :show-button="false" placeholder="请输入复查人数比例">
            <template #suffix> % </template>
          </n-input-number> -->
          <n-select v-model:value="formValue.scale" :options="scaleList" placeholder="请选择复查人数比例" />
        </n-form-item>
        <n-form-item label="结束时间" path="endTime">
          <n-date-picker
            v-model:formatted-value="formValue.endTime"
            class="w-full"
            type="date"
            :is-date-disabled="disabledTomorrow"
            placeholder="请选择结束时间"
            :actions="null"
          />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';

import { useModalInner } from '@common/components/custom/Modal';

import { addReviewTask } from '@common/api/examine/task';

import { scaleList } from '../index.data';

const formRules = {
  // scale: [
  //   { required: true, message: '请输入复查人数比例', trigger: ['input', 'blur'], type: 'number' },
  //   { pattern: /^((\d|[1-9]\d)(?:\.\d{1,2})?|100)$/, message: '请正确输入复查人数比例', trigger: ['input', 'blur'] }
  // ],
  scale: { required: true, type: 'number', message: '请选择复查人数比例', trigger: ['input', 'change'] },
  endTime: { required: true, message: '请选择结束时间', trigger: ['input', 'change'] }
};

const originData = {
  scale: null,
  taskId: null,
  endTime: null
};

const formValue = reactive(cloneDeep(originData));
const formRef = ref(null);
const taskInfo = reactive({});

// emit
const emit = defineEmits(['onSuccess', 'register']);

const [register, { changeOkLoading, closeModal }] = useModalInner(data => {
  if (data) {
    Object.assign(taskInfo, data);
  }
});

const handleVisibleChange = async visible => {
  await nextTick();
  !visible && resetForm();
};

const resetForm = () => {
  Object.assign(formValue, originData);
};

const handleSubmit = e => {
  e.preventDefault();
  formRef.value.validate(async errors => {
    if (!errors) {
      changeOkLoading(true);
      try {
        // formValue.id = stuData.value?.map(item => item.id)?.join(',');
        formValue.taskId = taskInfo.id;
        // api 提交
        await addReviewTask(formValue);
        window.$message.success('创建成功');
        setTimeout(() => {
          emit('onSuccess');
          closeModal();
          changeOkLoading(false);
        }, 500);
      } catch {
        changeOkLoading(false);
      }
    }
  });
};
function disabledTomorrow(ts) {
  let disableTime = new Date();
  return dayjs(ts) <= dayjs(disableTime);
}
</script>

<style scoped></style>
