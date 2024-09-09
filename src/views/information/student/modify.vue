<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    require-mark-placement="left"
    label-width="100"
  >
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">学生基本信息</p>
      </template>
      <n-grid cols="3" :x-gap="60" pr-5>
        <n-form-item-gi label="学生姓名:" path="studentName" relative>
          <n-input
            v-model:value="formValue.studentName"
            :allow-input="illegalCharacter"
            placeholder="请输入学生姓名"
            maxlength="50"
          />
          <!-- <n-button
            v-if="query.id && formValue.studentName && formValue.studentName != formValue.oldName"
            text
            class="absolute -right-8 text-primary cursor-pointer"
            @click="confirmChangeInfo('name')"
          >
            申请
          </n-button> -->
        </n-form-item-gi>
        <n-form-item-gi label="性别:" path="sex">
          <n-select v-model:value="formValue.sex" :options="sexOptions" placeholder="请选择性别" />
        </n-form-item-gi>
        <n-form-item-gi label="出生日期:" path="birth">
          <n-date-picker
            v-model:formatted-value="formValue.birth"
            class="w-full"
            type="date"
            :is-date-disabled="disabledTomorrow"
            placeholder="请选择出生日期"
          />
        </n-form-item-gi>
        <n-form-item-gi label="区域:" path="belongArea">
          <n-select v-model:value="formValue.belongArea" :options="belongAreaOptions" placeholder="请选择区域" />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="formValue.belongArea == 1"
          label="证件类型:"
          path="idcardType"
          :show-require-mark="formValue.belongArea == 1"
        >
          <n-select v-model:value="formValue.idcardType" :options="idCardTypeOptions" placeholder="请选择" />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="(formValue.idcardType == 1 && formValue.belongArea == 1) || formValue.belongArea == 2"
          releative
          path="idcard"
          :label="formValue.belongArea == 2 ? '护照号:' : '身份证号码:'"
          :show-require-mark="(formValue.idcardType == 1 && formValue.belongArea == 1) || formValue.belongArea == 2"
        >
          <n-input
            v-model:value="formValue.idcard"
            type="text"
            :placeholder="formValue.belongArea == 1 ? '请输入身份证号码' : '请输入护照号'"
            @input="getBirthAndSex"
          />
          <!-- <n-button
            v-if="query.id && formValue.belongArea == 1 && formValue.idcard != formValue.oldIdcard && showApplyIdcard"
            text
            :disabled="!formValue.idcard"
            class="absolute -right-8 text-primary cursor-pointer"
            @click="confirmChangeInfo('idcard')"
          >
            申请
          </n-button> -->
        </n-form-item-gi>
        <n-form-item-gi label="学籍号码:" path="registerNumber">
          <n-input v-model:value="formValue.registerNumber" type="text" placeholder="请输入学籍号码" />
        </n-form-item-gi>
        <n-form-item-gi label="籍贯:">
          <n-cascader
            v-model:value="formValue.nativePlaceId"
            :options="getArea"
            show-path
            label-field="regionName"
            value-field="regionId"
            check-strategy="child"
            placeholder="请选择籍贯"
          />
        </n-form-item-gi>
        <n-form-item-gi label="民族:">
          <n-select
            v-model:value="formValue.nationality"
            :options="nationOptions"
            value-field="label"
            placeholder="请选择民族"
          />
        </n-form-item-gi>
        <n-form-item-gi label="家长姓名:">
          <n-input v-model:value="formValue.parentName" type="text" placeholder="请输入家长姓名" />
        </n-form-item-gi>
        <n-form-item-gi label="家长手机号:" path="parentPhone">
          <n-input v-model:value="formValue.parentPhone" type="text" placeholder="请输入家长手机号" />
        </n-form-item-gi>
        <n-form-item-gi span="2" label="家庭住址:">
          <n-input v-model:value="formValue.familyAddress" type="text" placeholder="请输入家庭住址" />
        </n-form-item-gi>
      </n-grid>
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;">
      <template #header>
        <p class="font-bold">就读信息</p>
      </template>
      <n-grid cols="3" :x-gap="50">
        <n-form-item-gi label="学校名称:" path="orgName">
          <n-input v-model:value="formValue.orgName" type="text" placeholder="请输入" readonly />
        </n-form-item-gi>
        <n-form-item-gi label="学籍:" path="schoolRoll">
          <n-select v-model:value="formValue.schoolRoll" :options="schoolRollOptions" placeholder="请选择学籍" />
        </n-form-item-gi>
        <n-form-item-gi label="就读状态:" path="studyStatus">
          <n-select v-model:value="formValue.studyStatus" :options="studyStatusOptions" placeholder="请选择就读状态" />
        </n-form-item-gi>
        <n-form-item-gi label="学段:" path="schoolTypes">
          <n-select
            v-model:value="formValue.schoolTypes"
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
        <!-- <n-form-item-gi label="当前年级:" path="gradeId">
          <dropdown-select
            ref="currentGradeRef"
            v-model:value="formValue.gradeId"
            :list-api="existSchoolGrade"
            :params="{ orgId: userInfo.orgId }"
            label-field="gradeName"
            value-field="id"
            @update:value="updateGrade"
          />
        </n-form-item-gi> -->
        <n-form-item-gi label="当前班级:" path="classId">
          <n-select
            v-model:value="formValue.classId"
            label-field="className"
            value-field="classId"
            :options="classOptions"
            @update:value="updateClass"
          />
        </n-form-item-gi>

        <n-form-item-gi v-if="formValue.attendanceRecordList.length" label="就读记录" span="2">
          <n-space>
            <n-tag
              v-for="(item, index) in formValue.attendanceRecordList"
              :key="index"
              closable
              round
              @close="handleCloseReocrd(index)"
            >
              {{ item.gradeName }}{{ item.className }}
            </n-tag>
          </n-space>
        </n-form-item-gi>
      </n-grid>
    </n-card>
    <n-card class="text-right mt-3 mb-12">
      <n-button type="primary" :disabled="loading" @click="submit">保存</n-button>
      <n-button class="ml-4" ghost @click="go({ name: 'StudentInformation' })">返回</n-button>
    </n-card>
  </n-form>
