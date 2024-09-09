<template>
  <basic-modal
    v-bind="$attrs"
    :title="title"
    class="w-400px"
    :mask-closable="false"
    @register="register"
    @visible-change="visibleChange"
    @ok="submit"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="passForm"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item label="密码" path="newPassword">
          <n-input
            v-model:value="passForm.newPassword"
            :input-props="{ autocomplete: 'new-password' }"
            type="password"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="重复密码" path="rePassword">
          <n-input v-model:value="passForm.rePassword" type="password" show-password-on="click" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, toRefs } from 'vue';

import { useModalInner } from '@common/components/custom/Modal';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';

import { REGEXP_PWD } from '@common/utils/form/regxp';
import { getConfirmPwdRule } from '@common/utils/form/rule';

import { UpdateAccountPassword } from '@/api/systemManage/account';

const title = ref('');

const [register, { changeOkLoading, closeModal }] = useModalInner(data => {
  init(data.row);
});
const formRef = ref(null);
const initForm = {
  newPassword: '',
  rePassword: ''
};
const passForm = reactive({ ...initForm });
const { newPassword } = toRefs(passForm);
const { getEncrypt } = useEncrypt();

const rules = {
  newPassword: [
    { required: true, message: '请输入', trigger: ['blur', 'change'] },
    {
      pattern: REGEXP_PWD,
      message: '密码应是包含8-20位数字和字母的组合',
      trigger: ['blur', 'change']
    }
  ],
  rePassword: getConfirmPwdRule(newPassword)
};
async function visibleChange(visible) {
  await nextTick();
  visible && resetForm();
}

function init({ account, id }) {
  title.value = `重置用户【${account}】密码`;
  Object.assign(passForm, { userId: id, account });
}

function resetForm() {
  Object.assign(passForm, initForm);
}

function submit() {
  formRef.value.validate(async err => {
    if (!err) {
      changeOkLoading(true);
      let { newPassword, userId } = passForm;
      newPassword = await getEncrypt(newPassword);
      try {
        await UpdateAccountPassword({ newPassword, userId });
        window.$message.success('重置成功');
        closeModal();
      } finally {
        changeOkLoading(false);
      }
    }
  });
}
</script>
