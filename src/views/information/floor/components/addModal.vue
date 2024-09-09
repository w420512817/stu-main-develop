<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    :title="title"
    class="w-600px"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item
          label="所属教学楼:"
          path="buildingId"
          :rule="{ required: true, trigger: ['blur', 'change'], message: '请选择教学楼' }"
        >
          <dropdown-select
            ref="buildRef"
            v-model:value="formValue.buildingId"
            :list-api="buildingForClassSelectBox"
            filterable
            keyword="name"
            label-field="name"
            value-field="id"
            clearable
          />
        </n-form-item>
        <n-form-item
          label="名称:"
          path="name"
          :rule="{ required: true, trigger: ['blur', 'input'], message: '请输入名称' }"
        >
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
import { addFloor, editFloor, getFloorDetail } from '@/api/information/floor';
import { buildingForClassSelectBox } from '@/api/information';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(async data => {
  Object.assign(formValue, data);

  if (data.id) {
    const detail = await getFloorDetail({ id: data.id });
    detail && Object.assign(formValue, detail);
  }
  await nextTick();
  buildRef.value.getOptions(formValue.buildingName);
});

const origin = {
  buildingId: null,
  buildingName: null,
  name: null,
  key: null,
  id: null
};
const buildRef = ref();
const formRef = ref();
const formValue = reactive({ ...origin });

const title = computed(() => (formValue.key == AC_EDIT ? '编辑楼层' : '新增楼层'));

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
    const api = formValue.id ? editFloor : addFloor;
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
