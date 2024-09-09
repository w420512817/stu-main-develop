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
import { reactive, nextTick, ref, toRef } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { REGEXP_PWD } from '@common/utils/form/regxp';
import { getConfirmPwdRule } from '@common/utils/form/rule';
import { UpdateAccountPassword } from '@common/api/system/user';

const emits = defineEmits(['onClose', 'onSuccess', 'register']);

const [register, { changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});
const { getEncrypt } = useEncrypt();
const formRef = ref(null);

const origin = {
  userId: null,
  newPassword: null,
  confirmPassword: null
};
const formValue = reactive({ ...origin });

const rules = {
  newPassword: [
    { required: true, message: '请输入', trigger: ['blur'] },
    { pattern: REGEXP_PWD, message: '支持8-20字符，且必须包含字母和数字', trigger: ['blur', 'input'] }
  ],
  confirmPassword: getConfirmPwdRule(toRef(formValue, 'newPassword'))
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
  changeOkLoading(true);

  try {
    const newPassword = await getEncrypt(formValue.newPassword);
    await UpdateAccountPassword({ userId: formValue.userId, newPassword });
    window.$message.success('密码重置成功，请重新登录');
    onPushSuccess();
  } finally {
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
