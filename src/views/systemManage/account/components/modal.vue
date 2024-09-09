<template>
  <basic-modal
    v-bind="$attrs"
    :title="title"
    class="w-600px"
    :mask-closable="false"
    @register="register"
    @ok="handleSubmit"
    @after-leave="visibleChange"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="95"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <n-form-item v-if="isCurConsole" label="机构名称:" path="orgId">
          <n-select
            v-model:value="state.orgId"
            :options="orgOptions"
            placeholder="请选择所属机构"
            clearable
            label-field="orgName"
            value-field="id"
            filterable
            :disabled="!isAdd"
            @update:value="changeOrg"
          />
        </n-form-item>
        <n-form-item v-if="type === 1 && (govLevel == 1 || govLevel == 2)" label="所属地区" path="areaId">
          <n-cascader
            v-model:value="state.areaId"
            placeholder="请选择所属地区"
            :options="addressData"
            label-field="areaName"
            value-field="id"
            check-strategy="all"
            children-field="childAreas"
            @update:value="handleAddressUpdate"
          />
        </n-form-item>

        <template v-if="tab == 4">
          <n-form-item
            v-if="type === 1 && govLevel"
            :label="`所属${isSchool ? '学校' : '机构'}`"
            path="orgId"
            :rule="{ required: true, trigger: ['blur', 'input'], message: '请选择机构' }"
          >
            <dropdown-select
              ref="orgIdRef"
              v-model:value="state.orgId"
              :disabled="(govLevel == 1 || govLevel == 2) && !state.areaId"
              :list-api="tab == 4 ? getSchoolSelect : getAreaOrgList"
              :params="{ name: undefined, areaId: state.areaId || areaId, regionId: state.areaId || areaId }"
              :placeholder="`请选择所属${isSchool ? '学校' : '机构'}`"
              label-field="orgName"
              :value-field="tab == 4 ? 'id' : 'orgId'"
              filterable
              clearable
              @update:value="handleOrgUpdate"
            />
          </n-form-item>
        </template>

        <template v-else>
          <n-form-item
            v-if="type === 1 && govLevel"
            :label="`所属${isSchool ? '学校' : '机构'}`"
            path="orgId"
            :rule="{ required: true, trigger: ['blur', 'input'], message: '请选择机构' }"
          >
            <dropdown-select
              ref="orgIdRef"
              v-model:value="state.orgId"
              :disabled="(govLevel == 1 || govLevel == 2) && !state.areaId"
              :list-api="getAreaOrgList"
              :params="{ name: undefined, areaId: state.areaId || areaId }"
              :placeholder="`请选择所属${isSchool ? '学校' : '机构'}`"
              label-field="orgName"
              value-field="orgId"
              filterable
              clearable
              @update:value="handleOrgUpdate"
            />
          </n-form-item>
        </template>

        <n-form-item label="姓名：" path="realName">
          <n-input v-model:value="state.realName" placeholder="请输入姓名" :disabled="checked && state2.realName" />
        </n-form-item>
        <n-form-item label="手机号：" path="phone">
          <n-input
            v-model:value="state.phone"
            placeholder="请输入手机号"
            :disabled="checked"
            @blur="checkUser(state.phone, 'phone')"
          />
        </n-form-item>
        <n-form-item label="身份证号：" path="idCard">
          <n-input v-model:value="state.idCard" placeholder="请输入身份证号" :disabled="checked && state2.idCard" />
        </n-form-item>
        <n-form-item label="用户名：" path="account">
          <n-input
            v-model:value="state.account"
            placeholder="请输入用户名"
            :disabled="!isAdd || checked"
            @blur="checkUser(state.account, 'account')"
          />
        </n-form-item>
        <n-form-item label="角色：" path="roleId">
          <n-select
            v-model:value="state.roleId"
            :options="roleOptions"
            placeholder="请选择角色"
            clearable
            label-field="name"
            value-field="id"
            filterable
            @update:value="changeRole"
          />
        </n-form-item>
        <n-form-item v-if="showPermission" label="数据权限：" required :path="perList.length ? 'permissonList' : ''">
          <div class="w-full max-h-300px overflow-auto">
            <n-tree
              v-model:checked-keys="state.permissonList"
              block-line
              cascade
              checkable
              check-strategy="child"
              :data="perList"
              :default-expand-all="true"
              :disabled-field="isAdmin ? 'id' : ''"
              key-field="id"
              label-field="name"
            />
          </div>
        </n-form-item>
        <template v-if="isAdd">
          <n-form-item label="密码：" path="password">
            <n-input
              v-model:value="state.password"
              type="password"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
              placeholder="请输入密码"
              :readonly="checked"
            />
          </n-form-item>
          <n-form-item label="重复密码：" path="confirmPassword">
            <n-input
              v-model:value="state.confirmPassword"
              type="password"
              :input-props="{ autocomplete: 'new-password' }"
              show-password-on="click"
              placeholder="请输入重复密码"
              :readonly="checked"
            />
          </n-form-item>
        </template>
      </n-form>
    </n-space>

    <checkUserModal ref="checkModelRef" @register="register2" @on-ok="handleCheckOk" @on-cancel="handleCheckCancel" />
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed, nextTick, toRefs, onMounted } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useModalInner, useModal } from '@common/components/custom/Modal';
import { AC_ADD, AC_EDIT, OrgTypeEnum } from '@common/enum/pageEnum';
import useEncrypt from '@common/hooks/business/useRSAEncrypt';
import { useUserStore } from '@/store';
import checkUserModal from './checkUserModal.vue';