</template>
<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useGo } from '@common/hooks/usePage';
import useLoading from '@common/hooks/useLoading';
import { useTabs } from '@common/hooks/useTabs';

import { disabledTomorrow } from '@common/utils/common/date';
import { illegalCharacter } from '@common/utils/common';
import { getBirth, getSex } from '@common/utils/form/rule';

import { addStudent, getEditDetail, editStudent } from '@/api/information/student';
import { schoolTypesGradeClassTree } from '@/api/information/school';

import {
  idCardTypeOptions,
  sexOptions,
  belongAreaOptions,
  nationOptions,
  getArea,
  schoolRollOptions,
  studyStatusOptions
} from '../common.data';
import { addStudentRules } from './student.data.jsx';

const formValue = reactive({
  studentName: null,
  attendanceRecordList: [],
  orgName: null
});
const { query } = useRoute();
const { go } = useGo();
const { loading, startLoading, endLoading } = useLoading();
const { setTitle, closeCurrent } = useTabs();
const { userInfo } = useUserStore();
formValue.orgName = query.schoolName;
const showApplyIdcard = ref(false);
const formRef = ref();
const gradeOptions = ref([]);
const classOptions = ref([]);
const collapseData = ref([]);

const rules = addStudentRules(formValue);

const updateStudyYear = () => {
  formValue.studyYear = gradeOptions.value.find(d => d.value == formValue.gradeId)?.studyYear ?? '';
  const options = gradeOptions.value.find(d => d.value == formValue.gradeId)?.classList ?? [];
  classOptions.value = options;
  formValue.classId = null;
};
const updateSchoolTypes = () => {
  const options = collapseData.value.find(d => d.schoolTypesId == formValue.schoolTypes)?.gradeTree ?? [];
  gradeOptions.value = options.map(d => ({
    label: `${d.gradeName}(${d.studyYear})`,
    value: d.gradeId,
    classList: d.classList,
    studyYear: d.studyYear
  }));
  classOptions.value = [];
  formValue.gradeId = null;
  formValue.classId = null;
};
const updateClass = async () => {
  await nextTick();
  const { gradeId, classId } = formValue;

  const gradeName = gradeOptions.value.find(d => d.value == gradeId)?.label ?? null;
  const className = classOptions.value.find(d => d.classId == classId)?.className ?? null;

  const isInclude = formValue.attendanceRecordList.find(d => d.classId == formValue.classId);
  if (query.id) {
    // 编辑学生
    if (!isInclude) {
      formValue.attendanceRecordList.push({ gradeName, gradeId, classId, className });
    }
  } else {
    // 创建学生
    formValue.attendanceRecordList = [{ gradeName, gradeId, classId, className }];
  }
};
const handleCloseReocrd = index => {
  formValue.attendanceRecordList.splice(index, 1);
};
// const confirmChangeInfo = type => {
//   const typeStr = type == 'name' ? '学生姓名' : '身份证号';
//   const str = `您所修改的${typeStr},需要上级审核，才可修改完成。`;
//   window.$dialogError(str, () => {
//     const { studentBaseId, studentAttendId, studentName, idcard, oldName, oldIdcard } = formValue;
//     const currentField = type == 'name' ? studentName : idcard;
//     const originalField = type == 'name' ? oldName : oldIdcard;
//     const changeType = type == 'name' ? 1 : 2; // 变更类型：1-姓名，2-身份证号
//     const { id: proposerId } = userInfo;

