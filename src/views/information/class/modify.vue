<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="addClassRule"
    label-placement="left"
    require-mark-placement="left"
    label-width="100"
  >
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">基本信息</p>
      </template>
      <n-grid cols="3" :x-gap="50">
        <n-form-item-gi label="学段:" path="schoolType">
          <n-select
            v-model:value="formValue.schoolType"
            :options="collapseData"
            value-field="schoolTypesId"
            label-field="schoolTypes"
            placeholder="请选择学段"
            @update:value="updateSchoolTypes"
          />
        </n-form-item-gi>
        <n-form-item-gi label="学年:" path="gradeId">
          <n-select
            v-model:value="formValue.gradeId"
            :options="gradeOptions"
            placeholder="请选择学年"
            @update:value="updateStudyYear"
          />
        </n-form-item-gi>
        <n-form-item-gi label="班主任:">
          <dropdown-select
            ref="teacherRef"
            v-model:value="formValue.teacherId"
            :list-api="TeacherDropSelectbox"
            keyword="name"
            label-field="name"
            value-field="id"
            placeholder="请选择班主任"
          />
        </n-form-item-gi>
        <n-form-item-gi label="班级名称:" path="className">
          <n-input v-model:value="formValue.className" :allow-input="illegalCharacter" placeholder="请输入班级名称" />
        </n-form-item-gi>
      </n-grid>
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">关联信息</p>
      </template>
      <n-grid cols="3" :x-gap="50">
        <n-form-item-gi label="教学楼名称:">
          <dropdown-select
            ref="buildRef"
            v-model:value="formValue.buildingId"
            :list-api="buildingForClassSelectBox"
            :filterable="false"
            keyword="name"
            label-field="name"
            value-field="id"
            placeholder="请选择教学楼"
            @update:value="updateBuild"
          />
        </n-form-item-gi>
        <n-form-item-gi label="楼层名称:">
          <dropdown-select
            ref="floorRef"
            v-model:value="formValue.floorId"
            :list-api="selectBoxByBuildId"
            :filterable="false"
            :init="false"
            :params="{ buildingId: formValue.buildingId }"
            keyword="name"
            label-field="name"
            value-field="id"
            placeholder="请选择楼层"
            @update:value="updateFloor"
          />
        </n-form-item-gi>

        <n-form-item-gi label="教室编号:">
          <dropdown-select
            ref="classroomNumberRef"
            v-model:value="formValue.classroomNumber"
            :list-api="ClassroomDropSelectBox"
            :init="false"
            :params="{ buildingId: formValue.buildingId, floorId: formValue.floorId }"
            keyword="serialNumber"
            label-field="name"
            value-field="id"
            filterable
            placeholder="请选择教室编号"
            @update:value="updateClassroomNumber"
          />
        </n-form-item-gi>
        <n-form-item-gi label="教室名称:">
          <n-input v-model:value="formValue.classroomName" placeholder="" data-attr="不可输入" readonly />
        </n-form-item-gi>
      </n-grid>
    </n-card>
    <n-card class="text-right my-3">
      <n-button type="primary" :disabled="loading" @click="submit">保存</n-button>
      <n-button class="ml-4" ghost @click="go({ name: 'ClassInformation' })">返回</n-button>
    </n-card>
  </n-form>
</template>
<script setup>
import { reactive, onMounted, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';
import useLoading from '@common/hooks/useLoading';
import { addClassRule } from './class.data';
import { illegalCharacter } from '@common/utils/common';
import { addClass, editClass, getClassDetail } from '@/api/information/class';
import {
  buildingForClassSelectBox,
  selectBoxByBuildId,
  ClassroomDropSelectBox,
  TeacherDropSelectbox
} from '@/api/information';
import { classroomNameByNumber } from '@/api/information/classroom';
import { schoolTypesGrade } from '@/api/information/school';

defineOptions({
  name: 'ModifyClassInformation'
});

const { query } = useRoute();
const { go } = useGo();
const { closeCurrent, setTitle } = useTabs();
const { userInfo, userOrgType } = useUserStore();

const { loading, startLoading, endLoading } = useLoading();
const formValue = reactive({
  className: null,
  classroomNumber: null,
  classroomId: null,
  floorId: null,
  buildingId: null,
  studyYear: null,
  gradeId: null,
  teacherId: null
});
const buildRef = ref();
const floorRef = ref();
const gradeOptions = ref([]);
const collapseData = ref([]);
const classroomNumberRef = ref();
const teacherRef = ref();
const formRef = ref();

const updateStudyYear = () => {
  formValue.studyYear = gradeOptions.value.find(d => d.value == formValue.gradeId)?.studyYear ?? '';
};
const updateSchoolTypes = () => {
  const options = collapseData.value.find(d => d.schoolTypesId == formValue.schoolType)?.gradeTree ?? [];
  gradeOptions.value = options.map(d => ({
    label: `${d.gradeName}(${d.studyYear})`,
    value: d.gradeId,
    classList: d.classList,
    studyYear: d.studyYear
  }));
  formValue.gradeId = null;
};
const getCollapseData = async () => {
  const detail = await schoolTypesGrade({ orgId: query.schoolId || userInfo.orgId });
  if (detail) {
    collapseData.value = detail;
  }
  if (formValue.schoolType) {
    const options = collapseData.value.find(d => d.schoolTypesId == formValue.schoolType)?.gradeTree ?? [];
    gradeOptions.value = options.map(d => ({
      label: `${d.gradeName}(${d.studyYear})`,
      value: d.gradeId,
      classList: d.classList,
      studyYear: d.studyYear
    }));
  }
};

const updateBuild = async () => {
  await nextTick();
  formValue.floorId = null;
  formValue.classroomNumber = null;
  formValue.classroomId = null;
  formValue.classroomName = null;

  // 更新下拉列表
  floorRef.value.getOptions();
  classroomNumberRef.value.options = [];
};
const updateFloor = async () => {
  await nextTick();
  formValue.classroomNumber = null;
  formValue.classroomId = null;
  formValue.classroomName = null;
  classroomNumberRef.value.getOptions();
};
const updateClassroomNumber = async (val, option) => {
  getClassroom(option.id);
};
const getClassroom = async id => {
  // 获取 教室名称
  const data = await classroomNameByNumber({ id });
  formValue.classroomId = id;
  formValue.classroomName = data;
};
const submit = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      onAddEdit();
    } else {
      throw new Error('表单验证错误');
    }
  });
};
const onAddEdit = async () => {
  startLoading();
  try {
    const api = query.id ? editClass : addClass;
    await api({ ...formValue, schoolId: query.schoolId });
    closeCurrent();
    // 根据角色来判断跳转，医院的跳转会医院的路由，学校的跳转到学校的路由
    if (userOrgType == 'HOSPITAL') {
      go({
        path: '/information/class-hospital',
        query: {
          schoolId: query.schoolId
        }
      });
    } else {
      go({ path: '/information/class' });
    }
  } finally {
    endLoading();
  }
};

onMounted(async () => {
  if (query.id) {
    const detail = await getClassDetail({ id: query.id });
    detail && Object.assign(formValue, detail);
  } else {
    setTitle('新增班级');
  }
  await nextTick();
  buildRef.value.getOptions();
  teacherRef.value.getOptions();
  formValue.floorId && floorRef.value.getOptions();
  if (formValue.classroomNumber) {
    classroomNumberRef.value.getOptions();
    getClassroom(formValue.classroomId);
  }
  getCollapseData();
});
</script>
