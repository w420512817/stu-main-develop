<template>
  <n-space vertical>
    <n-card
      class="shadow-sm mb-3"
      title="编辑任务"
      header-style="border-bottom: 1px solid #eee;margin-bottom: 1.5rem;font-size: 1rem;"
    >
      <template #header>
        <p class="font-bold">{{ state.edit ? '编辑' : '新增' }}筛查任务</p>
      </template>
      <q-suspense :loading="loading">
        <n-form>
          <n-grid cols="3" x-gap="100">
            <n-gi span="3"><div class="text-sm font-bold m-b-5">基本信息</div></n-gi>
            <n-form-item-gi label="任务名称" path="planName">
              {{ state.planName }}
            </n-form-item-gi>
            <n-form-item-gi label="任务日期" path="dateValue">
              {{ state.startTime }} - {{ state.endTime }}
            </n-form-item-gi>
            <n-form-item-gi label="任务范围" path="areaRange">
              {{ state.planRangeLaber }}
            </n-form-item-gi>
            <n-form-item-gi label="任务年级" path="gradeId">
              {{ state.gradeName }}
            </n-form-item-gi>
            <n-form-item-gi label="任务目标数" path="gradeId">
              {{ state.screenNum }}
            </n-form-item-gi>
            <n-form-item-gi label="要求说明">
              {{ state.remark }}
            </n-form-item-gi>
          </n-grid>
        </n-form>
        <!-- 计划模式才会展示 -->
        <screen-scope
          v-if="Object.keys(state.areaList).length"
          ref="screenScopeRef"
          :area-list="state.areaList"
          :area-range-checked="areaRange"
          :area-range="areaRange"
          :custom-disable="state.custonDisable"
          :columns="columns"
        />
      </q-suspense>
    </n-card>
    <n-card class="text-center mb-4">
      <n-button type="primary" :disabled="loading" :loading="editLoading" @click="submit">确定</n-button>
      <n-button class="ml-3" @click="goBack()">取消</n-button>
    </n-card>
  </n-space>
</template>
<script setup lang="jsx">
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { planInfo, editRegionTree } from '@common/api/examine/plan';
import { useGo } from '@common/hooks/usePage';
import { useTabs } from '@common/hooks/useTabs';
import useApi from '@common/hooks/business/useApi';
import screenScope from './components/screenScope.vue';
import QSuspense from '@common/qd-components/QSuspense/index.vue';
import { areaCreateTable } from './index.data';
import { showScreenNumWraning } from '../common.data';

const { fetch: editRegionTreeApi, loading: editLoading } = useApi(editRegionTree);
const { fetch: planInfoApi, loading } = useApi(planInfo);
const screenScopeRef = ref(null);

const { closeCurrent } = useTabs();
const { query } = useRoute();
const { go } = useGo();

let state = reactive({
  areaList: []
});
const columns = ref([]);
const areaRange = ref([]);

async function getDetail() {
  const res = await planInfoApi({
    planId: state.planId
  });
  Object.assign(state, res);
  state.areaList = [res.region];
  setAreaRange(state.areaList);
  state.custonDisable = !(res.planStatus != 1);
  columns.value = areaCreateTable(screenScopeRef, state);
}

function setAreaRange(tree) {
  let ids = [];
  let arr = [...tree];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    ids.push(item.regionId);
    if (item.children?.length) {
      arr.push(...item.children);
    }
  }
  areaRange.value = ids;
}

function submit() {
  validateTableNum();
  editRegion();
}

async function editRegion() {
  let region = screenScopeRef.value.getFieldValue()?.[0];
  await editRegionTreeApi({ region, planId: state.planId });
  window.$message.success('操作成功');
  goBack();
}

// 判断筛查指标 目标学生数量是否超过总数 弹出警告
function validateTableNum() {
  let res = screenScopeRef.value?.getFieldValue();
  let arr = [...res];
  let overstep = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.screeningNum > item.gradeNum && item.level === 4) {
      overstep.push(item);
    }
    if (item.children?.length) {
      arr.push(...item.children);
    }
  }
  if (overstep.length) {
    showScreenNumWraning(overstep, editRegion);
    throw Error('目标学生数量超过学生总数');
  }
}

function goBack() {
  closeCurrent();
  go('/examine/plan-manage', 'isReplace');
}

onMounted(async () => {
  if (query.planId) {
    state.planId = query.planId;
    state.edit = query.edit;
    // 先回显详情
    await getDetail();
    state.planMode = query.planMode;
  }
});
</script>
