<template>
  <basic-modal
    v-bind="$attrs"
    title="数据修改申请"
    class="w-600px"
    :mask-closable="false"
    :show-bottom="!isDetail"
    @ok="handleSubmit"
    @register="register"
    @after-leave="visibleChange"
  >
    <n-form
      ref="formRef"
      :model="formData"
      label-placement="left"
      label-width="130"
      label-align="right"
      require-mark-placement="left"
      :style="{
        maxWidth: '600px'
      }"
    >
      <div class="w-400px">
        <n-form-item label="任务类型：" flex-1>
          <span>学生数据修改</span>
        </n-form-item>
        <n-form-item label="筛查类型：" flex-1>
          <n-select
            v-if="isEdit"
            v-model:value="appType"
            placeholder="全部"
            :options="appNameOpt"
            clearable
            @update:value="changeAppType"
          />
          <span v-else>{{ AppNameEnum[formData.appType] || '/' }}</span>
        </n-form-item>
        <n-form-item label="选择任务：" path="taskId" flex-1 :rule="{ required: isEdit, message: '请选择' }">
          <n-select
            v-if="isEdit"
            v-model:value="formData.taskId"
            :options="planList"
            label-field="taskName"
            value-field="taskId"
            placeholder="请选择"
            filterable
            @update:value="planChange"
          />
          <span v-else>{{ formData.taskName || '/' }}</span>
        </n-form-item>
      </div>
      <n-form-item label="提交审核人：">
        {{ isEdit && !isReset ? userInfo.realName : formData.applicantName }}
      </n-form-item>
      <n-form-item label="提交审核时间：">
        {{ isEdit && !isReset ? formatToDate() : formData.applyTime }}
      </n-form-item>
      <n-form-item :label="isDetail ? '修改班级：' : '修改班级选择：'" :required="!isDetail">
        <q-suspense :loading="loading" w-full>
          <div max-h-180px overflow-y-auto w-full>
            <template v-if="isEdit || isReset">
              <n-collapse
                v-for="(item, i) in stuList"
                :key="item.gradeId"
                arrow-placement="right"
                :class="{ 'mt-4': i !== 0 }"
              >
                <n-collapse-item :title="item.gradeName">
                  <template #header>
                    <div class="nowrap-hidden">
                      <n-checkbox
                        :checked="item.checked"
                        :indeterminate="item.indeterminate"
                        @click.stop="selectAllSup(item)"
                      />
                      {{ item.gradeName }}
                    </div>
                  </template>
                  <div class="pl-6">
                    <n-collapse v-for="v in item.planClazz" :key="v.classId" arrow-placement="right" class="mb-4">
                      <n-collapse-item>
                        <template #header>
                          <div class="nowrap-hidden">
                            <n-checkbox
                              :checked="v.checked"
                              :indeterminate="v.indeterminate"
                              @click.stop="selectAll(v, item)"
                            />
                            {{ v.className }}
                          </div>
                        </template>
                        <n-checkbox-group v-model:value="v.stuIds" class="pl-6">
                          <n-space item-style="display: flex;">
                            <n-checkbox
                              v-for="subV in v.planStudents"
                              :key="subV.studentI"
                              :value="subV.studentId"
                              :label="subV.studentName"
                              @click.stop="changeS(v, item)"
                            />
                          </n-space>
                        </n-checkbox-group>
                      </n-collapse-item>
                    </n-collapse>
                  </div>
                </n-collapse-item>
              </n-collapse>
            </template>
            <template v-else>
              <div v-for="(item, i) in formData.gradeList" :key="item.gradeId" :class="{ 'mt-4': i !== 0 }">
                <div class="mb-2">{{ item.gradeName }}</div>
                <div class="pl-6">
                  <div v-for="v in item.planClazz" :key="v.classId" class="mt-4 flex">
                    <span flex-shrink-0>{{ v.className }}：</span>
                    <n-space item-style="display: flex;">
                      <span v-for="subV in v.planStudents" :key="subV.studentId">{{ subV.studentName }}</span>
                    </n-space>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-show="!formData.planId" class="text-error">需选择计划</div>
        </q-suspense>
      </n-form-item>
      <n-form-item label="提交审核原因：" class="w-500px">
        <n-input
          v-if="isEdit || isReset"
          v-model:value="formData.applyReason"
          maxlength="20"
          placeholder="请输入审核原因二十个字以内"
          show-count
          clearable
        />
        <span v-else>{{ formData.applyReason || '暂无' }}</span>
      </n-form-item>
      <n-form-item v-if="formData.remark" label="备注：" class="w-500px">
        <span>{{ formData.remark }}</span>
      </n-form-item>
    </n-form>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, nextTick, computed } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';
