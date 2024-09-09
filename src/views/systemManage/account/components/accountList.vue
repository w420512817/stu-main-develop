<template>
  <div>
    <n-space vertical>
      <n-form
        inline
        :model="formValue"
        label-placement="left"
        label-align="right"
        label-width="auto"
        @keypress.enter="onSearch"
      >
        <n-grid cols="5" :x-gap="20" :collapsed="gridCollapsed" responsive="screen">
          <n-form-item-gi label="用户:" label-width="46">
            <n-input v-model:value="formValue.user" type="text" placeholder="姓名/用户名/手机号" clearable flex-1 />
          </n-form-item-gi>

          <n-form-item-gi v-if="isConsoleOrg" label="所属机构:">
            <n-select
              v-model:value="formValue.orgId"
              :options="orgOptions"
              placeholder="请选择所属机构"
              clearable
              label-field="orgName"
              value-field="id"
              filterable
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="curGovLevel && curGovLevel <= 1 && props.govLevel == 2" label="所属市：">
            <n-select
              v-model:value="formValue.cityId"
              :options="cityOpt"
              value-field="id"
              label-field="areaName"
              filterable
              @update:value="getOrgList"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="curGovLevel && curGovLevel <= 2 && props.govLevel >= 3" label="所属区：">
            <n-select
              v-model:value="formValue.regionId"
              :options="regOpt"
              value-field="id"
              label-field="areaName"
              filterable
              @update:value="areaChange"
            />
          </n-form-item-gi>

          <n-form-item-gi v-if="curGovLevel && props.govLevel == 4" label="所属学校：">
            <n-select
              v-model:value="formValue.orgId"
              :options="schoolList"
              value-field="id"
              label-field="orgName"
              filterable
              @update:value="getRoleOptions"
            />
          </n-form-item-gi>

          <n-form-item-gi
            v-if="curGovLevel && props.govLevel > 1 && !isSelfOrg && props.govLevel !== 4"
            label="所属机构："
          >
            <n-select
              v-model:value="formValue.orgId"
              :options="orgOpt"
              :disabled="props.govLevel <= 2 && !(formValue.cityId || formValue.regionId)"
              filterable
              value-field="orgId"
              label-field="orgName"
              @update:value="getRoleOptions"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="!isConsoleOrg" label="角色:" label-width="46">
            <n-select
              v-model:value="formValue.role"
              :options="roleOpt"
              :disabled="!formValue.orgId"
              label-field="name"
              value-field="name"
              placeholder="请选择"
              clearable
              flex-1
            />
          </n-form-item-gi>

          <!-- <n-form-item-gi v-if="props.govLevel === 4" label="状态">
            <n-select v-model:value="formValue.status" clearable :options="statusMap" placeholder="请选择状态" />
          </n-form-item-gi> -->
          <n-gi>
            <search-buttons @search="onSearch" @reset="onReset" @collapse="gridCollapsed = !gridCollapsed">
              <n-button v-auth="9380" type="primary" @click="handleClick(AC_ADD)">新增账号</n-button>
            </search-buttons>
          </n-gi>
        </n-grid>
      </n-form>

      <div v-auth="9380" class="mb-4">
        <n-button size="small" type="primary" ghost @click="openImportModel">批量导入</n-button>
      </div>

      <n-data-table
        :render-cell="v => v ?? '/'"
        remote
        striped
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="dataSource"
      />
    </n-space>

    <ExamineModal @register="registerExamine" @on-success="getDataSource" />
    <updatePasswordModal @register="register" @on-success="getDataSource" />

    <syncImportModal
      type="account"
      @register="registerImportModal"
      @on-success="data => openImportResultModel(true, data)"
    />
    <syncImportResult type="account" @register="registerResultModal" @on-success="onSearch" />
  </div>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted, computed } from 'vue';
import ExamineModal from './ExamineModal.vue';

import usePagination from '@common/hooks/business/usePagination';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '@/store';
import { useModal } from '@common/components/custom/Modal/hooks/useModal';
import syncImportModal from './syncImportModal.vue';
import syncImportResult from './syncImportResult.vue';

import {
  GetAccountList,
  GetAllAccountList,
  UpdateAccountStatus,
  DeleteUser,
  getAllOrgSelectBox,
  getSubordinateRegion,
  getAreaOrgList,
  getSchoolSelect
} from '@/api/systemManage/account';
import { GetRoleList } from '@/api/systemManage/role';
import { createColumns, statusMap } from '../table.data';
import { AC_DELETE, AC_RESET, AC_EDIT, AC_ADD, AC_STOP_START } from '@common/enum/pageEnum';
import { removeNullValues } from '@common/utils';
import updatePasswordModal from './ResetPassword.vue';

defineOptions({
  name: 'AccountManage'
});
const emit = defineEmits(['open-modal']);
const props = defineProps({
  govLevel: {
    type: Number,
    default: 4
  }
});

const {
  userOrgType,
  userInfo: { govLevel: curGovLevel, areaId, orgId }
} = useUserStore();

const isConsoleOrg = computed(() => userOrgType === 'CONSOLE');
const isSelfOrg = curGovLevel == props.govLevel;

const origin = {
  user: null,
  orgId: isSelfOrg ? orgId : null,
  cityId: curGovLevel == 3 ? areaId : null,
  regionId: null,
  level: props.govLevel,
  role: null,
  type: isSelfOrg || !curGovLevel ? 0 : 1,
  status: null
};
const gridCollapsed = ref(true);
const formValue = reactive({ ...origin });
const cityOpt = ref([]);
const regOpt = ref([]);
const orgOpt = ref([]);
const schoolList = ref([]);
const orgOptions = ref([]);
const roleOpt = ref([]);

