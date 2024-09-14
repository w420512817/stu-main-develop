<template>
  <n-spin :show="state.loading">
    <n-form>
      <detailCommon :form-value="state.detail" :plan-name="planName">
        <n-gi v-if="query.planMode == 1">
          <n-form-item label="应用组名称">
            <q-ellipsis>
              {{ state.detail?.appGroupName }}
            </q-ellipsis>
          </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 2">
          <n-form-item label="任务年级"> {{ state.detail?.gradeName }} </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item :label="`${planName}范围`">
            <q-ellipsis>
              {{ state.detail?.planRangeLaber }}
            </q-ellipsis>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="创建者">
            {{ state.detail?.creatorName }}
          </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 1">
          <n-form-item label="创建机构"> {{ state.detail?.creatorOrgName }} </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="创建时间"> {{ state.detail?.createTime }} </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 1">
          <n-form-item label="合格率指标">
            {{ state.detail?.checkNum ? state.detail?.checkNum + '%' : '/' }}
          </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 1">
          <n-form-item label="应筛学生">
            {{ state.detail?.screenNum ? state.detail?.screenNum : '--' }}人({{
              state.detail?.screenType == 1 ? '手动录入' : '系统录入'
            }})
          </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 1">
          <n-form-item label="数据控制">
            {{ state.detail?.control == 1 ? '开启' : '关闭' }}
          </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 2">
          <n-form-item label="学生总数"> {{ state.detail?.studentNum }} </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 2">
          <n-form-item label="任务目标数"> {{ state.detail?.screenNum }} </n-form-item>
        </n-gi>
        <n-gi v-if="query.planMode == 2">
          <n-form-item label="要求说明"> {{ state.detail?.remark }} </n-form-item>
        </n-gi>
      </detailCommon>

      <n-card title="筛查概览" class="shadow-sm mb-3">
        <div class="p-2 border border-gray-300 flex items-center justify-around w-100 rounded">
          <div class="m-r-10 leading-10">
            <p>学校总数:{{ state.dashboard.schoolCount }}</p>
            <p>应筛查人数:{{ state.dashboard.studentCount }}</p>
            <p>
              {{ `已完成筛查${state.nowLevel == 3 ? '学校' : state.nowLevel == 1 ? '城市' : '区'}` }}:{{
                state.dashboard.haveScreeningNum
              }}
            </p>
            <p>
              {{ `未完成筛查${state.nowLevel == 3 ? '学校' : state.nowLevel == 1 ? '城市' : '区'}` }}:{{
                state.dashboard.onScreeningNum
              }}
            </p>
            <p>
              {{ `未开始筛查${state.nowLevel == 3 ? '学校' : state.nowLevel == 1 ? '城市' : '区'}` }}:{{
                state.dashboard.notStartedScreeningNum
              }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center leading-8">
            <p>筛查率</p>
            <n-progress type="circle" :percentage="state.dashboard.rate * 1">
              <span style="text-align: center">
                {{ state.dashboard.rate }}% <br />
                总筛查率
              </span>
            </n-progress>
            <p>已筛查:{{ state.dashboard.haveScreeningCount }}</p>
            <p>未筛查:{{ state.dashboard.notScreeningCount }}</p>
          </div>
        </div>
      </n-card>
      <n-card
        :title="`各${state.nowLevel == 3 ? '学校' : state.nowLevel == 1 ? '地市' : '区'}筛查进度`"
        class="shadow-sm mb-3"
      >
        <template #header-extra>
          <n-button v-if="state.originAreaId != state.nowAreaId" type="primary" text @click="backLevel()">
            返回上一级
          </n-button>
        </template>

        <n-spin v-if="state.nowLevel != 3" :show="state.levelLoading">
          <div class="w-full">
            <template v-if="state.levelData.length">
              <div
                v-for="item in state.levelData"
                :key="item.areaId"
                class="w-full p-5 box-border border-b-1 border-gray-200"
              >
                <div class="w-full flex items-center justify-between">
                  <div class="w-1/4 text-center">{{ item.areaName }}</div>
                  <div class="w-1/4 text-center">应筛学校/所</div>
                  <div class="w-1/4 text-center">应筛学生/人</div>
                  <div class="w-1/4 text-center">总进度</div>
                </div>
                <div class="w-full flex items-center justify-between">
                  <div class="w-1/4 text-center">
                    <n-button type="primary" size="small" @click="goNextLevel(item)">详情</n-button>
                  </div>
                  <div class="w-1/4 text-center">{{ item.schoolCount }}</div>
                  <div class="w-1/4 text-center">{{ item.studentCount }}</div>
                  <div class="w-1/4 text-center">{{ item.rate }}%</div>
                </div>
              </div>
            </template>
            <n-empty v-else />
          </div>
        </n-spin>
        <n-spin v-if="state.nowLevel == 3" :show="state.levelLoading">
          <div class="w-full">
            <n-table :bordered="false" :single-line="false" class="text-center">
              <thead>
                <tr>
                  <th>学校名称</th>
                  <th>应筛学生</th>
                  <th>任务状态</th>
                  <th>学校属性</th>
                  <th>学段</th>
                  <th>学校级别</th>
                  <th>筛查进度</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in state.schoolData" :key="item.orgId">
                  <td>{{ item.orgName }}</td>
                  <td>{{ item.studentCount }}</td>
                  <td>{{ item.statusLaber }}</td>
                  <td>{{ item.orgPropertyLaber }}</td>
                  <td>{{ item.prefx }}</td>
                  <td>{{ item.schoolLevelLaber }}</td>
                  <td>{{ item.rate }}%</td>
                </tr>
              </tbody>
            </n-table>
            <div class="flex flex-row-reverse m-t-2 p-r-15">
              <n-pagination v-model:page="state.current" :page-count="state.pageCount" @update:page="pageChange" />
            </div>
          </div>
        </n-spin>
      </n-card>
    </n-form>
  </n-spin>
</template>

<script setup>
import { reactive, provide, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import detailCommon from '../components/detailCommon.vue';
import {
  planInfo,
  getScreningRate,
  getScreningRateInfoForArea,
  getScreningRateInfoForRegion
} from '@common/api/examine/plan';
const {
  userInfo: { govLevel, areaId }
} = useUserStore();
const { query } = useRoute();
provide('query', query);
const state = reactive({
  levelLoading: false,
  nowLevel: '',
  nowAreaId: '',
  levelData: [],
  schoolData: [],
  originAreaId: '',
  planId: '',
  loading: false,
  detail: {},
  necessItem: '',
  selecItem: '',
  percentage: 50,
  dashboard: {},
  current: 1,
  size: 15,
  pageCount: 1
});

// 根据选择的筛查模式来显示文案是 计划还是任务
const planName = computed(() => {
  return query.planMode == 2 ? '任务' : '计划';
});

function getDetail() {
  state.loading = true;
  planInfo({
    planId: state.planId
  })
    .then(d => {
      let isDetailMin = govLevel < d.areaLevel || '1';
      state.nowLevel = isDetailMin ? d.areaLevel : govLevel;
      state.nowAreaId = isDetailMin ? d.areaId : areaId;
      state.originAreaId = isDetailMin ? d.areaId : areaId;
      state.detail = d;
      dealData(d);
      getLevelData();
    })
    .finally(() => {
      state.loading = false;
    });
}
function getDash() {
  getScreningRate({
    planId: state.planId,
    level: state.nowLevel,
    areaId: state.nowAreaId
  }).then(d => {
    state.dashboard = d;
  });
}
function dealData(d) {
  let { nece, sele } = d.screeningOptions.reduce(
    (perv, v) => {
      v.itemList.forEach(vv => {
        if (vv.selection == 1) {
          perv.nece.push(vv.screeningItemName);
        }
        if (vv.selection == 2) {
          perv.sele.push(vv.screeningItemName);
        }
      });
      return perv;
    },
    { nece: [], sele: [] }
  );
  state.necessItem = nece.join(',');
  state.selecItem = sele.join(',');
}

function getLevelData() {
  if (state.nowLevel == 1 || state.nowLevel == 2) {
    state.levelLoading = true;
    getScreningRateInfoForArea({
      planId: state.planId,
      level: state.nowLevel,
      areaId: state.nowAreaId
    })
      .then(d => {
        state.levelData = d;
      })
      .finally(() => {
        state.levelLoading = false;
      });
  } else {
    state.current = 1;
    state.levelLoading = true;
    getScreningRateInfoForRegion({
      planId: state.planId,
      areaId: state.originAreaId,
      current: state.current,
      size: state.size
    })
      .then(d => {
        state.pageCount = d.pages;
        state.schoolData = d.list;
      })
      .finally(() => {
        state.levelLoading = false;
      });
  }
  getDash();
}
function goNextLevel(item) {
  if (item.areaId.substring(4, 6) == '00') {
    state.nowLevel = '2';
    state.nowAreaId = item.areaId;
    state.levelLoading = true;
    getScreningRateInfoForArea({
      planId: state.planId,
      level: '2',
      areaId: item.areaId
    })
      .then(d => {
        state.levelData = d;
      })
      .finally(() => {
        state.levelLoading = false;
      });
  } else {
    state.nowLevel = '3';
    state.nowAreaId = item.areaId;
    state.current = 1;
    state.levelLoading = true;
    getScreningRateInfoForRegion({
      planId: state.planId,
      areaId: item.areaId,
      current: state.current,
      size: state.size
    })
      .then(d => {
        state.pageCount = d.pages;
        state.schoolData = d.list;
      })
      .finally(() => {
        state.levelLoading = false;
      });
  }
  getDash();
}
function pageChange() {
  state.levelLoading = true;
  getScreningRateInfoForRegion({
    planId: state.planId,
    areaId: state.nowAreaId,
    current: state.current,
    size: state.size
  })
    .then(d => {
      state.pageCount = d.pages;
      state.schoolData = d.list;
    })
    .finally(() => {
      state.levelLoading = false;
    });
}
function backLevel() {
  if (state.nowLevel == '3') {
    state.nowLevel = '2';
    state.nowAreaId = state.nowAreaId.substring(0, 4) + '00';
  } else if (state.nowLevel == '2') {
    state.nowLevel = '1';
    state.nowAreaId = state.nowAreaId.substring(0, 2) + '0000';
  }
  state.levelLoading = true;
  getScreningRateInfoForArea({
    planId: state.planId,
    level: state.nowLevel,
    areaId: state.nowAreaId
  })
    .then(d => {
      state.levelData = d;
    })
    .finally(() => {
      state.levelLoading = false;
    });
  getDash();
}

onMounted(() => {
  state.planId = query.planId;
  getDetail();
});
</script>
