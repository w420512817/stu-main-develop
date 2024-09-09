<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-600px"
    title="重置密码"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :rules="rules"
        :model="formValue"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="密码:" path="newPassword">
          <n-input
            v-model:value="formValue.newPassword"
            type="password"
            show-password-on="mousedown"
            placeholder="请输入密码"
          />
        </n-form-item>
        <n-form-item label="重复密码:" path="confirmPassword">
          <n-input
            v-model:value="formValue.confirmPassword"
            type="password"
            show-password-on="mousedown"
            placeholder="请输入重复密码"
          />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, toRefs } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { REGEXP_PWD } from '@common/utils/form/regxp';
import { getConfirmPwdRule } from '@common/utils/form/rule';
import { UpdateAccountPassword } from '@/api/systemManage/account';
import { formRef } from './modal.data';

const emits = defineEmits(['onClose', 'onSuccess', 'register']);
const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  data && Object.assign(formValue, data);
});
const { getEncrypt } = useEncrypt();

const origin = {
  id: null,
  newPassword: '',
  confirmPassword: ''
};

const formValue = reactive(cloneDeep(origin));
const { newPassword } = toRefs(formValue);

const rules = {
  newPassword: [
    { required: true, message: '请输入', trigger: ['blur'] },
    { pattern: REGEXP_PWD, message: '支持8-20字符，且必须包含字母和数字', trigger: ['blur', 'input'] }
  ],
  confirmPassword: getConfirmPwdRule(newPassword)
};

const visibleChange = async visible => {
  await nextTick();
  !visible && reset();
};
function onSure() {
  validateItems().then(res => {
    if (res) {
      console.log('提交');
      onReset();
    }
  });
}
/**
 * 重置
 */
async function onReset() {
  let { id, newPassword } = formValue;
  changeLoading(true);
  changeOkLoading(true);

  try {
    newPassword = await getEncrypt(newPassword);
    const params = { userId: id, newPassword };
    await UpdateAccountPassword(params);
    window.$message.success('密码重置成功');
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
