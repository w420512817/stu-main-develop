<template>
  <div class="flex h-full w-full">
    <n-card class="w-320px shadow-sm mr-3 h-700px overflow-auto">
      <h2 v-if="!isHos" class="font-bold mb-4 text-4">{{ currentSchool.name }}</h2>

      <!-- {{ currentSchool }} -->
      <dropdown-select
        v-if="isHos"
        ref="schoolRef"
        v-model:value="currentSchool.id"
        :list-api="schoolSelectBox"
        keyword="name"
        label-field="orgName"
        value-field="id"
        filterable
        class="mb-4"
        placeholder="请选择学校"
        @update:value="updateSchool"
      />
      <template v-if="!gradeEmpty">
        <collapse-item
          v-for="item in collapseData"
          :key="item.key"
          :select-id="selectId"
          :item="item"
          @update-value="updateCollapse"
        />
      </template>
      <div v-else mt-20><n-empty /></div>
    </n-card>
    <n-card class="h-full shadow-sm">
      <n-form inline label-placement="left" @keypress.enter="onSearch">
        <n-grid cols="2 md:2 xl:3 2xl:4 3xl:5" :x-gap="20" responsive="screen" :collapsed="gridCollapsed">
          <n-form-item-gi label="学年:">
            <dropdown-select
              ref="studyYearRef"
              v-model:value="formValue.studyYear"
              :list-api="getStudyYear"
              :filterable="false"
              keyword="name"
              :params="{ orgId: currentSchool.id }"
              label-field="studyYer"
              value-field="studyYer"
              placeholder="请选择学年"
            />
          </n-form-item-gi>
          <n-form-item-gi label="学生姓名:">
            <n-input v-model:value="formValue.studentName" type="text" placeholder="请输入学生姓名" />
          </n-form-item-gi>
          <n-form-item-gi label="性别:">
            <n-select v-model:value="formValue.sex" :options="sexOptions" type="text" placeholder="请选择性别" />
          </n-form-item-gi>
          <n-form-item-gi label="学籍号码:">
            <n-input v-model:value="formValue.registerNumber" type="text" placeholder="请输入学籍号码" />
          </n-form-item-gi>
          <n-gi suffix #="{ overflow }">
            <search-buttons
              breakpoint="3xl"
              has-collapsed
              :overflow="overflow"
              @search="onSearch"
              @reset="onReset"
              @collapse="gridCollapsed = !gridCollapsed"
            />
          </n-gi>
        </n-grid>
      </n-form>
      <n-space class="mb-4 mt-2 relative">
        <n-button v-if="hasPermission(9351)" type="primary" :disabled="!isLoginOrgan" @click="jumpTransferIn">
          转入管理
        </n-button>
        <n-button v-if="hasPermission(9354)" type="primary" :disabled="!isLoginOrgan" @click="jumpTransferOut">
          转出管理
        </n-button>
        <n-button
          v-if="hasPermission(9340)"
          type="primary"
          :disabled="!isLoginOrgan || studentStore.state?.state == 1 || studentStore.state?.state == 2"
          @click="
            openImportModel(true, {
              schoolId: currentSchool.id,
              schoolName: currentSchool.name,
              orgName: currentSchool.name,
              orgId: currentSchool.id,
              collapseData
            })
          "
        >
          导入
        </n-button>
        <n-button
          v-if="hasPermission(9340)"
          type="primary"
          :disabled="!isLoginOrgan || studentStore.state?.state == 1 || studentStore.state?.state == 2"
          @click="
            openImportModel(true, {
              schoolId: currentSchool.id,
              schoolName: currentSchool.name,
              orgName: currentSchool.name,
              orgId: currentSchool.id,
              collapseData,
              isDivideClass: true
            })
          "
        >
          分班导入
        </n-button>
        <n-button v-if="hasPermission(9341)" :disabled="!isLoginOrgan" type="primary" @click="onExport">导出</n-button>
        <n-button
          v-if="hasPermission(9343)"
          type="primary"
          :disabled="!isLoginOrgan"
          @click="
            openQRcoderModel(true, {
              checkRow,
              collapseData,
              orgId: currentSchool.id,
              orgProperty: orgProperty,
              accountOrgId: orgId,
              accountOrgType: orgType
            })
          "
        >
          打印学生二维码
        </n-button>
        <n-button v-if="hasPermission(9342)" type="primary" :disabled="!isLoginOrgan" @click="handleAdd">新增</n-button>
      </n-space>
      <n-data-table
        v-model:checked-row-keys="checkRow"
        remote
        :render-cell="v => v || '/'"
        :loading="loading"
        :columns="columns"
        :data="dataSource"
        :row-key="row => `${row.studentAttendId}-${row.studentName}`"
        :pagination="pagination"
      />
      <qrcodeModal @register="registerQRcodeModal" />
      <importModal @register="registerImportModal" />
      <importResult @register="registerResultModal" />
      <transferOutModal @register="registerTransfer" @on-success="onSearch" />
      <divideClassResModal @register="registerDivide" />
    </n-card>
  </div>
