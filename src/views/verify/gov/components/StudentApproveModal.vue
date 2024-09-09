<template>
  <basic-modal
    v-bind="$attrs"
    title="发起审核"
    class="w-600px"
    :ok-text="okTextObj.text"
    :ok-type="okTextObj.type"
    :mask-closable="false"
    :show-bottom="!isDetail"
    @ok="handleSubmit"
    @register="register"
    @after-leave="visibleChange"
  >
    <n-form
      ref="formRef"
      :model="formData"
      label-placement="left"
      label-width="120"
      label-align="right"
      require-mark-placement="left"
      :style="{ maxWidth: '600px' }"
    >
      <div>
        <div text-4 font-bold mb-2>学生信息</div>
        <div class="w-400px">
          <n-form-item label="学生姓名：">
            {{ formData.studentName || '/' }}
          </n-form-item>
          <n-form-item label="证件类型：">
            {{ formData.idCardTypeName || '/' }}
          </n-form-item>
          <n-form-item label="证件号：">
            {{ formData.idCard || '/' }}
          </n-form-item>
          <n-form-item label="提交审核人：">
            {{ formData.applicantName }}
          </n-form-item>
          <n-form-item label="提交审核时间：">
            {{ formData.createTime }}
          </n-form-item>
        </div>
        <n-form-item label="提交审核原因：" class="w-500px">
          {{ formData.remark }}
        </n-form-item>
      </div>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { studentEditCheck } from '@/api/verify/verifyGov';
import { AC_DETAILS, AC_PASS, AC_REJECT } from '@common/enum/pageEnum';

const emits = defineEmits(['success', 'register']);

const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  await nextTick();
  Object.assign(formData, data);
});

const formRef = ref(null);

const initForm = {
  studentAttendId: undefined,
  studentBaseId: undefined,
  originalSchoolId: undefined,
  originalClassId: undefined,
  switchSchoolId: undefined,
  switchClassId: undefined,
  reason: undefined,
  studentName: undefined,
  idCardType: undefined,
  idCard: undefined
};
const formData = reactive({ ...initForm });

const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});

const okTextObj = computed(() => {
  let btnInfo = {
    [AC_PASS]: { text: '通过', status: 2 },
    [AC_REJECT]: { text: '驳回', type: 'warning', status: 3 }
  };

  return btnInfo[formData.key] || {};
});

function visibleChange() {
  resetForm();
}

function resetForm() {
  Object.assign(formData, initForm);
}

async function handleSubmit() {
  changeLoading(true);
  changeOkLoading(true);
  try {
    const { id: approvalId } = formData;
    await studentEditCheck({
      approvalId,
      approvalStatus: okTextObj.value.status
    });
    window.$message.success('操作成功');
    emits('success');
    closeModal();
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
</script>