import {
  UserCurPer,
  UserPerList,
  AddBusUser,
  UpdateBusUser,
  getAllOrgSelectBox,
  getSubordinateRegion,
  getAreaOrgList,
  getSchoolSelect
} from '@/api/systemManage/account';
import { GetRoleList } from '@/api/systemManage/role';

import { rules as createRules } from '../table.data';

const emits = defineEmits(['onSuccess', 'register']);

const [register2] = useModal();

const {
  userInfo: { orgId, id: curUserId, govLevel, areaId },
  userOrgType
} = useUserStore();
const tab = ref();

const [register, { closeModal, changeLoading }] = useModalInner(async data => {
  roleIdRef.value?.getOptions();
  setModalTitle(data);
  if (isCurConsole.value) {
    getOrgOptions();
  }
  isSchool.value = data.type == 1 && govLevel == 3;
  type.value = data.type;
  tab.value = data.govLevel;

  data.key === AC_ADD
    ? await getRoleAndPermission(orgId, userOrgType)
    : await getRoleAndPermission(data?.row?.orgId, OrgTypeEnum?.[data?.row?.orgType]);
  data.key === AC_EDIT && onDataReceive(data);

  // 如果是省或者市 显示所属地区和所属机构
  if (govLevel) {
    getRegion();
  }

  // 区的学校tab 请求机构
  if (isSchool.value || govLevel) {
    // state.areaId = areaId;
    setTimeout(() => {
      orgIdRef.value?.getOptions();
    });
  }
});

const isSchool = ref(false);
const orgIdRef = ref();
const type = ref(null);
const addressData = ref([]);

let t = '';
const title = ref('');

const roleIdRef = ref();
const formRef = ref(null);
const initForm = {
  account: '',
  idCard: '',
  phone: '',
  realName: '',
  roleName: '',
  roleId: null,
  orgId: null,
  permissonList: null,
  password: '',
  confirmPassword: '',
  id: '',
  orgType: undefined,
  areaId: null
};

const state = reactive(cloneDeep(initForm));
const state2 = reactive({ realName: '', idCard: '' });
const { getEncrypt } = useEncrypt();

const stateRefs = toRefs(state);
// const rules = createRules(stateRefs);

const checkModelRef = ref(null);
const checked = ref(false);

const curPerList = ref([]);
const treeSchool = ref([]);
let leafNode = [];
const operation = ref('');
const orgOptions = ref([]);
const roleOptions = ref([]);
const isAdd = computed(() => operation.value === AC_ADD);
const isAdmin = computed(() => state.roleName.includes('管理员'));
const isScreener = computed(() => state.roleName.includes('筛查员'));
const isOwn = computed(() => state.id === curUserId);
const isCurConsole = computed(() => userOrgType === 'CONSOLE');
const isCurSchool = computed(() => userOrgType === 'SCHOOL');
const rules = computed(() => {
  const r = createRules(stateRefs);
  const accountRule = checked.value ? { key: 'account', required: true, trigger: ['blur'] } : r.account;

  return { ...r, account: accountRule };
});

// 其他角色
const isOtherRole = computed(() => {
  return !isScreener.value && !isAdmin.value;
});
//  当前学校  不是自己 并且 非管理员 非筛查员
// 或者 运维端 选的是学校 并且角色不是筛查员而且不是管理员
// 展示数据权限
const showPermission = computed(() => {
  return (
    (!isOwn.value && isCurSchool.value && isOtherRole.value) ||
    (isCurConsole.value && OrgTypeEnum?.[state?.orgType] === 'SCHOOL' && isOtherRole.value)
  );
});
// 全量的权限树
const perList = computed(() => {
  if (isAdd.value) return treeSchool.value; // 新增时无需控制禁用数据权限

  if (!curPerList.value || !treeSchool.value) return [];
  const curList = [...curPerList.value];
  let tree = JSON.parse(JSON.stringify(treeSchool.value));
  leafNode = [];
  (function filterSchool(arr) {
    let flag = 0;
    for (let i = 0; i < arr.length; i++) {
      let node = arr[i];
      let children = node.children;
      if (children?.length) {
        let num = filterSchool(children);
        if (num > 0) flag += 1;
        node.checkboxDisabled = !num;
      } else {
        leafNode.push(node.id);
        let isContain = false;
        for (let j = 0; j < curList.length; j++) {
          const id = curList[j];
          if (id === node.id) {
            curList.splice(j, 1);
            flag++;
            isContain = true;
            break;
          }
        }
        node.checkboxDisabled = !isContain;
      }
    }
    return flag;
  })(tree);
  return tree;
});

