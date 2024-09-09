<template>
  <basic-modal
    v-bind="$attrs"
    title="发起审核"
    class="w-600px"
    :mask-closable="false"
    :show-bottom="!isDetail"
    @ok="handleSubmit"
    @register="register"
    @after-leave="visibleChange"
  >
    <n-spin :show="serachLoading">
      <template #description> 学生查询中 </template>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '600px'
        }"
      >
        <div>
          <div text-4 font-bold mb-2>学生信息</div>
          <div class="w-400px">
            <n-form-item label="学生姓名：" path="studentName">
              <n-input
                v-if="isEdit"
                v-model:value="formData.studentName"
                maxlength="50"
                @input="formData.idCard = null"
                @blur="getStudentInfo"
              />
              <span v-else>{{ formData.studentName }}</span>
            </n-form-item>
            <n-form-item label="证件类型：" path="idCardType">
              <n-select
                v-if="isEdit"
                v-model:value="formData.idCardType"
                :options="idCardTypeOptions"
                @update:value="idCardTypeChange"
              />
              <span v-else>{{ formData.idCardTypeName }}</span>
            </n-form-item>
            <n-form-item v-if="formData.idCardType !== 0 && formData.idCardType" label="证件号：" path="idCard">
              <n-input
                v-if="isEdit"
                v-model:value="formData.idCard"
                :maxlength="formData.idCardType == 1 ? 18 : 19"
                @blur="idCardInput"
              />
              <span v-else>{{ formData.idCard }}</span>
            </n-form-item>
            <n-form-item label="提交审核人：">
              {{ isEdit && !isReset ? userInfo.realName : formData.applicantName }}
            </n-form-item>
            <n-form-item label="提交审核时间：">
              {{ isEdit && !isReset ? formatToDate() : formData.createTime }}
            </n-form-item>
          </div>
          <n-form-item label="提交审核原因：" class="w-500px">
            <n-input
              v-if="isEdit || isReset"
              v-model:value="formData.remark"
              maxlength="20"
              placeholder="请输入审核原因二十个字以内"
              show-count
              clearable
            />
            <span v-else>{{ formData.remark }}</span>
          </n-form-item>
        </div>
      </n-form>
    </n-spin>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';
import { searchStudent } from '@/api/verify/verifySchool';
import { studentEditApply, studentEditReset } from '@/api/verify/verifySchool';
import { idCardTypeOptions, rules } from '../index.data';
import { isIdcardRule } from '@common/utils/form/rule';
import { debounce } from 'lodash-es';
import { formatToDate } from '@common/utils/common/date';
import { AC_RESET, AC_ADD, AC_DETAILS } from '@common/enum/pageEnum';

const emits = defineEmits(['success', 'register']);

const { userInfo } = useUserStore();
const { fetch: searchStudentApi, loading: serachLoading } = useApi(searchStudent);
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
  idCard: undefined,
  remark: undefined,
  studentId: undefined
};
const formData = reactive({ ...initForm });
const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});
const isEdit = computed(() => {
  return formData.key === AC_ADD;
});
const isReset = computed(() => {
  return formData.key === AC_RESET;
});

const getStudentInfo = debounce(async () => {
  let { studentName = '', idCardType, idCard } = formData;
  if (studentName?.length < 2 || idCardType == undefined) return;
  echoInfo({ studentName, idCardType, idCard });
}, 300);

const idCardInput = debounce(_ => {
  if (isIdcardRule(formData.idCard)) {
    formData.idCardType = 1;
  }
  getStudentInfo();
}, 300);

function idCardTypeChange() {
  getStudentInfo();
}

async function echoInfo(params) {
  let [stuInfo] = await searchStudentApi(params);
  Object.assign(
    formData,
    stuInfo || { studentId: null, schoolTypesName: null, gradeName: null, className: null, idCard: null }
  );
}

function visibleChange() {
  resetForm();
}

function resetForm() {
  Object.assign(formData, initForm);
}

async function handleSubmit() {
  if (!formData.studentId) {
    window.$message.error('未查询到学生，请重新搜索后重试');
    return;
  }
  changeLoading(true);
  changeOkLoading(true);
  try {
    const { id: approvalId, studentId, remark } = formData;
    let studentEditApi = isReset.value ? studentEditReset : studentEditApply;
    await studentEditApi({
      approvalId,
      studentAttendId: studentId,
      remark
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