// const { getEncrypt } = useEncrypt();
let listApi = isConsoleOrg.value ? GetAllAccountList : GetAccountList;
const { fetch: getAccountListApi, loading } = useApi(listApi);

const [registerExamine, { openModal: openExamineModal }] = useModal();
const [register, { openModal }] = useModal();

const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openImportResultModel }] = useModal();

const { pagination, setCount } = usePagination(() => {
  getDataSource();
});

const dataSource = ref([]);
const columns = createColumns(handleClick);

async function getDataSource() {
  const { page: current, pageSize: size } = pagination;
  let params = removeNullValues({ current, size, ...formValue });
  const data = await getAccountListApi(params);
  const { records = [], total } = data || {};
  if (!isConsoleOrg.value) {
    records.forEach(item => {
      item.phone = atob(item.phone);
      item.idCard = atob(item.idCard);
    });
  }
  dataSource.value = records;
  setCount(~~total);
}

function removeAccount({ id, account }) {
  window.$dialogError(`是否确认删除账号【${account}】？删除后将无法恢复，请谨慎操作！`, () => {
    return DeleteUser({ userId: id }).then(() => {
      window.$message.success('删除成功!');
      getDataSource();
    });
  });
}

// async function resetPassword({ account, id }) {
//   const pwd = password();
//   window.$dialogWarning(`确认重置账号【${account}】的密码吗？`, async () => {
//     const newPassword = await getEncrypt(pwd);
//     return UpdateAccountPassword({ userId: id, newPassword }).then(() => {
//       copyPassword(account, pwd);
//     });
//   });
// }

// function copyPassword(account, pwd) {
//   const { copy, isSupported } = useClipboard();
//   const not = window.$notification.success({
//     title: '密码重置成功',
//     meta: () => (
//       <div>
//         <p style={{ fontSize: '14px', color: '#606266' }}>
//           <span>
//             {account} 的新密码<a style={{ color: '#6A76DD' }}>{pwd}</a>
//             ，请及时告知！
//           </span>
//         </p>
//         <p className="flex justify-end mt-10px">
//           {isSupported.value ? (
//             <NButton
//               type="primary"
//               onClick={() => {
//                 copy(pwd);
//                 not.destroy();
//                 window.$message.success('复制成功');
//               }}
//             >
//               复制信息
//             </NButton>
//           ) : (
//             '无剪切板权限'
//           )}
//         </p>
//       </div>
//     )
//   });
// }

function operation({ status, account, id }) {
  const isDisable = status === 1;
  const content = isDisable
    ? `是否停用账号【${account}】？停用后将无法登录系统，请谨慎操作！`
    : `是否启用账号【${account}】？启用后该账号可以登录系统。`;
  window.$dialogWarning(content, () => AccountStatus([id], isDisable));
}

function AccountStatus(userIdList, isDisable) {
  return UpdateAccountStatus({ userIdList, status: isDisable ? 2 : 1 }).then(() => {
    window.$message.success('操作成功');
    getDataSource();
  });
}

function handleClick(key, row = {}) {
  switch (key) {
    case AC_DELETE:
      removeAccount(row);
      break;
    case AC_RESET:
      openModal(true, { row });
      break;
    case AC_EDIT:
      emit('open-modal', { key: AC_EDIT, row, type: formValue.type, govLevel: props.govLevel });
      break;
    case AC_ADD:
      emit('open-modal', { key: AC_ADD, type: formValue.type, govLevel: props.govLevel });
      break;
    case AC_STOP_START:
      operation(row);
      break;
    case 'AC_EXAMINE':
      openExamineModal(true, { row });
  }
}

async function getAreaList() {
  if (!curGovLevel) return;
  let res = await getSubordinateRegion({ areaId });
  if (curGovLevel == 1) {
    cityOpt.value = res;
    regOpt.value = res.reduce((perv, item) => {
      return perv.concat(item.childAreas);
    }, []);
  } else {
    regOpt.value = res;
  }
}

function areaChange() {
  if (props.govLevel == 4) {
    getSchList();
  } else {
    getOrgList();
  }
}

async function getOrgList() {
  let areaId = formValue.cityId || formValue.regionId;
  if (areaId) {
    formValue.orgId = null;
    let res = await getAreaOrgList({ areaId });
    orgOpt.value = res || [];
  }
}

async function getSchList() {
  let areaId = formValue.cityId || formValue.regionId;
  if (areaId) {
    formValue.orgId = null;
    let res = await getSchoolSelect({ regionId: areaId });
    schoolList.value = res || [];
  }
}

async function getRoleOptions() {
  const params = { orgId: formValue.orgId || orgId, type: !formValue.orgId ? 2 : null }; // orgId 有值时返回相应机构角色列表，无值时则返回运维角色

  const { records } = await GetRoleList(params);
  roleOpt.value = records;
}

const onSearch = () => {
  getDataSource();
};
const onReset = () => {
  Object.assign(formValue, { ...origin });
  getDataSource();
};

onMounted(async () => {
  getDataSource();
  getAreaList();
  getRoleOptions();
  if (isConsoleOrg.value) {
    orgOptions.value = await getAllOrgSelectBox({ orgName: '' });
  }
});
</script>

<style scoped lang="less">
.n-input {
  width: 200px;
}
:deep(.status-label) {
  font-size: 12px;
  .statusClass2 {
    color: #eb7347;
  }
  .statusClass0 {
    color: #c03639;
  }
  .statusClass1 {
    color: var(--primary-color);
  }
}
</style>
