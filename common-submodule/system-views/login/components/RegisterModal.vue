<template>
  <basic-modal
    v-bind="$attrs"
    class="w-550px"
    ok-text="提交"
    :mask-closable="false"
    @register="register"
    @ok="handleSubmit"
    @visible-change="visibleChange"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      :label-width="120"
      label-align="right"
      size="large"
    >
      <n-form-item label="机构所属地区">
        <n-cascader
          v-model:value="formData.areaId"
          placeholder="请选择机构所属地区"
          :options="areaList"
          check-strategy="child"
          label-field="regionName"
          value-field="regionId"
          clearable
          filterable
          @update:value="onAreaUpdate"
        />
      </n-form-item>

      <n-form-item label="机构名称" path="phone">
        <n-select
          v-model:value="formData.orgId"
          :options="orgList"
          label-field="orgName"
          value-field="id"
          filterable
          clearable
          :loading="orgLoading"
          placeholder="输入关键词搜索"
          @search="val => getSchoolList(val)"
        />
      </n-form-item>

      <n-form-item label="姓名" path="realName">
        <n-input v-model:value="formData.realName" placeholder="请输入姓名" />
      </n-form-item>

      <n-form-item label="身份证号" path="idCard">
        <n-input v-model:value="formData.idCard" placeholder="请输入身份证号" />
      </n-form-item>

      <n-form-item label="用户名" path="account">
        <n-input v-model:value="formData.account" placeholder="请输入用户名" />
      </n-form-item>

      <n-form-item label="密码" path="password">
        <n-input v-model:value="formData.password" type="password" placeholder="请输入密码" />
      </n-form-item>

      <n-form-item label="确认密码" path="confirmPassword">
        <n-input v-model:value="formData.confirmPassword" type="password" placeholder="确认密码" />
      </n-form-item>

      <n-form-item label="手机号码" path="phone">
        <n-input v-model:value="formData.phone" placeholder="请输入手机号码" />
      </n-form-item>

      <n-form-item label="手机验证码" path="smsCode">
        <n-space>
          <n-input-number v-model:value="formData.smsCode" :show-button="false" placeholder="请输入验证码" />
          <n-button :disabled="isCounting" @click="handleSmsCode">{{ label }}</n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, toRef, toRaw } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';

import useSmsCode from '@common/hooks/business/useSmsCode';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { SERVICE_TEL } from '@common/enum/common';

import { formRules, getConfirmPwdRule } from '@common/utils/form/rule';
import { removeEmptyChildrenField } from '@common/utils/common';

import { smsSend } from '@common/api/system/common';
import { getAreaTree, getOrgList } from '@common/api/system/common';
import { userRegist, getPublicKey } from '@common/api/system/user';
import useApi from '@common/hooks/business/useApi';

const formRef = ref(null);
const areaList = ref([]);
const orgList = ref([]);

const { label, isCounting, getSmsCode } = useSmsCode(smsSend);
const { fetch: getOrgLists, loading: orgLoading } = useApi(getOrgList);
const { getEncrypt } = useEncrypt(getPublicKey);

const formData = reactive({
  areaId: null,
  orgId: null,
  realName: null,
  account: null,
  idCard: null,
  password: null,
  confirmPassword: null,
  phone: null,
  smsCode: null
});

const rules = {
  orgId: { required: true, message: '请选择机构' },
  realName: { required: true, message: '请输入姓名' },
  account: { required: true, message: '请输入用户名' },
  idCard: formRules.idcard,
  password: formRules.password,
  confirmPassword: getConfirmPwdRule(toRef(formData, 'password')),
  phone: formRules.phone,
  smsCode: { required: true, message: '请输入手机验证码' }
};

const [register, { closeModal, changeOkLoading }] = useModalInner();

function handleSmsCode() {
  const params = {
    operateType: 1,
    phone: formData.phone,
    idcard: formData.idCard,
    type: 10
  };
  getSmsCode(params);
}

function handleSubmit() {
  formRef.value.validate(async errors => {
    if (!errors) {
      try {
        changeOkLoading();
        const password = await getEncrypt(formData.password);
        const confirmPassword = await getEncrypt(formData.confirmPassword);

        const parmas = {
          ...toRaw(formData),
          password,
          confirmPassword
        };

        await userRegist(parmas);
        window.$dialogSuccess(
          `您的注册申请已提交成功！如长时间未审核，请联系所申请机构的管理员进行审核。客服电话：${SERVICE_TEL}。`,
          () => {
            closeModal();
          }
        );
      } finally {
        changeOkLoading(false);
      }
    }
  });
}

function getAreaList() {
  getAreaTree().then(data => {
    const { provinceVOList = [] } = data;
    const treeList = removeEmptyChildrenField(provinceVOList);

    areaList.value = treeList;
  });
}

function getSchoolList(keyword) {
  const params = { regionId: formData.areaId, schoolName: keyword || '' };
  getOrgLists(params).then(data => {
    if (data) {
      orgList.value = data;
    }
  });
}

function onAreaUpdate(val) {
  formData.orgId = null;
  val && getSchoolList();
}

function visibleChange(visible) {
  visible && getAreaList();
}
</script>
