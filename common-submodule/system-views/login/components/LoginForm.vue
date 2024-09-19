<template>
  <n-alert v-if="errorMsg" type="error" class="mb-4" closable> {{ errorMsg }} </n-alert>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keypress.enter="handleSubmit">
    <n-form-item path="account">
      <n-input
        :value="model.account"
        autofocus
        :input-props="{ autocomplete: 'username' }"
        placeholder="请输入用户名/手机号"
        @update:value="val => (model.account = val.trim())"
      >
        <template #prefix>
          <icon-charm:person text-5 class="prefix-icon" />
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="password">
      <n-input
        v-model:value="model.password"
        :input-props="{ autocomplete: 'current-password' }"
        type="password"
        show-password-on="click"
        placeholder="请输入密码"
      >
        <template #prefix>
          <icon-material-symbols:lock-outline text-5 class="prefix-icon" />
        </template>
      </n-input>
    </n-form-item>

    <!-- <n-form-item path="code">
      <n-space align="center" justify="space-between" inline>
        <n-input-number v-model:value="model.code" :show-button="false" placeholder="请输入验证码">
          <template #prefix>
            <icon-material-symbols:mail-outline-rounded text-5 class="prefix-icon" />
          </template>
        </n-input-number>
        <img :src="captchaRef.image" alt="点击刷新" @click="getCode" />
      </n-space>
    </n-form-item> -->

    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox :checked="keepLoading" @update:checked="handleKeepLoading">保持登录状态</n-checkbox>
        <n-space>
          <n-button text type="primary" @click="openModalPwd()">忘记密码?</n-button>
        </n-space>
      </div>

      <n-button type="primary" size="large" :block="true" :loading="loading" @click="handleSubmit">登 录</n-button>
    </n-space>
  </n-form>

  <ResetPwdModal title="忘记密码" @register="registerPwd" />
  <UpdatePasswd @register="registerReset" @on-success="updateSuccess" @cancel="updateSuccess" />
</template>

<script setup>
import { reactive, ref, unref } from 'vue';
import { formRules } from '@common/utils/form/rule';
import useLoading from '@common/hooks/useLoading';
import { useModal } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import { getCaptchaCode } from '@common/api/system/user';
import { useThrottleFn } from '@vueuse/core';
import ResetPwdModal from './ResetPwdModal.vue';
import UpdatePasswd from './UpdatePasswd.vue';
import { KEEP_LOADING_KEY } from '@common/enum/cacheEnum';
import { getUserInfo } from '@common/api/system/user';
import { setToken } from '@common/utils/auth';

const [registerPwd, { openModal: openModalPwd }] = useModal();
const [registerReset, { openModal: openModalReset }] = useModal();
const { loading, startLoading, endLoading } = useLoading();

// consonsle
const formRef = ref(null);
const captchaRef = ref({});
const errorMsg = ref('');
const userStore = useUserStore();

const localKeep = localStorage.getItem(KEEP_LOADING_KEY) === 'true' ? true : false;
const keepLoading = ref(localKeep);

const model = reactive({
  account: '',
  password: '',
  code: undefined
});

const rules = {
  account: formRules.account,
  password: formRules.password,
  code: formRules.code
};

function validate() {
  formRef.value.validate(async errors => {
    if (!errors) {
      startLoading();
      const { account, password, code } = model;
      try {
        // const pwd = await getEncrypt(password);
        const data = await userStore.login({
          account,
          password,
          // password: pwd,
          captchaCode: code,
          captchaKey: unref(captchaRef).key
        });

        if (!data?.needResetPassWord) return;

        const user = await getUserInfo();

        openModalReset(true, { userId: user.id });

        errorMsg.value = '';
      } catch (error) {
        getCode();
        errorMsg.value = error?.message || '';
      } finally {
        endLoading();
      }
    }
  });
}

function updateSuccess() {
  setToken('');
  getCode();
}

const handleSubmit = useThrottleFn(() => {
  validate();
}, 1000);

function handleKeepLoading(val) {
  keepLoading.value = val;
  localStorage.setItem(KEEP_LOADING_KEY, val);
}

const getCode = useThrottleFn(() => {
  getCaptchaCode().then(info => {
    captchaRef.value = info;
  });
}, 800);

getCode();
</script>
<style scoped>
.prefix-icon {
  color: var(--n-icon-color);
}
:deep(.n-alert__icon) {
  height: 100%;
  margin: 0;
  margin-left: 12px;
}

:deep(.n-alert-body) {
  padding: 8px;
}
</style>
