<template>
  <div class="text-8">
    <n-spin :show="loading">
      <n-form>
        <detailCommon :form-value="formValue">
          <n-gi>
            <n-form-item label="计划范围"> {{ formValue.planRangeLaber }} </n-form-item>
          </n-gi>
          <!-- <n-gi>
            <n-form-item label="应筛查学生"> {{ formValue.screenNum }} 人 </n-form-item>
          </n-gi> -->
          <n-gi>
            <n-form-item label="创建时间"> {{ formValue.createTime }} </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="创建机构"> {{ formValue.creatorOrgName }} </n-form-item>
          </n-gi>
          <!-- <n-gi>
            <n-form-item label="创建者"> {{ formValue.creatorName }} </n-form-item>
          </n-gi> -->
          <n-gi v-if="['HOSPITAL', 'SOCIAL'].includes(userOrgType)">
            <n-form-item label="学校名称"> {{ formValue.schoolName }} </n-form-item>
          </n-gi>
        </detailCommon>

        <n-card :title="`筛查进度 ${taskData.title || ''}`" class="bolder-card shadow-sm mb-3">
          <n-grid x-gap="10" :cols="2">
            <n-gi>
              <n-card :bordered="false" size="small">
                <template #header>
                  <n-space>
                    <span>学生概况</span>
                    <n-popover trigger="hover">
                      <template #trigger>
                        <icon-bi:question-circle class="cursor-pointer text-4" />
                      </template>
                      <n-space vertical>
                        <span> 筛查进度 = 已筛查学生数量 / 应筛查学生数量；</span>
                        <span> 计划筛查：表示本次计划覆盖的在读学生数量；</span>
                        <span> 不可筛查：表示因请假等原因无法参与筛查的学生数量；</span>
                        <span> 应筛查 = 系统算法？“计划筛查学生 - 不可筛查学生”：“创建计划和任务时手动录入”；</span>
                        <span> 未开始：表示未开始筛查的学生数量；</span>
                        <span> 进行中：表示正在进行筛查的学生数量；</span>
                        <span> 已筛查：表示已完成所有必查项筛查的学生数量。</span>
                      </n-space>
                    </n-popover>
                  </n-space>
                </template>

                <n-grid x-gap="10" :cols="3">
                  <n-gi>
                    <n-progress
                      type="circle"
                      :percentage="taskData.studentRate"
                      :offset-degree="180"
                      :stroke-width="10"
                    >
                      <n-space vertical class="text-center">
                        <span>筛查进度</span>
                        <span>{{ taskData.studentRate }} %</span>
                      </n-space>
                    </n-progress>
                  </n-gi>
                  <n-gi :span="2">
                    <n-grid x-gap="10" y-gap="20" :cols="2">
                      <n-gi> 计划筛查：{{ taskData.planScreeningNum }} 人 </n-gi>
                      <n-gi> 不可筛查：{{ taskData.notScreeningNum }} 人 </n-gi>
                      <n-gi> 应筛查：{{ taskData.shouldScreeningNum }} 人 </n-gi>
                      <n-gi> 未开始：{{ taskData.notStartedScreeningNum }} 人 </n-gi>
                      <n-gi> 进行中：{{ taskData.onScreeningNum }} 人 </n-gi>
                      <n-gi> 已筛查：{{ taskData.haveScreeningNum }} 人 </n-gi>
                    </n-grid>
                  </n-gi>
                </n-grid>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card :bordered="false" size="small">
                <template #header>
                  <n-space>
                    <span>任务概况</span>
                    <n-popover trigger="hover">
                      <template #trigger>
                        <icon-bi:question-circle class="cursor-pointer text-4" />
                      </template>
                      <n-space vertical>
                        <span> 筛查进度 = 已完成任务数量 / 全部任务数量；</span>
                        <span> 全部任务：表示本次计划内已创建的任务数量；</span>
                        <span> 待开始：表示未达到开始日期的任务数量；</span>
                        <span> 未开始：表示未开始筛查的任务数量；</span>
                        <span> 进行中：表示正在进行筛查的任务数量；</span>
                        <span> 已完成：表示已完成筛查的任务数量。</span>
                      </n-space>
                    </n-popover>
                  </n-space>
                </template>
                <n-grid x-gap="10" :cols="3">
                  <n-gi>
                    <n-progress type="circle" :percentage="taskData.taskRate" :offset-degree="180" :stroke-width="10">
                      <n-space vertical class="text-center">
                        <span>筛查进度</span>
                        <span>{{ taskData.taskRate }} %</span>
                      </n-space>
                    </n-progress>
                  </n-gi>
                  <n-gi :span="2">
                    <n-grid x-gap="10" y-gap="20" :cols="2">
                      <n-gi> 全部任务：{{ taskData.planScreeningTask }} 项 </n-gi>
                      <n-gi> 待开始：{{ taskData.toStartScreeningTask }} 项 </n-gi>
                      <n-gi> 未开始：{{ taskData.notStartedScreeningTask }} 项 </n-gi>
                      <n-gi> 进行中：{{ taskData.onScreeningTask }} 项 </n-gi>
                      <n-gi> 已超时：{{ taskData.overTimeScreeningTask }} 项 </n-gi>
                      <n-gi> 已完成：{{ taskData.haveScreeningTask }} 项 </n-gi>
                    </n-grid>
                  </n-gi>
                </n-grid>
              </n-card>
            </n-gi>
          </n-grid>
          <div class="mt-20px">
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
          </div>

          <n-data-table
            striped
            remote
            :render-cell="v => v ?? '/'"
            :columns="columns"
            :data="planStuDetailList"
            :bordered="false"
            :pagination="pagination"
            :loading="tableLoading"
          />
        </n-card>
      </n-form>
    </n-spin>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, provide, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import detailCommon from '../components/detailCommon.vue';
