<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    :title="title"
    :ok-text="okText"
    class="w-600px"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="托管日期:" path="">
          {{ formValue.dataRange }}
        </n-form-item>
        <n-form-item label="托管权限:" path="">
          <n-card v-if="formValue.trusteeshipType == 1" size="small" title="全平台托管">
            <p>托管业务平台中所有功能，等同于超级管理员！</p>
          </n-card>
          <n-card v-else size="small" title="业务托管">
            <p>托管业务平台中除“账号权限管理”外的所有功能。</p>
          </n-card>
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
import { AC_PASS } from '@common/enum/pageEnum';
// api updateTrusteeshipByIdAndStatus
import { updateTrusteeshipByIdAndStatus } from '@/api/trustee';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
});

const origin = {
  dataRange: null,
  id: null, // 申请id
  key: null,
  trusteeshipType: null,
  status: null // 通过 拒绝 状态：1-申请中，2-申请通过，3-申请驳回，4-申请关闭
};
const formRef = ref();
const formValue = reactive({ ...origin });

const title = computed(() => (formValue.key == AC_PASS ? '通过托管申请' : '驳回托管申请'));
const okText = computed(() => (formValue.key == AC_PASS ? '通过' : '驳回'));

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
    await updateTrusteeshipByIdAndStatus({ ...formValue });
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
