<template>
  <n-form
    ref="formRef"
    :rules="rules"
    :model="formValue"
    label-placement="left"
    require-mark-placement="left"
    label-width="120"
  >
    <n-card>
      <n-grid cols="3" :x-gap="50">
        <n-form-item-gi label="教师姓名:" path="name">
          <n-input v-model:value="formValue.name" type="text" placeholder="请输入教师姓名" maxlength="100" />
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
        <n-form-item-gi label="性别:" path="sex">
          <n-select v-model:value="formValue.sex" :options="sexOptions" placeholder="请选择性别" />
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
        </n-form-item-gi>
        <n-form-item-gi label="教师编号:" path="serialNumber">
          <n-input v-model:value="formValue.serialNumber" type="text" placeholder="请输入" />
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
            placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi label="联系方式:" path="tel">
          <n-input v-model:value="formValue.tel" type="text" placeholder="请输入电话号码" />
        </n-form-item-gi>
        <n-form-item-gi label="教师职位:">
          <dropdown-select
            ref="positionRef"
            v-model:value="formValue.positionId"
            :list-api="positionSelectBox"
            label-field="name"
            value-field="id"
          />
        </n-form-item-gi>
        <n-form-item-gi span="2" label="家庭住址:">
          <n-input v-model:value="formValue.familyAddress" type="text" placeholder="请输入家庭住址" maxlength="100" />
        </n-form-item-gi>
      </n-grid>
    </n-card>

    <n-card class="text-right my-3">
      <n-button type="primary" :disabled="loading" @click="submit">保存</n-button>
      <n-button class="ml-4" ghost @click="go({ name: 'TeacherInformation' })">返回</n-button>
    </n-card>
  </n-form>
</template>
<script setup>
import { reactive, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import { useTabs } from '@common/hooks/useTabs';
import { useGo } from '@common/hooks/usePage';
import useLoading from '@common/hooks/useLoading';

import { disabledTomorrow } from '@common/utils/common/date';
import { getBirth, getSex } from '@common/utils/form/rule';

import { editShow, addTeacher, editTeacher, positionSelectBox } from '@/api/information/teacher';
import { teacherRules } from './teacher.data.jsx';
import { idCardTypeOptions, sexOptions, nationOptions, getArea, belongAreaOptions } from '../common.data';

defineOptions({
  name: 'ModifyTeacherInformation'
});
const { query } = useRoute();
const { go } = useGo();
const { setTitle, closeCurrent } = useTabs();
const { loading, startLoading, endLoading } = useLoading();

const formValue = reactive({
  name: null,
  birth: null,
  idcardType: null,
  idcard: null,
  sex: null,
  serialNumber: null,
  nativePlaceId: null,
  nationality: null,
  tel: null,
  positionId: null,
  familyAddress: null
});
const formRef = ref();
const positionRef = ref();
const rules = teacherRules(formValue);

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
    const api = query.id ? editTeacher : addTeacher;
    const { idcardType, idcard } = formValue;
    const idCardStr = idcardType == 0 ? null : idcard;
    await api({ ...formValue, idcard: idCardStr });
    closeCurrent();
    go({ path: '/information/teacher' });
  } finally {
    endLoading();
  }
};
const getBirthAndSex = () => {
  if (formValue.belongArea == 2 || formValue.idcardType != 1) return;
  formRef.value.validate(
    _errors => {
      if (!_errors) {
        formValue.sex = getSex(formValue.idcard);
        formValue.birth = getBirth(formValue.idcard);
      }
    },
    rule => rule?.key === 'idcard'
  );
};
onMounted(async () => {
  if (query.id) {
    const detail = await editShow({ id: query.id });
    if (detail) {
      const { belongArea, idcard } = detail;
      const idcardType = belongArea == 2 ? null : idcard ? 1 : 0;
      Object.assign(formValue, detail, { idcardType });
    }

    setTitle('编辑教师信息');
  }
  await nextTick();
  positionRef.value.getOptions();
});
</script>
