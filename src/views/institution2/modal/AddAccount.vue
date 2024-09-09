<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    class="w-600px"
    :title="title"
    @register="register"
    @visible-change="visibleChange"
    @ok="onSure"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="left"
      >
        <n-form-item label="姓名：" path="realName">
          <n-input v-model:value="formValue.realName" placeholder="请输入姓名" />
        </n-form-item>

        <n-form-item label="手机号：" path="phone">
          <n-input v-model:value="formValue.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="身份证号：" path="idCard">
          <n-input v-model:value="formValue.idCard" placeholder="请输入身份证号" />
        </n-form-item>
        <n-form-item label="用户名：" path="account">
          <n-input
            v-model:value="formValue.account"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <n-form-item label="角色：" path="roleId">
          <n-select
            v-model:value="formValue.roleId"
            :options="roleOptions"
            placeholder="请选择角色"
            label-field="name"
            value-field="id"
            :disabled="formValue.orgType < 4 && !treeData.length"
            @update:value="updateRole"
          />
        </n-form-item>
        <n-form-item
          v-if="formValue.orgType < 4 && formValue.roleName !== '筛查员'"
          label="数据权限:"
          required
          :path="treeData.length ? 'permissonList' : ''"
        >
          <div class="w-full max-h-300px overflow-auto">
            <n-tree
              v-if="treeData.length"
              v-model:checked-keys="formValue.permissonList"
              :disabled-field="disableTree ? 'id' : ''"
              block-line
              cascade
              checkable
              :selectable="false"
              :data="treeData"
              :default-expand-all="true"
              key-field="id"
              label-field="name"
            />
            <span v-else ml-1>所有权限</span>
          </div>
        </n-form-item>
        <template v-if="!isEdit">
          <n-form-item label="密码:" path="password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              show-password-on="mousedown"
              placeholder="请输入密码"
            />
          </n-form-item>
          <n-form-item label="重复密码:" path="confirmPassword">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              show-password-on="mousedown"
              placeholder="请输入重复密码"
            />
          </n-form-item>
        </template>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, nextTick, computed, unref, ref } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { cloneDeep } from 'lodash-es';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';

import { AddBusUser, UpdateBusUser } from '@/api/systemManage/account';
import { GetRoleList } from '@/api/systemManage/role';
import { schoolPermissionList, schoolPermissionUsed } from '@/api/institution2';

import { formRef, addAccountRules } from './modal.data';
import { AC_EDIT } from '@common/enum/pageEnum';

const emits = defineEmits(['onSuccess', 'register']);
const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(data => {
  data && onDataReceive(data);
});
const { getEncrypt } = useEncrypt();

const origin = {
  realName: '',
  account: '',
  phone: '',
  idCard: '',
  roleId: null,
  permissonList: [],
  password: '',
  confirmPassword: '',
  orgId: null,
  id: null,
  // dataRoleId: null,
  roleName: ''
};
const admin = '管理员';
const disableTree = ref(false);
const treeData = ref([]);

const formValue = reactive(cloneDeep(origin));
const rules = addAccountRules(formValue);

const roleOptions = ref([]);
let allPerIds = [];
let allLeafIds = [];

const isEdit = computed(() => formValue.key == AC_EDIT);

const title = computed(() => (formValue.key == AC_EDIT ? '编辑账户' : '添加账户'));
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
function updateRole(val, option) {
  formValue.roleName = option.name;
  if (option?.name == admin) {
    formValue.permissonList = allPerIds;
    disableTree.value = true;
  } else {
    formValue.permissonList = [];
    disableTree.value = false;
  }
}
/**
 * 添加、编辑
 */
async function onModify() {
  const params = cloneDeep(formValue);
  let { password, confirmPassword } = params;
  changeLoading(true);
  changeOkLoading(true);
  if (params.permissonList?.length) {
    const intersection = params.permissonList.filter(d => allLeafIds.indexOf(d) > -1);
    params.permissonList = intersection;
  } else {
    params.permissonList = [0];
  }
  [password, confirmPassword] = await Promise.all([getEncrypt(password), getEncrypt(confirmPassword)]);
  try {
    const api = isEdit.value ? UpdateBusUser : AddBusUser;

    await api({ ...params, password, confirmPassword });
    window.$message.success(`账号${unref(isEdit) ? '编辑' : '新增'}成功`);
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
async function getTreeData() {
  const list = await schoolPermissionList({ orgId: formValue.orgId });
  if (list?.length) {
    treeData.value = list;
    const arr = [...list];
    for (let i = 0; i < arr.length; i++) {
      let node = arr[i];
      allPerIds.push(node.id);
      let isLeaf = node.children?.length;
      if (isLeaf) {
        arr.push(...node.children);
      } else {
        allLeafIds.push(node.id);
      }
    }
  }
}
async function getUsedMenuIds(params) {
  const list = await schoolPermissionUsed(params);
  if ((list && +list[0] == 0) || formValue.roleName == admin) {
    formValue.permissonList = allPerIds;
  } else {
    formValue.permissonList = list;
  }
}
function reset() {
  Object.assign(formValue, origin);
  roleOptions.value = [];
  disableTree.value = false;
  treeData.value = [];
  formRef.value?.restoreValidation();
}
async function onDataReceive(data) {
  console.log(data);
  Object.assign(formValue, data);

  if (formValue.orgType < 4) {
    // 学校机构 获取数据权限
    await getTreeData();
    if (data.id) {
      // 获取已经勾选得数据权限
      getUsedMenuIds({ userId: data.id });
    }
  }
  if (data.orgId) {
    const { records: result } = await GetRoleList({ orgId: data.orgId });
    if (!result?.length) return;
    roleOptions.value = result;
    if (unref(isEdit)) {
      if (data.roleName == admin) {
        // 编辑管理员账号
        disableTree.value = true;
      }
    }
    if (!treeData.value.length && formValue.orgType < 4) {
      // 学校端数据没有初始化 只能创建管理员账号
      let v = result.find(v => v.name === admin);
      formValue.roleId = v.id;
      disableTree.value = true;
    }
  }
}
</script>
