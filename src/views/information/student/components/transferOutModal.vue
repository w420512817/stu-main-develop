<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    title="转出学生"
    class="w-600px"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form ref="formRef" :model="formValue" label-placement="left" label-width="auto" require-mark-placement="left">
        <n-form-item label="转出学校:" path="">
          <dropdown-select
            ref="switchSchoolRef"
            v-model:value="formValue.switchSchoolId"
            :list-api="rollOutSchoolList"
            keyword="schoolName"
            label-field="name"
            value-field="id"
            filterable
            @update:value="updateSchool"
          />
        </n-form-item>
        <n-form-item label="转出学段:" path="">
          <n-select
            v-model:value="formValue.switchSchoolTypes"
            :options="collapseData"
            value-field="schoolTypesId"
            label-field="schoolTypes"
            placeholder="请选择学段"
            @update:value="updateSchoolTypes"
          />
        </n-form-item>
        <n-form-item label="转出年级班级:" path="">
          <n-select
            v-model:value="formValue.switchGradeId"
            mr-3
            :options="GradeOptions"
            placeholder="请选择转出年级"
            @update:value="updateGrade"
          />
          <n-select
            v-model:value="formValue.switchClassId"
            label-field="className"
            value-field="classId"
            placeholder="请选择转出班级"
            :options="ClassOptions"
          />
        </n-form-item>

        <n-form-item label="转出原因:" path="reason" :rule="{ required: true }">
          <n-select v-model:value="formValue.reason" :options="transferReasonOptions" />
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, ref } from 'vue';
// hooks
import { useModalInner } from '@common/components/custom/Modal';
// api
import { transferOut } from '@/api/information/student';
import { rollOutSchoolList } from '@/api/information';
import { transferReasonOptions } from '../../common.data';
import { schoolTypesGradeClassTree } from '@/api/information/school';

const emits = defineEmits(['onSuccess', 'register']);

const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  Object.assign(formValue, data);
  switchSchoolRef.value.getOptions();
});

const origin = {
  key: null,
  switchSchoolId: null,
  switchGradeId: null,
  switchClassId: null,
  switchSchoolTypes: null,
  reason: null,
  params: null
};
const formRef = ref();
const switchSchoolRef = ref();
const SchoolOption = ref([]);
const GradeOptions = ref([]);
const ClassOptions = ref([]);
const collapseData = ref([]);
const formValue = reactive({ ...origin });

const updateSchool = async () => {
  await nextTick();
  getCollapseData(formValue.switchSchoolId);

  ClassOptions.value = [];
  GradeOptions.value = [];

  formValue.switchSchoolTypes = null;
  formValue.switchClassId = null;
  formValue.switchGradeId = null;
};
const updateGrade = () => {
  const options = GradeOptions.value.find(d => d.value == formValue.switchGradeId)?.classList ?? [];
  ClassOptions.value = options;
  formValue.switchClassId = null;
};
const updateSchoolTypes = () => {
  const options = collapseData.value.find(d => d.schoolTypesId == formValue.switchSchoolTypes)?.gradeTree ?? [];
  GradeOptions.value = options.map(d => ({
    label: `${d.gradeName}(${d.studyYear})`,
    value: d.gradeId,
    classList: d.classList
  }));
  ClassOptions.value = [];
  formValue.switchClassId = null;
  formValue.switchGradeId = null;
};
const getCollapseData = async orgId => {
  const detail = await schoolTypesGradeClassTree({ orgId });
  if (detail) {
    collapseData.value = detail;
  }
};

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
    SchoolOption.value = switchSchoolRef.value.options;
    const { switchSchoolId, switchGradeId, switchClassId } = formValue;
    const switchSchoolName = switchSchoolId ? SchoolOption.value.find(d => d.id == switchSchoolId)?.name ?? null : null;
    const switchGradeName = switchGradeId
      ? GradeOptions.value.find(d => d.value == switchGradeId)?.label ?? null
      : null;
    const switchClassName = switchClassId
      ? ClassOptions.value.find(d => d.classId == switchClassId)?.className ?? null
      : null;
    await transferOut({
      ...formValue,
      ...formValue.params,
      switchType: 2, // 转换类型：1-转入，2-转出,0-其它
      switchSchoolName,
      switchGradeName,
      switchClassName
    });
    window.$message.success('操作成功');
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