async function visibleChange() {
  await nextTick();
  roleOptions.value = [];
  resetForm();
}

function checkUser(val, key) {
  if (isAdd.value && val)
    formRef.value?.validate(
      err => {
        if (!err) checkModelRef.value.checkUser(val, key);
      },
      rule => {
        return rule?.key === key;
      }
    );
}

function handleCheckOk(data) {
  Object.assign(state, {
    realName: data.name,
    account: data.account,
    phone: data.phone,
    idCard: data.idCard,
    password: data.passWord,
    confirmPassword: data.passWord
  });

  state2.realName = data.name; // 判断是否可以编辑姓名
  state2.idCard = data.idCard; // 判断是否可以编辑身份证号

  checked.value = true;
}

function handleCheckCancel(key) {
  state[key] = null;
  checked.value = false;
}

async function onDataReceive({ row }) {
  console.log(row);
  Object.assign(state, row);
  const res = await UserCurPer({ userId: row.id });
  state.permissonList = res;
}

function getRoleAndPermission(orgId, orgType) {
  if (type.value == 0 || !isAdd.value) {
    getRoleOptions(orgId);
  }
  orgType === 'SCHOOL' && getDataPermission(orgId);
}

async function getOrgOptions() {
  orgOptions.value = await getAllOrgSelectBox({ orgName: '' });
}
async function getRoleOptions(orgId) {
  state.orgId = orgId;
  const params = { orgId, type: !orgId ? 2 : null }; // orgId 有值时返回相应机构角色列表，无值时则返回运维角色

  const { records } = await GetRoleList(params);
  roleOptions.value = records;
}

async function getRegion() {
  addressData.value = await getSubordinateRegion({ areaId });
}

async function getDataPermission(orgId) {
  const res = await UserPerList({ orgId });
  treeSchool.value = res;

  let allPer = [];
  let stack = [...res];
  for (let i = 0; i < stack.length; i++) {
    const item = stack[i];
    if (item.children?.length) {
      stack.push(...item.children);
      continue;
    }
    allPer.push(item.id);
  }
  // 如果是编辑的时候从used接口获取应该选中的账号，新增的时候获取全量的
  isAdd.value && (state.permissonList = allPer);
}

function changeOrg(orgId, v) {
  let { orgType = '' } = v || {};
  state.roleId = null;
  state.orgType = orgType;
  getRoleOptions(orgId);
  OrgTypeEnum[orgType] === 'SCHOOL' && getDataPermission(orgId);
}

function handleOrgUpdate(value) {
  state.orgId = value;
  state.roleId = null;
  if (!value) {
    roleOptions.value.options = [];
    return;
  }
  getRoleOptions(value);
}

function setModalTitle({ key }) {
  operation.value = key;
  console.log(isAdd.value);
  t = key === AC_EDIT ? '编辑' : key === AC_ADD ? '新增' : '查看';
  title.value = t + '账号';
}
function changeRole(_v, { name }) {
  state.roleName = name;
}

async function handleAddressUpdate(arg) {
  await nextTick();
  state.areaId = arg;
  orgIdRef.value?.getOptions();
  state.orgId = null;
}

function resetForm() {
  checked.value = false;
  Object.assign(state, initForm);
}

function handleSubmit() {
  formRef.value.validate(async err => {
    if (!err) {
      changeLoading(true);
      let { password, confirmPassword, permissonList } = state;

      // 判断是更新还是新增
      const funcApi = isAdd.value ? AddBusUser : UpdateBusUser;
      console.log(state, 'state');

      if (isAdd.value) {
        [password, confirmPassword] = await Promise.all([getEncrypt(password), getEncrypt(confirmPassword)]);
      }
      let perList = permissonList?.length === leafNode.length ? [0] : permissonList;
      if (isAdmin.value) perList = [0];
      if (isScreener.value) perList = null;
      const params = {
        ...state,
        password,
        confirmPassword,
        permissonList: perList
      };
      console.log(params, 'params');
      funcApi(params)
        .then(_res => {
          closeModal();
          window.$message.success(t + '成功');
          emits('onSuccess');
        })
        .finally(() => {
          changeLoading(false);
        });
    }
  });
}

onMounted(async () => {
  curPerList.value = await UserCurPer({ userId: curUserId });
});
</script>
