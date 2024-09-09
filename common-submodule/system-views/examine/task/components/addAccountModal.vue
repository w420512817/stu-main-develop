<template>
  <basic-modal
    v-bind="$attrs"
    title="新增筛查人员"
    class="w-600px"
    :mask-closable="false"
    @register="register"
    @ok="handleSubmit"
    @after-leave="visibleChange"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="95"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item label="姓名：" path="realName">
          <n-input v-model:value="state.realName" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="手机号：" path="phone">
          <n-input v-model:value="state.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="身份证号：" path="idCard">
          <n-input v-model:value="state.idCard" placeholder="请输入身份证号" />
        </n-form-item>
        <n-form-item label="用户名：" path="account">
          <n-input v-model:value="state.account" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="密码：" path="password">
          <n-input
            v-model:value="state.password"
            type="password"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
            placeholder="请输入密码"
          />
        </n-form-item>
        <n-form-item label="重复密码：" path="confirmPassword">
          <n-input
            v-model:value="state.confirmPassword"
            type="password"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
            placeholder="请输入重复密码"
          />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, toRefs } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useModalInner } from '@common/components/custom/Modal';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { useUserStore } from '@/store';

import { AddScreenerAccount } from '@common/api/examine/task';

import { rules as createRules } from './accountRules.data';

const emits = defineEmits(['onSuccess', 'register']);

const {
  userInfo: { orgId }
} = useUserStore();

const [register, { closeModal, changeLoading }] = useModalInner();

const formRef = ref(null);
const initForm = {
  orgId,
  account: '',
  idCard: '',
  phone: '',
  realName: '',
  password: '',
  confirmPassword: '',
  roleId: 0 // 后端要求固定的筛查员角色id,与实际id不一致，仅为了接口不会报错
};

const state = reactive(cloneDeep(initForm));
const { getEncrypt } = useEncrypt();

const stateRefs = toRefs(state);
const rules = createRules(stateRefs);

async function visibleChange() {
  await nextTick();
  resetForm();
}

function resetForm() {
  Object.assign(state, initForm);
}

function handleSubmit() {
  formRef.value.validate(async err => {
    if (!err) {
      changeLoading(true);
      let { password, confirmPassword } = state;

      console.log(state, 'state');
      [password, confirmPassword] = await Promise.all([getEncrypt(password), getEncrypt(confirmPassword)]);

      AddScreenerAccount({ ...state, password, confirmPassword })
        .then(_res => {
          closeModal();
          window.$message.success('筛查员账号新增成功');
          emits('onSuccess');
        })
        .finally(() => {
          changeLoading(false);
        });
    }
  });
}
</script>