</template>
<script setup>
import { onMounted, onActivated, ref, reactive, watch, computed } from 'vue';
import { useThrottleFn } from '@vueuse/core';

import { useUserStore, useStudentStore } from '@/store';
import { usePermission } from '@common/hooks/business/usePermission';

// hooks
import usePagination from '@common/hooks/business/usePagination';
import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import { useGo } from '@common/hooks/usePage';

import { downloadFile } from '@common/utils/file/download';
// static data
import { AC_DETAILS, AC_DELETE, AC_REPORT, AC_TRUN_OUT } from '@common/enum/pageEnum';
import { createColumns } from './student.data';
import { sexOptions, transferCollapseData } from '../common.data';

// api
import { queryStudentList, deleteStudent, exportExcelList, getTaskDivideClass } from '@/api/information/student';
import { schoolTypesGradeClassTree } from '@/api/information/school';
import { schoolSelectBox } from '@/api/information';
import { getStudyYear } from '@/api/information/class';

import importModal from './components/import/importModal.vue';
import qrcodeModal from './components/qrcode/qrcodeModal.vue';
import transferOutModal from './components/transferOutModal.vue';
import collapseItem from './components/collapseItem.vue';
import importResult from './components/import/importResult.vue';
import divideClassResModal from './components/import/divideClassResModal.vue';

const origin = {
  studyYear: null,
  studentName: null,
  sex: null,
  registerNumber: null
};

const { hasPermission } = usePermission();
const {
  userInfo: { orgId, orgName, orgType }
} = useUserStore();
const studentStore = useStudentStore();
const collapseData = ref([]);
const selectId = ref();
const checkRow = ref([]);
const schoolRef = ref();
const studyYearRef = ref();
const currentSchool = reactive({
  name: '',
  id: ''
});

const gradeEmpty = computed(() => {
  return !collapseData.value.length;
});

const isHos = computed(() => {
  return orgType == 20;
});

const isSchool = computed(() => {
  return orgType == 10;
});

function updateCollapse(row) {
  selectId.value = row.key;
  Object.assign(organValue, row);
  setPage(1);
  getDataSource();
}
const gridCollapsed = ref(true);
const organValue = reactive({
  gradeId: null,
  classId: null,
  schoolTypes: null
});
const formValue = reactive({ ...origin });
const dataSource = ref([]);
const [registerImportModal, { openModal: openImportModel }] = useModal();
const [registerResultModal, { openModal: openResultModel, closeModal: closeResultModal }] = useModal();

const [registerTransfer, { openModal: openTransferModel }] = useModal();
const [registerQRcodeModal, { openModal: openQRcoderModel }] = useModal();
const [registerDivide, { openModal: openDivideModal }] = useModal();
const { fetch: getList, loading } = useApi(queryStudentList);
const { go } = useGo();
const { pagination, setCount, setPage } = usePagination(() => {
  getDataSource();
});
// 是否是登录的组织 或者是医院并且还能查出学校
const isLoginOrgan = computed(() => {
  return orgId == currentSchool.id || (isHos.value && currentSchool.id);
});

const columns = createColumns((key, row) => onClickBtn(key, row), isLoginOrgan);

function updateSchool(OrgId = null, option) {
  selectId.value = null;
  getCollapseData(OrgId, option.orgName);
}

function handleAdd() {
  go({ path: '/information/student-modify', query: { schoolId: currentSchool.id, schoolName: currentSchool.name } });
}

