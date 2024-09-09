<template>
  <basic-modal
    v-bind="$attrs"
    :title="title"
    class="w-600px"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="120" require-mark-placement="left">
        <n-form-item label="教学楼名称:" path="name" :rule="{ required: true, message: '请输入教学楼名称' }">
          <n-input v-model:value="formValue.name" type="text" maxlength="100" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref, computed } from 'vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// static data
import { AC_EDIT } from '@common/enum/pageEnum';
// api
import { addBuilding, editBuilding } from '@/api/information/building';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});

const origin = {
  name: null,
  key: null,
  id: null
};
const formRef = ref();
const formValue = reactive({ ...origin });

const title = computed(() => (formValue.key == AC_EDIT ? '编辑教学楼' : '新增教学楼'));

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
    const api = formValue.id ? editBuilding : addBuilding;
    await api({ ...formValue });
    onPushSuccess();
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}

/**
 * 提交成功后
 */
function onPushSuccess() {
  closeModal();
  emits('onSuccess');
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
</script>
