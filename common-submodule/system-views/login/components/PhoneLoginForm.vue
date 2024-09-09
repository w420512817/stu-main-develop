<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="phone">
      <n-input v-model:value="model.phone" placeholder="请输入帐号" />
    </n-form-item>

    <n-form-item path="code">
      <n-space>
        <n-input-number v-model:value="model.code" :show-button="false" placeholder="验证码" />
        <n-button :disabled="isCounting" @click="handleSmsCode">{{ label }}</n-button>
      </n-space>
    </n-form-item>

    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="keepLoading">保持登录</n-checkbox>
      </div>

      <n-button type="primary" size="large" :block="true" :loading="loading" @click="handleSubmit">登 录</n-button>
    </n-space>
  </n-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { formRules } from '@common/utils/form/rule';
import useLoading from '@common/hooks/useLoading';
import useSmsCode from '@common/hooks/business/useSmsCode';
import { useUserStore } from '@/store';
import { smsSend } from '@common/api/system/common';
import { onKeyStroke } from '@vueuse/core';

const { loading, startLoading, endLoading } = useLoading();
const { label, isCounting, getSmsCode } = useSmsCode(smsSend);

const formRef = ref(null);
const keepLoading = ref(true);
const userStore = useUserStore();

const model = reactive({
  phone: undefined,
  code: undefined
});

const rules = {
  phone: formRules.phone
  // code: formRules.code
};

onKeyStroke('Enter', handleSubmit);

function handleSubmit() {
  formRef.value.validate(async errors => {
    if (!errors) {
      startLoading();
      const { username, password } = model;
      try {
        await userStore.login({ username, password, keepLoading: keepLoading.value });
      } catch (error) {
        console.log(error);
      } finally {
        endLoading();
      }
    }
  });
}

function handleSmsCode() {
  getSmsCode({ smsOperateType: 1, phone: model.phone, type: 20 });
}
</script>
<style scoped></style>