//     const params = { studentBaseId, studentAttendId, originalField, currentField, changeType, proposerId };
//     return applyChangeStudent(params).then(() => {
//       window.$message.success('操作成功');
//     });
//   });
// };
const getBirthAndSex = () => {
  if (formValue.belongArea == 2 || formValue.idcardType != 1) return;
  formRef.value.validate(
    _errors => {
      if (!_errors) {
        formValue.sex = getSex(formValue.idcard);
        formValue.birth = getBirth(formValue.idcard);
        showApplyIdcard.value = true;
      } else {
        showApplyIdcard.value = false;
      }
    },
    rule => rule?.key === 'idcard'
  );
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
    const { schoolId, schoolName } = query;

    const { idcardType: type, idcard: cardStr, belongArea } = formValue;

    const idcardType = belongArea == 2 ? 2 : type;
    const idcard = type == 0 ? null : cardStr;

    const api = query.id ? editStudent : addStudent;

    await api({ ...formValue, schoolId, schoolName, idcardType, idcard });
    closeCurrent();
    go({ path: '/information/student' });
  } finally {
    endLoading();
  }
};
const getCollapseData = async () => {
  const detail = await schoolTypesGradeClassTree({ orgId: query.schoolId });
  if (detail) {
    collapseData.value = detail;
  }
  if (formValue.schoolTypes) {
    const options = collapseData.value.find(d => d.schoolTypesId == formValue.schoolTypes)?.gradeTree ?? [];
    gradeOptions.value = options.map(d => ({
      label: `${d.gradeName}(${d.studyYear})`,
      value: d.gradeId,
      classList: d.classList,
      studyYear: d.studyYear
    }));
  }
  if (formValue.classId) {
    classOptions.value = gradeOptions.value.find(d => d.value == formValue.gradeId)?.classList ?? [];
  }
};
onMounted(async () => {
  if (query.id) {
    setTitle('编辑学生信息');
    const detail = await getEditDetail({ studentBaseId: query.id, orgId: userInfo.orgId });
    if (detail) {
      const { studentName, belongArea, idcard, studentClassCommonVOS } = detail;
      const idcardType = belongArea == 2 ? null : idcard ? 1 : 0;
      Object.assign(formValue, detail, {
        oldName: studentName,
        oldIdcard: idcard,
        idcardType,
        attendanceRecordList: studentClassCommonVOS || []
      });
    }
  }
  await nextTick();
  getCollapseData();
});
defineOptions({
  name: 'ModifyStudentInformation'
});
</script>
