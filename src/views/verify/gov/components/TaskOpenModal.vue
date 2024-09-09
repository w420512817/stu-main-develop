<template>
  <basic-modal
    v-bind="$attrs"
    title="审核"
    class="w-600px"
    :show-bottom="!isDetail"
    :draggable="false"
    :ok-text="enumName[formData.key]"
    :ok-type="formData.key == AC_REJECT ? 'warning' : undefined"
    @register="register"
    @ok="handleConfirm"
    @after-leave="afterLeave"
  >
    <n-form label-placement="left" label-width="auto" label-align="right" require-mark-placement="left">
      <n-form-item label="选择任务：" path="planId">
        <span>{{ formData.taskName }}</span>
      </n-form-item>
      <n-form-item class="!w-350px" label="审核类型：">
        <span>{{ formData.approvedTypeName }}</span>
      </n-form-item>
      <n-form-item class="!w-300px" label="提交审核人：">
        {{ formData.applicantName }}
      </n-form-item>
      <n-form-item class="!w-300px" label="提交审核时间：">
        {{ formData.applyTime }}
      </n-form-item>
      <n-form-item v-if="+formData.approvedType === 2" label="修改班级：">
        <div class="max-h-300px overflow-auto">
          <div v-for="(item, i) in formData.gradeList" :key="item.gradeId" :class="{ 'mt-4': i !== 0 }">
            <div class="mb-2">{{ item.gradeName }}</div>
            <div class="pl-6">
              <div v-for="v in item.planClazz" :key="v.classId" class="mt-4 flex">
                <span flex-shrink-0>{{ v.className }}：</span>
                <n-space item-style="display: flex;">
                  <span v-for="subV in v.planStudents" :key="subV.studentId">{{ subV.studentName }}</span>
                </n-space>
              </div>
            </div>
            <!-- <div class="pl-6">
              <n-collapse v-for="v in item.planClazz" :key="v.classId" arrow-placement="right" class="mt-4">
                <n-collapse-item>
                  <template #header>
                    {{ v.className }}
                  </template>
                  <n-space item-style="display: flex;">
                    <span v-for="subV in v.planStudents" :key="subV.studentId">{{ subV.studentName }}</span>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
            </div> -->
          </div>
        </div>
      </n-form-item>
      <n-form-item label="提交审核原因：">
        <span>{{ formData.applyReason || '无' }}</span>
      </n-form-item>
      <n-form-item v-show="formData.auditorName" class="!w-300px" label="审核人：">
        {{ formData.auditorName }}
      </n-form-item>
      <n-form-item label="备注：">
        <n-input
          v-show="!isDetail"
          v-model:value="formData.remark"
          placeholder="请输入（非必填）"
          type="textarea"
          autosize
          maxlength="20"
          style="min-width: 100%"
        />
        <span v-show="isDetail">{{ formData.remark || '暂无' }}</span>
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { taskCheck } from '@/api/verify/verifyGov';
import { auditPlanStudent } from '@/api/verify';
import { useModalInner } from '@common/components/custom/Modal';
import { AC_DETAILS, AC_REJECT, AC_PASS } from '@common/enum/pageEnum';

const emit = defineEmits(['success', 'register']);
const [register, { changeLoading, closeModal }] = useModalInner(async data => {
  Object.assign(formData, data);
  if (!isDetail.value) {
    formData.remark = null;
  }

  if (+formData.approvedType === 2) {
    getAuditPlanStudent();
  }
});
const enumStatus = {
  [AC_DETAILS]: 1,
  [AC_PASS]: 2,
  [AC_REJECT]: 3,
  CANCEL_REJECT: 5,
  CANCEL_PASS: 4
};
const enumName = {
  [AC_DETAILS]: '确定',
  [AC_PASS]: '通过',
  [AC_REJECT]: '驳回',
  CANCEL_REJECT: '撤销驳回',
  CANCEL_PASS: '撤销通过'
};
const initForm = {
  remark: undefined
};
const formData = reactive({ ...initForm });
const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});

async function getAuditPlanStudent() {
  changeLoading();
  let res = await auditPlanStudent({ approvalId: formData.approvalId });
  formData.gradeList = res;
  changeLoading(false);
}

const handleConfirm = async () => {
  try {
    if (isDetail.value) {
      closeModal();
      return;
    }
    changeLoading(true);
    const approvalStatus = enumStatus[formData.key];
    await taskCheck({ approvalId: formData.approvalId, approvalStatus, remark: formData.remark });
    closeModal();
    emit('success');
    if (!isDetail.value) {
      window.$message.success('操作成功');
    }
  } finally {
    changeLoading(false);
  }
};

function afterLeave() {
  Object.assign(formData, initForm);
}
</script>