const onExport = async () => {
  const { page: current, pageSize: size } = pagination;
  const params = {
    schoolId: currentSchool.id,
    ...formValue,
    ...organValue,
    children: null,
    current,
    size
  };
  const res = await exportExcelList(params);
  res && downloadFile(res.data, '学生信息表', 'xlsx');
};
// 跳转到转出管理
const jumpTransferOut = () => {
  go({
    name: 'StudentTransferOut',
    query: {
      orgId: currentSchool.id
    }
  });
};
// 跳转到转入管理
const jumpTransferIn = () => {
  go({
    name: 'StudentTransferIn',
    query: {
      orgId: currentSchool.id
    }
  });
};

/**
 * 点击操作区
 * @param key 操作按钮的 key 值
 * @param row 操作按钮对应的行信息
 */
function onClickBtn(key, row) {
  switch (key) {
    case AC_DETAILS:
      go({
        path: '/information/student-detail',
        query: {
          id: row.studentBaseId,
          edit: isLoginOrgan.value
        }
      });
      break;
    case AC_REPORT:
      go({
        path: '/information/student-report',
        query: {
          id: row.studentAttendId,
          school: currentSchool.id
        }
      });
      break;
    case AC_TRUN_OUT:
      turnOut(row);
      break;
    case AC_DELETE:
      deleteRow(row);
      break;
  }
}
function turnOut(row) {
  const {
    studentName,
    sex,
    gradeId: originalGradeId,
    gradeName: originalGradeName,
    classId: originalClassId,
    className: originalClassName,
    schoolTypes,
    studentAttendId
  } = row;
  const params = {
    studentName,
    sex,
    originalSchoolId: currentSchool.id,
    originalSchoolName: currentSchool.name,
    originalSchoolTypes: schoolTypes,
    originalGradeId,
    originalGradeName,
    originalClassId,
    originalClassName,
    studentAttendId
  };
  openTransferModel(true, { params });
}
function deleteRow(row) {
  const { studentAttendId } = row;
  window.$dialogError('是否删除？', () => {
    return deleteStudent({ studentAttendId }).then(() => {
      window.$message.success('删除成功');
      onSearch();
    });
  });
}
/**
 * 获取 table 数据
 */
async function getDataSource() {
  if (gradeEmpty.value) {
    dataSource.value = [];
    setCount(0);
    return;
  }
  const { page: current, pageSize: size } = pagination;
  const params = {
    schoolId: currentSchool.id,
    ...formValue,
    ...organValue,
    children: null,
    current,
    size
  };

  const data = await getList(params);
  dataSource.value = data?.records ?? [];
  setCount(~~data.total);
}
const onSearch = useThrottleFn(() => {
  setPage(1);
  getDataSource();
}, 800);
function onReset() {
  selectId.value = null;
  Object.assign(organValue, {
    gradeId: null,
    classId: null,
    schoolTypes: null
  });
  Object.assign(formValue, origin);
  onSearch();
}
const getCollapseData = async (orgId, name) => {
  const detail = await schoolTypesGradeClassTree({ orgId });
  currentSchool.id = orgId;
  currentSchool.name = name;
  if (detail) {
    const data = transferCollapseData(detail);
    collapseData.value = data;
    getDataSource();
  }
};
const getInitOptions = async () => {
  await schoolRef.value?.getOptions();
  if (!schoolRef.value?.options[0]) return;
  let { id, orgName } = schoolRef.value.options[0];
  await getCollapseData(id, orgName);
  studyYearRef.value?.getOptions();
};

watch(
  () => studentStore.showResultModal,
  () => {
    if (studentStore.showResultModal) {
      openResultModel();
    } else {
      closeResultModal();
    }
  }
);

watch(
  () => studentStore.state,
  async () => {
    let { isDivideClass, isConfirmDivideClass, state, taskId } = studentStore.state;
    if (isConfirmDivideClass == 0 && state == 3 && isDivideClass == 1) {
      let res = await getTaskDivideClass({ orgId, taskId });
      res?.length && openDivideModal(true, { stuList: res, taskId });
    }
  }
);

watch(
  () => studentStore.isStartTimer,
  () => {
    if (!studentStore.isStartTimer) {
      onSearch();
    }
  }
);
onMounted(() => {
  getInitOptions();
  if (isSchool.value) {
    getCollapseData(orgId, orgName);
    studyYearRef.value?.getOptions();
  }
});

onActivated(() => {
  getDataSource();
});

defineOptions({
  name: 'StudentInformation'
});
</script>