import { useUserStore } from '@/store';
import useApi from '@common/hooks/business/useApi';
import useLoading from '@common/hooks/useLoading';
import usePagination from '@common/hooks/business/usePagination';

import { getPlanDetail, getPlanScreenRate, getPlanScreenStuList } from '@common/api/examine/plan';

import { planDetailColumns, textFormat } from '../index.data.jsx';
const { userOrgType } = useUserStore();

const { startLoading, endLoading, loading } = useLoading();
const { fetch: getListApi, loading: tableLoading } = useApi(getPlanScreenStuList);
const { pagination, setCount, setPage } = usePagination(() => {
  getTableData();
});

const originData = {
  studentName: null,
  idcard: null
};

const formData = reactive({ ...originData });
const { query } = useRoute();
const { orgId } = query;
provide('query', query);

const formValue = reactive({});
const taskData = reactive({});
// const tableData = reactive([]);
const columns = planDetailColumns();
const planStuDetailList = ref([]);
const getDetail = async () => {
  startLoading();
  try {
    const { planId } = query;
    if (!planId) return;
    const [plan, task] = await Promise.all([
      getPlanDetail({ planId, schoolId: orgId }),
      getPlanScreenRate({ planId, orgId }),
      getTableData()
    ]);

    Object.assign(formValue, plan);
    Object.assign(taskData, task);
    formValue.screeningConditionList?.forEach(item => {
      Object.keys(item).forEach(key => {
        item[key] = textFormat(item[key]);
      });
    });
  } finally {
    endLoading();
  }
};
const getTableData = async () => {
  const { planId } = query;
  const { page: current, pageSize: size } = pagination;
  const params = {
    ...toRaw(formData),
    planId,
    orgId,
    current,
    size
  };
  let data = await getListApi(params);
  planStuDetailList.value = data?.records ?? [];
  setCount(+data.total);
};

function handleSearch() {
  setPage(1);
  getTableData();
}

function onReset() {
  Object.assign(formData, originData);
  setPage(1);
  getTableData();
}

onBeforeMount(async () => {
  getDetail();
});
</script>

<style scoped lang="less"></style>
