<template>
  <basic-modal
    v-bind="$attrs"
    title="转学申请"
    class="w-600px"
    :mask-closable="false"
    :show-bottom="!isDetail || formData.key == AC_REJECT"
    :ok-type="formData.key == AC_REJECT ? 'warning' : undefined"
    :ok-text="formData.key == AC_REJECT ? '驳回' : '通过'"
    @ok="handleSubmit"
    @register="register"
    @after-leave="visibleChange"
  >
    <n-form
      ref="formRef"
      :model="formData"
      label-placement="left"
      label-width="90"
      label-align="right"
      require-mark-placement="left"
      :style="{
        maxWidth: '600px'
      }"
    >
      <div>
        <div text-4 font-bold mb-2>转出学生信息</div>
        <div class="w-400px">
          <n-form-item label="学生姓名：">
            {{ formData.studentName }}
          </n-form-item>
          <n-form-item label="证件号：">
            {{ formData.idCard || '暂无' }}
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="年级：" flex-1>
            {{ formData.originalGradeName }}
          </n-form-item>
          <n-form-item label="班级：" flex-1>
            {{ formData.originalClassName }}
          </n-form-item>
        </div>
      </div>
      <div>
        <div text-4 font-bold mb-2>转入学生信息</div>
        <div class="w-400px">
          <n-form-item label="转入学校:" path="switchSchoolId" :rule="{ required: !isDetail, message: '请选择' }">
            <dropdown-select
              v-if="!isDetail"
              ref="switchSchoolRef"
              v-model:value="formData.switchSchoolId"
              :list-api="rollOutSchoolList"
              keyword="schoolName"
              label-field="name"
              value-field="id"
              filterable
              @update:value="updateSchool"
            />
            <span v-else>{{ formData.switchSchoolName || '/' }}</span>
          </n-form-item>
          <n-form-item label="转入学段:">
            <n-select
              v-if="!isDetail"
              v-model:value="formData.switchSchoolTypes"
              :options="collapseData"
              :disabled="!formData.switchSchoolId"
              value-field="schoolTypesId"
              label-field="schoolTypes"
              placeholder="请选择学段"
              @update:value="updateSchoolTypes"
            />
            <span v-else>{{ formData.switchSchoolTypesName || '/' }}</span>
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="年级：" flex-1>
            <n-select
              v-if="!isDetail"
              v-model:value="formData.switchGradeId"
              :options="gradeOptions"
              placeholder="请选择转入年级"
              :disabled="!formData.switchSchoolTypes"
              @update:value="updateGrade"
            />
            <span v-else>{{ formData.switchGradeName || '/' }}</span>
          </n-form-item>
          <n-form-item label="班级：" flex-1>
            <n-select
              v-if="!isDetail"
              v-model:value="formData.switchClassId"
              label-field="className"
              value-field="classId"
              placeholder="请选择转入班级"
              :disabled="!formData.switchGradeId"
              :options="classOptions"
            />
            <span v-else>{{ formData.switchClassName || '/' }}</span>
          </n-form-item>
        </div>
      </div>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { rollOutSchoolList } from '@/api/information';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { setTransferSchool, transferCheck } from '@/api/verify/verifyGov';
import { AC_DETAILS, AC_PASS, AC_REJECT } from '@common/enum/pageEnum';

const emits = defineEmits(['success', 'register']);

const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  Object.assign(formData, data);
  await nextTick();
  switchSchoolRef.value?.getOptions();
  reviewAllSelect();
});

const switchSchoolRef = ref();
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
const schoolOption = ref([]);
const classOptions = ref([]);
const gradeOptions = ref([]);
const collapseData = ref([]);
const isDetail = computed(() => {
  return formData.key === AC_DETAILS || formData.key === AC_REJECT;
});

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

async function reviewAllSelect() {
  switchSchoolRef.value?.getOptions();
  await getCollapseData(formData.switchSchoolId);
  if (formData.switchGradeId) {
    let curSchoolTypes = collapseData.value.find(item => item.schoolTypesId == formData.switchSchoolTypes);
    gradeOptions.value = curSchoolTypes?.gradeTree.map(d => ({
      label: `${d.gradeName}(${d.studyYear})`,
      value: d.gradeId,
      classList: d.classList
    }));
    classOptions.value = gradeOptions.value.find(item => item.value == formData.switchGradeId)?.classList;
  }
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
  changeLoading(true);
  changeOkLoading(true);
  try {
    const { switchClassId, switchSchoolId, id, switchSchoolTypes, switchGradeId } = formData;
    if (formData.key == AC_PASS) {
      schoolOption.value = switchSchoolRef.value.options;
      let switchGradeName = gradeOptions.value.find(item => item.value == formData.switchGradeId)?.label;
      await setTransferSchool({
        switchSchoolTypes,
        switchGradeId,
        switchGradeName,
        classId: switchClassId,
        schoolId: switchSchoolId,
        approvalId: id
      });
    } else if (formData.key == AC_REJECT) {
      await transferCheck({ approvalId: id, approvalStatus: 3 });
    }
    window.$message.success('操作成功');
    emits('success');
    closeModal();
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
</script>
