<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-600px"
    title="新增下级学校"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item label="所属地区:" path="name">
          <area-cascader v-model:value="formValue.regionId" check-strategy="all" @update:val="updateSelectArea" />
        </n-form-item>
        <n-form-item label="学校:" path="lowerOrgId" :rule="{ required: true, message: '请选择学校', trigger: 'blur' }">
          <scroll-select
            ref="schoollRef"
            v-model:value="formValue.lowerOrgId"
            keyword="orgName"
            :init="false"
            :list-api="childSchoolSelectBoxList"
            :params="{
              regionId: formValue.regionId,
              orgProperty: formValue.orgProperty,
              regionType: formValue.regionType,
              orgId: formValue.id
            }"
            label-field="lowerOrgName"
            value-field="lowerOrgId"
          />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';
import { childSchoolSelectBoxList, addChildOrg } from '@/api/institution2';
import { formRef } from './modal.data';

const emits = defineEmits(['onSuccess', 'register']);
const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(async data => {
  data && Object.assign(formValue, data);
  await nextTick();
  schoollRef.value.getOptions('clear');
});

const origin = {
  orgId: null,
  regionId: null,
  regionType: null,
  orgProperty: null
};
const schoollRef = ref();
const formValue = reactive(cloneDeep(origin));

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  validateItems().then(res => {
    if (res) {
      console.log('提交');
      onModify();
    }
  });
}
const updateSelectArea = async option => {
  Object.assign(formValue, option);
  await nextTick();
  schoollRef.value.getOptions('clear');
  formValue.lowerOrgId = null;
};
/**
 * 添加
 */
async function onModify() {
  const { lowerOrgId, id } = formValue;
  changeLoading(true);
  changeOkLoading(true);

  try {
    const params = { lowerOrgId, id };
    await addChildOrg(params);
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
