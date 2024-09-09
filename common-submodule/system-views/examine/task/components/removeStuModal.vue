<template>
  <basic-modal
    v-bind="$attrs"
    class="w-600px"
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
        <n-form-item label="学生姓名" path="name">
          <span>{{ stuName }}</span>
        </n-form-item>

        <n-form-item label="不可筛查原因" path="notStatus">
          <n-select
            v-model:value="formValue.notStatus"
            class="w-95"
            clearable
            :options="notStatusList"
            placeholder="请选择不可筛查原因"
          />
        </n-form-item>
        <n-form-item label="备注">
          <n-input v-model:value="formValue.remark" type="textarea" :maxlength="50" placeholder="请输入备注" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from 'vue';
import { cloneDeep } from 'lodash-es';

import { useModalInner } from '@common/components/custom/Modal';

import { notStatusList } from '../index.data.jsx';

import { removeStuData } from '@common/api/examine/task';

const formRules = {
  notStatus: { required: true, message: '请选择不可筛查原因', trigger: 'change', type: 'number' }
};

const originData = {
  notStatus: null,
  remark: null,
  id: null
};

const formValue = reactive(cloneDeep(originData));
const formRef = ref(null);
const stuData = ref([]);

const stuName = computed(() => {
  let len = stuData.value.length;
  let str = len > 4 ? `当前已选择 ${len} 个学生` : stuData.value?.map(item => item.studentName)?.join(',');
  return str;
});

// emit
const emit = defineEmits(['onSuccess', 'register']);

const [register, { changeOkLoading, closeModal }] = useModalInner(data => {
  data && onDataReceive(data);
});
function onDataReceive({ list }) {
  stuData.value = list;
}
const handleVisibleChange = async visible => {
  await nextTick();
  visible && resetForm();
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
        formValue.id = stuData.value?.map(item => item.id)?.join(',');
        // api 提交
        await removeStuData(formValue);
        window.$message.success('移除成功');
        emit('onSuccess');
        closeModal();
      } finally {
        changeOkLoading(false);
      }
    }
  });
};
</script>

<style scoped></style>
