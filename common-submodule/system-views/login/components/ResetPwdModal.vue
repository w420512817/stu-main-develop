<template>
  <basic-modal v-bind="$attrs" class="w-450px" :mask-closable="false" @register="register" @ok="handleSubmit">
    <n-form ref="formRef" :model="formData" :rules="rules" require-mark-placement="left" size="large">
      <n-form-item label="手机号码" path="phone">
        <n-input v-model:value="formData.phone" placeholder="请输入手机号码" />
      </n-form-item>
      <n-form-item label="手机验证码" path="code">
        <n-space>
          <n-input-number v-model:value="formData.code" :show-button="false" placeholder="请输入验证码" />
          <n-button :disabled="isCounting" @click="handleSmsCode">{{ label }}</n-button>
        </n-space>
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="formData.password" type="password" placeholder="请输入密码" />
      </n-form-item>
      <n-form-item label="请确认密码" path="confirmPwd">
        <n-input v-model:value="formData.confirmPwd" type="password" placeholder="确认密码" />
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, toRef } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { formRules, getConfirmPwdRule } from '@common/utils/form/rule';
import useSmsCode from '@common/hooks/business/useSmsCode';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { smsSend } from '@common/api/system/common';
import { forgetPwd, getPublicKey } from '@common/api/system/user';

const formRef = ref(null);

const { label, isCounting, getSmsCode } = useSmsCode(smsSend);
const { getEncrypt } = useEncrypt(getPublicKey);

const formData = reactive({
  phone: null,
  code: null,
  password: null,
  confirmPwd: null
});

const rules = {
  phone: formRules.phone,
  code: formRules.code,
  password: formRules.password,
  confirmPwd: getConfirmPwdRule(toRef(formData, 'password'))
};

const [register, { closeModal, changeOkLoading }] = useModalInner();

function handleSmsCode() {
  const params = {
    operateType: 1,
    phone: formData.phone,
    type: 20
  };
  getSmsCode(params);
}

function handleSubmit() {
  formRef.value.validate(async errors => {
    if (!errors) {
      try {
        changeOkLoading();
        const password = await getEncrypt(formData.password);
        const confirmPassword = await getEncrypt(formData.confirmPwd);

        const parmas = {
          phone: formData.phone,
          smsCode: formData.code,
          password,
          confirmPassword
        };

        await forgetPwd(parmas);
        window.$message.success('密码已重置成功！');
        closeModal();
      } finally {
        changeOkLoading(false);
      }
    }
  });
}
</script>
