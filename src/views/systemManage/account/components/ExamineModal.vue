<template>
  <basic-modal
    v-bind="$attrs"
    title="审核"
    class="w-600px"
    :mask-closable="false"
    ok-text="审核通过"
    cancel-text="审核拒绝"
    @register="register"
    @visible-change="visibleChange"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="90"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item label="姓名:">
          {{ state.realName }}
        </n-form-item>
        <n-form-item label="用户名:">
          {{ state.account }}
        </n-form-item>
        <n-form-item label="身份证号:">
          {{ state.idCard }}
        </n-form-item>
        <n-form-item label="手机号:">
          {{ state.phone }}
        </n-form-item>
        <n-form-item label="拒绝原因:" path="refuseReason">
          <div w-full relative>
            <n-input v-model:value="state.refuseReason" type="textarea" placeholder="请输入" />
            <div color-red absolute>拒绝原因仅在审核拒绝时填写</div>
          </div>
        </n-form-item>
      </n-form>
    </n-space>
    <template #action>
      <n-space justify="end">
        <n-button @click="handleSubmit(1)">审核拒绝</n-button>
        <n-button type="primary" @click="handleSubmit(0)">审核通过</n-button>
      </n-space>
    </template>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { UserAudit } from '@/api/systemManage/account';

import { useModalInner } from '@common/components/custom/Modal';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { closeModal, changeLoading }] = useModalInner(async data => {
  await nextTick();
  Object.assign(state, data.row);
});

const formRef = ref(null);

const initForm = {
  refuseReason: ''
};
const state = reactive({ ...initForm });

const rules = {
  refuseReason: {
    trigger: ['change'],
    required: true,
    message: ' '
  }
};

async function visibleChange(visible) {
  await nextTick();
  visible && resetForm();
}

function resetForm() {
  Object.assign(state, initForm);
}

async function handleSubmit(isPass) {
  try {
    isPass && (await formRef.value.validate());
    changeLoading(true);
    const { id: userId, refuseReason } = state;
    await UserAudit({ userId, refuseReason, isPass });
    closeModal();
    emits('onSuccess');
  } finally {
    changeLoading(false);
  }
}
</script>
