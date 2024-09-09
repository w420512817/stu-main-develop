<template>
  <basic-modal
    v-bind="$attrs"
    title="任务开启申请"
    class="w-600px"
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
      label-width="130"
      label-align="right"
      require-mark-placement="left"
      :style="{
        maxWidth: '600px'
      }"
    >
      <div class="w-400px">
        <n-form-item label="任务类型：" flex-1>
          <span>任务撤回</span>
        </n-form-item>
        <n-form-item label="筛查类型：" flex-1>
          <n-select
            v-if="isEdit"
            v-model:value="appType"
            placeholder="全部"
            :options="appNameOpt"
            clearable
            @update:value="changeAppType"
          />
          <span v-else>{{ AppNameEnum[formData.appType] || '/' }}</span>
        </n-form-item>
        <n-form-item label="选择任务：" path="taskId" flex-1 :rule="{ required: isEdit, message: '请选择' }">
          <n-select
            v-if="isEdit"
            v-model:value="formData.taskId"
            :options="planList"
            label-field="taskName"
            value-field="taskId"
            placeholder="请选择"
            filterable
            @update:value="planChange"
          />
          <span v-else>{{ formData.taskName || '/' }}</span>
        </n-form-item>
      </div>
      <n-form-item label="提交审核人：">
        {{ isEdit && !isReset ? userInfo.realName : formData.applicantName }}
      </n-form-item>
      <n-form-item label="提交审核时间：">
        {{ isEdit && !isReset ? formatToDate() : formData.applyTime }}
      </n-form-item>
      <n-form-item label="提交审核原因：" class="w-500px">
        <n-input
          v-if="isEdit || isReset"
          v-model:value="formData.applyReason"
          maxlength="20"
          placeholder="请输入审核原因二十个字以内"
          show-count
          clearable
        />
        <span v-else>{{ formData.applyReason }}</span>
      </n-form-item>
      <n-form-item v-if="formData.remark" label="备注：" class="w-500px">
        <span>{{ formData.remark }}</span>
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import { taskApply, getCheckPlan, taskApplyEdit } from '@/api/verify/verifySchool';
import { AC_DETAILS, AC_ADD, AC_RESET } from '@common/enum/pageEnum';
import { formatToDate } from '@common/utils/common/date';
import { appNameOpt, AppNameEnum } from '../index.data.jsx';

const emits = defineEmits(['success', 'register']);

const { userInfo } = useUserStore();
const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  await nextTick();
  getPlanList();
  Object.assign(formData, data);
});

const formRef = ref(null);

const initForm = {
  appType: undefined,
  planId: undefined,
  taskId: undefined,
  approvalId: undefined,
  orgId: userInfo.orgId,
  approvedType: 1,
  screeningStudentData: undefined,
  applyReason: undefined,
  remark: undefined
};
let preAppType;
const appType = ref();
const formData = reactive({ ...initForm });
const planList = ref([]);
const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});
const isEdit = computed(() => {
  return formData.key === AC_ADD;
});
// 重新提交
const isReset = computed(() => {
  return formData.key === AC_RESET;
});

function changeAppType(v) {
  if (v == preAppType) return;
  formData.taskId = null;
  getPlanList();
  preAppType = v;
}

async function getPlanList() {
  let res = await getCheckPlan({ taskStatus: 2, appType: appType.value });
  planList.value = res || [];
}

async function planChange(v, opt) {
  formData.appType = opt?.appType;
  formData.planId = opt?.planId;
}

async function visibleChange() {
  resetForm();
}

function resetForm() {
  appType.value = undefined;
  Object.assign(formData, initForm);
}

async function handleSubmit() {
  await formRef.value.validate();
  changeLoading(true);
  changeOkLoading(true);
  try {
    let { planId, orgId, appType, applyReason, approvalId, approvedType, taskId } = formData;
    const taakApplyApi = isReset.value ? taskApplyEdit : taskApply;
    await taakApplyApi({ planId, orgId, appType, applyReason, approvalId, approvedType, taskId });
    emits('success');
    closeModal();
    window.$message.success('操作成功');
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
</script>
