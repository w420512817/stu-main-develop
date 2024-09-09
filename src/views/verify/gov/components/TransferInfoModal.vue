<template>
  <basic-modal
    v-bind="$attrs"
    title="转学申请"
    class="w-600px"
    :show-bottom="!isDetail"
    :ok-type="formData.key == AC_REJECT ? 'warning' : undefined"
    :ok-text="formData.key == AC_REJECT ? '驳回' : '通过'"
    @ok="setTransferCheck"
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
        <n-form-item label="转出原因:">
          {{ formData.reasonName }}
        </n-form-item>
      </div>
      <div>
        <div text-4 font-bold mb-2>转入学生信息</div>
        <div class="w-400px">
          <n-form-item label="转入学校:">
            <dropdown-select
              v-if="!isDetail && isPass"
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
              v-if="isPass"
              v-model:value="formData.switchSchoolTypes"
              value-field="schoolTypesId"
              label-field="schoolTypes"
              :options="schoolTypesOptions"
              @update:value="updateSchoolTypes"
            />
            <span v-else>{{ formData.switchSchoolTypesName || '/' }}</span>
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="年级：" flex-1>
            <n-select
              v-if="isPass"
              v-model:value="formData.switchGradeId"
              :options="gradeOptions"
              @update:value="updateGrade"
            />
            <span v-else>{{ formData.switchGradeName || '/' }}</span>
          </n-form-item>
          <n-form-item label="班级：" flex-1>
            <n-select
              v-if="isPass"
              v-model:value="formData.switchClassId"
              label-field="className"
              value-field="classId"
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
import { transferCheck, setTransferSchool } from '@/api/verify/verifyGov';
import { rollOutSchoolList } from '@/api/information';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { AC_DETAILS, AC_REJECT, AC_PASS } from '@common/enum/pageEnum';

const emits = defineEmits(['success', 'register']);

const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  Object.assign(formData, data);
  await nextTick();
  if (isPass.value) {
    reviewAllSelect();
  }
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
const switchSchoolRef = ref();
const schoolTypesOptions = ref([]);
const gradeOptions = ref([]);
const classOptions = ref([]);
const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});

const isPass = computed(() => {
  return formData.key === AC_PASS;
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

function updateSchoolTypes() {
  const options = schoolTypesOptions.value.find(d => d.schoolTypesId == formData.switchSchoolTypes)?.gradeTree ?? [];
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

async function getCollapseData(orgId) {
  const detail = await schoolTypesGradeClassTree({ orgId });
  schoolTypesOptions.value = detail || [];
}

async function reviewAllSelect() {
  switchSchoolRef.value?.getOptions();
  await getCollapseData(formData.switchSchoolId);
  if (formData.switchGradeId) {
    let curSchoolTypes = schoolTypesOptions.value.find(item => item.schoolTypesId == formData.switchSchoolTypes);
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

/**
 * @param {number} approvalStatus 1-审核中(点击查看时传递的状态) 2-通过，3-驳回 4-撤销通过 5-撤销驳回
 */
async function setTransferCheck() {
  try {
    changeLoading(true);
    changeOkLoading(true);
    let approvalStatusEnum = {
      [AC_REJECT]: 3,
      [AC_PASS]: 2
    };
    if (formData.key == AC_REJECT) {
      await transferCheck({ approvalStatus: approvalStatusEnum[formData.key], approvalId: formData.id });
    } else if (formData.key == AC_PASS) {
      const { switchClassId, switchSchoolId, id, switchSchoolTypes, switchGradeId } = formData;
      let switchGradeName = gradeOptions.value.find(item => item.value == formData.switchGradeId)?.label;
      await setTransferSchool({
        switchSchoolTypes,
        switchGradeId,
        switchGradeName,
        classId: switchClassId,
        schoolId: switchSchoolId,
        approvalId: id
      });
    }

    window.$message.success('操作成功');
    closeModal();
    emits('success');
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
</script>
