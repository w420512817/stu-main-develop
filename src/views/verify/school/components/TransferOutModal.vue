<template>
  <basic-modal
    v-bind="$attrs"
    title="转学申请"
    class="w-600px"
    :mask-closable="false"
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
        label-width="100"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '600px'
        }"
      >
        <div>
          <div text-4 font-bold mb-2>转出学生信息</div>
          <div class="w-400px">
            <n-form-item label="学生姓名：" path="studentName">
              <n-input
                v-model:value="formData.studentName"
                maxlength="50"
                @input="formData.idCard = null"
                @blur="getStudentInfo"
              />
            </n-form-item>
            <n-form-item label="证件类型：" path="idCardType">
              <n-select
                v-model:value="formData.idCardType"
                :options="idCardTypeOptions"
                @update:value="idCardTypeChange"
              />
            </n-form-item>
            <n-form-item v-if="formData.idCardType !== 0 && formData.idCardType" label="证件号：" path="idCard">
              <n-input
                v-model:value="formData.idCard"
                :maxlength="formData.idCardType == 1 ? 18 : 19"
                @blur="idCardInput"
              />
            </n-form-item>
            <n-form-item label="学段：">
              <n-input v-model:value="formData.schoolTypesName" readonly />
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="年级：" flex-1>
              <n-input v-model:value="formData.gradeName" readonly />
            </n-form-item>
            <n-form-item label="班级：" flex-1>
              <n-input v-model:value="formData.className" readonly />
            </n-form-item>
          </div>
          <n-form-item
            label="转出原因:"
            path="reason"
            :rule="{ required: true, message: '请选择转出原因', trigger: ['blur', 'input'], type: 'number' }"
          >
            <n-select v-model:value="formData.reason" :options="transferReasonOptions" />
          </n-form-item>
        </div>
        <div>
          <div text-4 font-bold mb-2>转入学生信息</div>
          <div class="w-400px">
            <n-form-item label="转入学校:" path="">
              <dropdown-select
                ref="switchSchoolRef"
                v-model:value="formData.switchSchoolId"
                :list-api="rollOutSchoolList"
                keyword="schoolName"
                label-field="name"
                value-field="id"
                filterable
                @update:value="updateSchool"
              />
            </n-form-item>
            <n-form-item label="转入学段:" path="">
              <n-select
                v-model:value="formData.switchSchoolTypes"
                :options="collapseData"
                value-field="schoolTypesId"
                label-field="schoolTypes"
                placeholder="请选择学段"
                @update:value="updateSchoolTypes"
              />
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="年级：" flex-1>
              <n-select
                v-model:value="formData.switchGradeId"
                :options="gradeOptions"
                placeholder="请选择转入年级"
                @update:value="updateGrade"
              />
            </n-form-item>
            <n-form-item label="班级：" flex-1>
              <n-select
                v-model:value="formData.switchClassId"
                label-field="className"
                value-field="classId"
                placeholder="请选择转入班级"
                :options="classOptions"
              />
            </n-form-item>
          </div>
        </div>
      </n-form>
    </n-spin>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { searchStudent } from '@/api/verify/verifySchool';
import { rollOutSchoolList } from '@/api/information';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { transferOut } from '@/api/verify/verifySchool';
import { idCardTypeOptions, transferReasonOptions, rules } from '../index.data';
import { isIdcardRule } from '@common/utils/form/rule';
import { debounce } from 'lodash-es';

const emits = defineEmits(['success', 'register']);

const { fetch: searchStudentApi, loading: serachLoading } = useApi(searchStudent);
const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  Object.assign(formData, data.row);
  await nextTick();
  switchSchoolRef.value.getOptions();
});

const switchSchoolRef = ref();
const formRef = ref(null);

const initForm = {
  studentId: undefined,
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
  schoolTypesName: undefined,
  gradeName: undefined,
  className: undefined,
  switchSchoolTypes: undefined,
  switchGradeId: undefined
};
const formData = reactive({ ...initForm });
const schoolOption = ref([]);
const classOptions = ref([]);
const gradeOptions = ref([]);
const collapseData = ref([]);
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
  Object.assign(formData, {
    idCard: null,
    schoolTypesName: null,
    gradeName: null,
    className: null,
    studentId: null
  });
  getStudentInfo();
}

async function echoInfo(params) {
  let [stuInfo] = await searchStudentApi(params);
  Object.assign(
    formData,
    stuInfo || { studentId: null, schoolTypesName: null, gradeName: null, className: null, idCard: null }
  );
}

async function updateSchool() {
  await nextTick();
  getCollapseData(formData.switchSchoolId);

  classOptions.value = [];
  gradeOptions.value = [];

  formData.switchSchoolTypes = null;
  formData.switchClassId = null;
  formData.switchGradeId = null;
}

async function getCollapseData(orgId) {
  const detail = await schoolTypesGradeClassTree({ orgId });
  collapseData.value = detail || [];
}

function updateSchoolTypes() {
  const options = collapseData.value.find(d => d.schoolTypesId == formData.switchSchoolTypes)?.gradeTree ?? [];
  gradeOptions.value = options.map(d => ({
    label: `${d.gradeName}(${d.studyYear})`,
    value: d.gradeId,
    classList: d.classList
  }));
  classOptions.value = [];
  formData.switchClassId = null;
  formData.switchGradeId = null;
}

function updateGrade() {
  const options = gradeOptions.value.find(d => d.value == formData.switchGradeId)?.classList ?? [];
  classOptions.value = options;
  formData.switchClassId = null;
}

async function visibleChange() {
  await nextTick();
  resetForm();
}

function resetForm() {
  Object.assign(formData, initForm);
}

async function handleSubmit() {
  await formRef.value.validate();

  if (!formData.studentId) {
    window.$message.error('未查询到学生，请重新搜索后重试');
    return;
  }
  changeLoading(true);
  changeOkLoading(true);
  try {
    schoolOption.value = switchSchoolRef.value.options;
    const { classId, studentId, schoolId, switchSchoolTypes, switchGradeId } = formData;
    let switchGradeName = gradeOptions.value.find(item => item.value == formData.switchGradeId)?.label;
    await transferOut({
      ...formData,
      originalSchoolId: schoolId,
      originalClassId: classId,
      studentAttendId: studentId,
      switchSchoolTypes,
      switchGradeId,
      switchGradeName,
      switchType: 2 // 转换类型：1-转入，2-转出,0-其它
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
