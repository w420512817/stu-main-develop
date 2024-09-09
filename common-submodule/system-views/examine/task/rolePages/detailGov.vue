<template>
  <n-spin :show="loading">
    <n-form>
      <n-card title="任务详情" class="shadow-sm mb-3">
        <n-grid x-gap="10" :cols="3">
          <n-gi>
            <n-form-item label="任务名称"> {{ formValue.taskName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="开始日期-结束日期"> {{ formValue.startTime }} ~ {{ formValue.endTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="筛查设备"> {{ formValue.equipment?.join(',') || '/' }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建者"> {{ formValue.creatorName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="筛查类型"> {{ formValue.taskTypeLaber }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建机构"> {{ formValue.taskOrgName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建时间"> {{ formValue.createTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="应筛学生">
              {{ formValue.screenNum }} 人（{{ formValue.screenTypeLaber }}）
            </n-form-item>
          </n-gi>
          <!-- <n-gi v-if="formValue.planVO?.planMode == 1">
            <n-form-item label="数据控制"> 否 </n-form-item>
          </n-gi> -->
          <n-gi v-if="formValue.planVO?.planMode == 2" span="3">
            <n-form-item label="要求说明"> {{ formValue.planVO?.remark }} </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>
      <n-card title="筛查项目" class="shadow-sm mb-3">
        <n-card
          v-for="item in formValue.screeningOptions"
          :key="item.screeningTypeId"
          :bordered="false"
          size="small"
          :header-style="{ 'padding-left': 0, 'padding-right': 0 }"
          :content-style="{ 'padding-left': 0, 'padding-right': 0 }"
          :title="item.screeningTypeName"
        >
          <n-grid x-gap="10" :cols="3">
            <n-gi v-for="ele in item.itemList" :key="ele.id">
              <n-form-item :label="ele.screeningItemName" label-style="font-size:15px">
                {{ ele.selectionLaber }}
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-card>

      <n-card v-if="formValue.taskType === 102" title="筛查条件" class="shadow-sm mb-3">
        <n-card
          v-for="(item, i) in formValue.planVO.screeningConditionList"
          :key="i"
          :bordered="false"
          size="small"
          :title="`筛选条件${i + 1}`"
        >
          <n-grid x-gap="10" :cols="4">
            <n-gi>
              <n-form-item label="学校"> {{ item.orgName }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="年级"> {{ item.grade }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="班级"> {{ item.className }} </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="抽查人数"> {{ item.number }} 人 </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>
      </n-card>
      <n-card title="筛查进度" class="shadow-sm mb-3">
        <n-grid x-gap="10" :cols="3">
          <n-gi>
            <n-form-item label="学校"> {{ taskRate.orgName }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="应筛学生/人"> {{ taskRate.number }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="总进度"> {{ taskRate.rate }} %</n-form-item>
          </n-gi>
        </n-grid>
        <n-form label-placement="left" :model="formData">
          <n-grid :cols="4">
            <n-form-item-gi label="姓名：">
              <n-input v-model:value="formData.studentName" />
            </n-form-item-gi>
            <n-form-item-gi label="身份证：" ml-7>
              <n-input v-model:value="formData.idcard" />
            </n-form-item-gi>
            <n-form-item-gi ml-7>
              <search-buttons @search="handleSearch" @reset="onReset" />
            </n-form-item-gi>
          </n-grid>
        </n-form>
        <n-data-table
          remote
          striped
          :render-cell="v => v ?? '/'"
          :columns="stuColumns"
          :data="taskStuDetailList"
          :bordered="false"
          :pagination="pagination"
          :row-key="row => row.id"
          :row-class-name="row => (row.parentIsAgree == 0 && isConsentStatus ? 'disabled' : '')"
        />
      </n-card>
    </n-form>
    <InputDataModal :title="inputTitle" @register="registerInput" @on-success="getStuTableData" />
  </n-spin>
</template>

<script setup>
import { reactive, ref, onBeforeMount, provide } from 'vue';
import { useRoute } from 'vue-router';
import { screenPersonColumns, taskDetailColumns } from '../index.data.jsx';

import { getTaskDetail, getPlanTaskRate } from '@common/api/examine/task';
import InputDataModal from '../components/screening/inputDataModal.vue';

const { query } = useRoute();
provide('query', query);

const formValue = reactive({ planVO: {} });
const taskRate = reactive({});
const loading = ref(false);
const stuColumns = taskDetailColumns({ handleTableClick });

onBeforeMount(() => {
  getDetail();
});
const getDetail = async () => {
  const { id: taskId } = query;
  if (!taskId) return;
  loading.value = true;
  try {
    const res = await Promise.all([getTaskDetail({ taskId }), getPlanTaskRate({ taskId })]);
    Object.assign(formValue, res[0]);
    Object.assign(taskRate, res[1]);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  width: 45px;
}
</style>