import useApi from '@common/hooks/business/useApi';
import { taskApply, getCheckPlan, studentList } from '@/api/verify/verifySchool';
import { auditPlanStudent } from '@/api/verify';
import { AC_DETAILS, AC_ADD, AC_RESET } from '@common/enum/pageEnum';
import { formatToDate } from '@common/utils/common/date';
import { cloneDeep } from 'lodash-es';
import { appNameOpt, AppNameEnum } from '../index.data.jsx';

const emits = defineEmits(['success', 'register']);

const { fetch: studentListApi, loading } = useApi(studentList);
const { userInfo } = useUserStore();
const [register, { closeModal, changeLoading, changeOkLoading }] = useModalInner(async data => {
  await nextTick();
  Object.assign(formData, data);
  if (isEdit.value) {
    getPlanList();
  } else {
    getAuditPlanStudent();
  }
});

const formRef = ref(null);

let preAppType;
const initForm = {
  appType: undefined,
  planId: undefined,
  taskId: undefined,
  approvalId: undefined,
  orgId: userInfo.orgId,
  approvedType: 2,
  screeningStudentData: undefined,
  applyReason: undefined,
  remark: undefined
};
const appType = ref();
const formData = reactive({ ...initForm });
const planList = ref([]);
const stuList = ref([]);
const isDetail = computed(() => {
  return formData.key === AC_DETAILS;
});
const isEdit = computed(() => {
  return formData.key === AC_ADD;
});
// 重新提交
const isReset = computed(() => {
  return formData.key === AC_RESET;
});

async function getAuditPlanStudent() {
  changeLoading();
  let res = await auditPlanStudent({ approvalId: formData.approvalId });
  if (isEdit.value || isReset.value) {
    stuList.value = res;
  } else {
    formData.gradeList = res;
  }

  changeLoading(false);
}

async function getPlanList() {
  let res = await getCheckPlan({ taskStatus: 1, appType: appType.value });
  planList.value = res || [];
}

function changeAppType(v) {
  if (v == preAppType) return;
  formData.taskId = null;
  stuList.value = [];
  getPlanList();
  preAppType = v;
}

async function planChange(taskId, opt) {
  formData.appType = opt?.appType;
  formData.planId = opt?.planId;
  // 学生数据修改 请求计划的学生列表
  if (taskId) {
    let res = await studentListApi({ taskId, planId: opt.planId });
    stuList.value = res;
  }
}

function selectAllSup(node) {
  if (node.indeterminate || (!node.indeterminate && !node.checked)) {
    node.planClazz.forEach(v => selectAll(v, node, true));
  } else {
    node.planClazz.forEach(v => selectAll(v, node, false));
  }
}

function selectAll(v, nodeSup, isAll) {
  isAll = isAll === undefined ? true : isAll;
  if (v.indeterminate || (!v.indeterminate && !v.checked && isAll)) {
    v.stuIds = v.planStudents.map(item => item.studentId);
  } else {
    v.stuIds = [];
  }
  changeS(v, nodeSup);
}

function changeNodeSup(node) {
  node.checked = node.planClazz.every(v => v.checked);
  node.indeterminate = node.planClazz.some(v => v.indeterminate || v.checked) && !node.checked;
}

function changeS(v, nodeSup) {
  v.checked = v.stuIds?.length === v.planStudents?.length;
  v.indeterminate = v.stuIds?.length && v.stuIds?.length !== v.planStudents?.length;
  changeNodeSup(nodeSup);
}

async function visibleChange() {
  resetForm();
}

function resetForm() {
  appType.value = undefined;
  stuList.value = [];
  Object.assign(formData, initForm);
}

async function handleSubmit() {
  await formRef.value.validate();
  changeLoading(true);
  changeOkLoading(true);
  try {
    let screeningStudentData = cloneDeep(stuList.value).filter(item => {
      item.planClazz = item.planClazz.filter(subItem => {
        subItem.planStudents = subItem.stuIds?.map(id => {
          let v = subItem.planStudents.find(threeItem => threeItem.studentId === id);
          return v;
        });

        return subItem.planStudents?.length;
      });
      return item.planClazz?.length;
    });
    if (+formData.approvedType === 2 && !screeningStudentData.length) {
      return window.$message.error('请选择需修改的学生');
    }
    await taskApply({ ...formData, screeningStudentData });
    emits('success');
    closeModal();
    window.$message.success('操作成功');
  } finally {
    changeLoading(false);
    changeOkLoading(false);
  }
}
</script>
