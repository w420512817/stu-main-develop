<template>
  <n-space vertical class="student-report-page">
    <n-card>
      <n-spin :show="loadingInfo">
        <n-descriptions label-placement="left" :column="4" label-style="font-weight: bold">
          <n-descriptions-item label="学生姓名">{{ formValue.studentName || '/' }}</n-descriptions-item>
          <n-descriptions-item label="性别">{{ formValue.sexName || '/' }}</n-descriptions-item>
          <n-descriptions-item label="学年">{{ formValue.studyYear || '/' }}</n-descriptions-item>
          <n-descriptions-item label="班级">{{ formValue.className || '/' }}</n-descriptions-item>
          <n-descriptions-item label="学籍号码">{{ formValue.registerNumber || '/' }}</n-descriptions-item>
          <n-descriptions-item label="年龄">{{ formValue.age }}岁</n-descriptions-item>
          <n-descriptions-item label="民族">{{ formValue.nationality || '/' }}</n-descriptions-item>
          <n-descriptions-item label="籍贯">{{ formValue.nativePlace || '/' }}</n-descriptions-item>
        </n-descriptions>
      </n-spin>
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <div class="flex leading-8">
          <p class="font-bold mr-4">健康趋势</p>
          <n-select
            v-model:value="state.appType"
            size="small"
            placeholder="视力筛查"
            class="w-50"
            :options="state.appTypes"
            label-field="typeLaber"
            value-field="type"
            @update:value="updateAppType"
          />
        </div>
      </template>
      <n-tabs
        v-if="state.appType"
        ref="tabsInstRef"
        v-model:value="state.curTab"
        class="bg-tabs"
        display-directive="show:lazy"
        @update:value="updateTab"
      >
        <n-tab-pane
          v-for="(item, index) in trendChartTabs[state.appType]?.list"
          :key="index"
          :name="item.value"
          :tab="item.label"
        />
      </n-tabs>
      <LineChartVision
        v-if="state.appType == 1"
        height="250px"
        width="100%"
        :trend-chart="state.trendChart1"
        :loading="loadingChart"
      />
      <LineChartCaries
        v-else-if="state.appType == 2"
        height="250px"
        width="100%"
        :trend-chart="state.trendChart2"
        :loading="loadingChart"
        :label="chartlabel"
      />

      <LineChartExam
        v-else-if="state.appType == 3"
        height="250px"
        width="100%"
        :trend-chart="state.trendChart3"
        :loading="loadingChart"
        :label="chartlabel"
      />
      <LineChartTest
        v-else-if="state.appType == 4"
        height="250px"
        width="100%"
        :trend-chart="state.trendChart4"
        :loading="loadingChart"
        :label="chartlabel"
      />
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <div class="flex leading-8 justify-between mb-3">
          <div class="flex">
            <p class="font-bold mr-2.5">健康信息</p>
            <n-select
              v-model:value="state.planId"
              size="small"
              placeholder="请选择计划"
              class="w-50"
              :options="planlist"
              value-field="planId"
              label-field="planName"
              @update:value="changeScreens"
            />
            <!-- :options="planlist?.records" -->
          </div>
          <n-button v-auth="9348" type="primary" @click="openPlanModel(true, healthInformation)"> 计划详情 </n-button>
        </div>
      </template>

      <!--计划详情内容，接口返回内容显示-->
      <!-- {{ healthInformation }}{{ state.screeningOptions1 }} -->
      <div :class="{ 'overflow-hidden max-h-45': !toggle }" relative>
        <p absolute right-0 top-0>{{ healthInformation.screeningTime || '' }}</p>
        <reportInfo :state="state" :health-info-list="healthInfoList" :form-value="formValue" />
      </div>
      <p
        v-if="
          healthInformation.eyesight ||
          healthInformation.caries ||
          healthInformation.physical ||
          healthInformation.checkup ||
          healthInformation.spine
        "
        class="text-primary text-center cursor-pointer"
        @click="toggle = !toggle"
      >
        <span>{{ toggle ? '收起' : '展开全部' }}</span>
        <icon-carbon:chevron-up v-if="toggle" class="inline" />
        <icon-carbon:chevron-down v-else class="inline" />
      </p>
    </n-card>
    <n-card class="shadow-sm mb-3" header-style="border-bottom: 1px solid #eee;margin-bottom: 2em;font-size: 1.1em;">
      <template #header>
        <div class="flex leading-8">
          <p class="font-bold mr-4">健康报告</p>
        </div>
      </template>
      <n-steps vertical :current="10" status="process" size="small">
        <template #finish-icon><icon-ic:baseline-circle /></template>
        <n-step v-for="(item, index) in state.groupPlan" :key="index">
          <template #title>
            <span class="text-primary">{{ item.year || 2021 }}</span>
          </template>
          <div class="releative ml-13 -mt-10 flex flex-wrap">
            <n-card
              v-for="(subitem, subIdx) in item.list"
              :key="subIdx"
              size="small"
              class="m-3 w-2/7"
              cursor-pointer
              @click="downloadExcel(subitem)"
            >
              <div class="flex justify-between">{{ subitem.planName }}<icon-ion:download-outline class="text-5" /></div>
              <div>筛查日期：{{ subitem.startTime?.split(' ')[0] ?? '/' }}</div>
            </n-card>
          </div>
        </n-step>
      </n-steps>
    </n-card>
    <planModal @register="registerPlanModal" />

    <!-- 学生正脊报告 -->
    <studentSpineReport @register="registerSpineReport" />
  </n-space>
</template>
<script setup>
import { ref, onBeforeMount, reactive, unref, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { physicalMap } from './student.data';
import { downloadFile } from '@common/utils/file/download';

import { AppTypeEnum } from '@common/enum/pageEnum';

import {
  getStudentInfo,
  getPlanList,
  getVisionTrendChart,
  getHealthInformation,
  exportStudentScreeningtExcel,
  getPlanScreeningType,
  getCariesTrendChart,
  getPhysicalTrendChart,
  getCheckUpTrendChart,
  getHistoryScreening
} from '@/api/information/student';

import { useModal } from '@common/components/custom/Modal';
import useApi from '@common/hooks/business/useApi';
import useLoading from '@common/hooks/useLoading.js';

import planModal from './components/planModal.vue';
import LineChartVision from './components/LineChartVision.vue'; // 视力
import LineChartCaries from './components/LineChartCaries.vue'; // 龋齿
import LineChartExam from './components/LineChartExam.vue'; // 体检
import LineChartTest from './components/LineChartTest.vue'; // 体测
import studentSpineReport from './components/print/studentSpineReport.vue'; // 正脊学生报告
import reportInfo from './components/reportInfo.vue';

const [registerPlanModal, { openModal: openPlanModel }] = useModal();
const [registerSpineReport, { openModal: openSpineReport }] = useModal();
const { query } = useRoute();
const { fetch: fetchStudentInfo, loading: loadingInfo, result: studentInfo } = useApi(getStudentInfo);
const { fetch: fetchPlan, result: planlist } = useApi(getPlanList);
console.log(planlist, 'planlist');
const { fetch: fetchVisionChart } = useApi(getVisionTrendChart);
const { fetch: fetchCariesChart } = useApi(getCariesTrendChart);
const { fetch: fetchPhysicalChart } = useApi(getPhysicalTrendChart);
const { fetch: fetchCheckUpChart } = useApi(getCheckUpTrendChart);

const { fetch: fetchHealth } = useApi(getHealthInformation);
const { fetch: fetchScreenType } = useApi(getPlanScreeningType);

const { loading: loadingChart, startLoading, endLoading } = useLoading();

const tabOrigin = [
  { label: '体重指数', value: 1 },
  { label: '肺活量', value: 2 },
  { label: '1000米跑', value: 3 },
  { label: '50米*8往返跑', value: 4 },
  { label: '引体向上', value: 5 },
  { label: '坐立体前屈', value: 6 },
  { label: '50米跑', value: 7 },
  { label: '立定跳远', value: 8 },
  { label: '1分钟跳绳', value: 9 },
  { label: '1分钟仰卧起坐', value: 10 },
  { label: '800米跑', value: 11 }
];
const trendChartTabs = reactive({
  1: {
    list: [
      { label: '裸眼视力', value: 1 },
      { label: '球镜', value: 2 },
      { label: '柱镜', value: 3 }
    ],
    api: fetchVisionChart
  },
  2: {
    list: [
      { label: '牙周问题', value: 1 },
      { label: '龋齿', value: 2 }
    ],
    api: fetchCariesChart
  },
  3: {
    list: [
      { label: '身高', value: 1 },
      { label: '体重', value: 2 },
      { label: '胸围', value: 3 },
      { label: '腰围', value: 4 },
      { label: '臀围', value: 5 }
    ],
    api: fetchCheckUpChart
  },
  4: {
    list: tabOrigin,
    api: fetchPhysicalChart
  }
});
const origin = {
  screeningOptions: [], // 筛查项
  caries: {}, // 去除
  eyesight: {}, // 视力
  physical: {}, // 体测
  checkup: {}, // 体检
  appName: 'ssss'
};
const toggle = ref(false);
const tabsInstRef = ref();
const healthInformation = reactive({ ...origin });
const state = reactive({
  groupPlan: [], // 计划按照年份分组
  trendChart1: [], // 视力趋势图
  trendChart2: [], // 龋齿趋势图
  trendChart3: [], // 体检趋势图
  trendChart4: [], // 体测趋势图
  screeningOptions1: [], // 视力筛查项 与 自定义筛查项赋值
  screeningOptions2: [], // 龋齿筛查项 与 自定义筛查项赋值
  screeningOptions3: [], // 体检筛查项 与 自定义筛查项赋值
  screeningOptions4: [], // 体测筛查项 与 自定义筛查项赋值
  planId: null,
  appTypes: [],
  appType: null,
  curTab: 1
});
const formValue = reactive({});
const healthInfoList = ref([]);

const chartlabel = computed(() => {
  console.log(state.appType, 'state.appType');
  const label = trendChartTabs[state.appType].list.find(d => d.value == state.curTab)?.label ?? '';
  return label;
});

const downloadExcel = async item => {
  if (item.appType === AppTypeEnum.SPINE) {
    // 脊柱报告, 打印pdf的形式
    openSpineReport(true, { planId: item.planId, studentIds: query.id, noImmPrint: true });
    return;
  }

  const data = await exportStudentScreeningtExcel(
    { planId: item.planId, studentId: query.id, schoolId: query.school },
    item.appType
  );
  data && downloadFile(data.data, item.planName, 'xlsx');
};

const queryStudentInfo = async () => {
  await fetchStudentInfo({ studentId: query.id });
  if (studentInfo.value) {
    Object.assign(formValue, studentInfo.value);
  }
};
const queryPlan = async () => {
  await fetchPlan({ studentId: query.id });
  if (!Array.isArray(unref(planlist)) || !unref(planlist).length) return;
  state.planId = planlist.value[0].planId;
  state.appType = planlist.value[0].appType;
  setGroupPlan();
  queryScreens();
  queryAppType();
};
const changeScreens = async (_, opt) => {
  state.appType = opt.appType;
  await queryScreens();
  await queryAppType();
};
const queryAppType = async () => {
  const data = await fetchScreenType({ planId: state.planId });
  console.log(data);
  if (data?.length) {
    state.appTypes = data;
    state.appType = data[0].type;
    const checkupTabs = data.find(d => d.type == 4)?.items ?? [];
    trendChartTabs[4].list = tabOrigin.filter(d => checkupTabs.includes(d.value));

    state.curTab = trendChartTabs[state.appType].list[0].value;

    queryCharts();

    await nextTick();
    tabsInstRef.value?.syncBarPosition();
  }
};
const setGroupPlan = () => {
  let obj = {};
  planlist.value.forEach(d => {
    d.planYear = typeof d.planYear == 'number' ? d.planYear.toString() : d.planYear;
    if (!d.planYear) {
      d.planYear = '2022';
    }
    if (Object.keys(obj).includes(d.planYear)) {
      obj[d.planYear].push(d);
    } else {
      obj[d.planYear] = [d];
    }
  });
  for (let key in obj) {
    state.groupPlan.push({ year: key, list: obj[key] });
  }
  state.groupPlan.sort(compareYear('year'));
};
const compareYear = key => {
  return (pre, next) => {
    return pre[key] > next[key] ? -1 : 1;
  };
};
const queryScreens = async () => {
  const res = await fetchHealth({ studentId: query.id, planId: state.planId });
  const healthInformationAll = await getHistoryScreening({ studentId: query.id, planId: state.planId }, state.appType);

  if (!res) {
    Object.assign(healthInformation, origin);
    return;
  }
  Object.assign(healthInformation, res);

  let healthInfoFieldEnum = {
    1: 'eyesight',
    2: 'caries',
    3: 'checkup',
    4: 'physical',
    5: 'spine'
  };
  let healthInfoField = healthInfoFieldEnum[state.appType];
  healthInfoList.value = healthInformationAll.map(item => ({
    [healthInfoField]: item,
    screenerName: item.screenerName,
    screeningTime: item.screeningTime
  }));
  // 将筛查项 按照 大类分
  const screeningOptions = res.screeningOptions?.length ? res.screeningOptions : [];
  state.screeningOptions1 = transforData(getAppScreenItems(1, screeningOptions), res.eyesight?.otherList ?? []);
  state.screeningOptions2 = transforData(getAppScreenItems(2, screeningOptions), res.caries?.otherList ?? []);
  state.screeningOptions3 = transforData(getAppScreenItems(3, screeningOptions), res.checkup?.otherList ?? []);
  state.screeningOptions4 = transforData(getAppScreenItems(4, screeningOptions), res.physical?.otherList ?? [], {
    v: res.physical,
    vMap: physicalMap
  });
};
const transforData = (screens, otherList, filterOpt) => {
  return screens.map(d => {
    d.itemList = d.itemList.filter(m => {
      otherList?.forEach(n => {
        // 自定义筛查项 赋值
        if (m.screeningItemCode == n.screeningItemCode) {
          m.number = n.number;
        }
      });
      if (filterOpt) {
        let vKey = filterOpt.vMap[m.screeningItemCode];
        return filterOpt.v[vKey];
      } else {
        return true;
      }
    });

    return d;
  });
};

const getAppScreenItems = (appType, screeningOptions) => {
  const arr = cloneDeep(screeningOptions);
  return arr?.filter(d => {
    d.itemList = d?.itemList?.filter(m => {
      return m.screeningItemType == appType;
    });
    return !!d?.itemList?.length;
  });
};
const updateAppType = async () => {
  state.curTab = trendChartTabs[state.appType].list[0].value;

  updateTab();

  await nextTick();
  tabsInstRef.value?.syncBarPosition();
};
const updateTab = () => {
  queryCharts();
};
const queryCharts = async () => {
  const api = trendChartTabs[state.appType].api;
  const params = {
    studentId: query.id,
    type: state.curTab,
    number: 7
  };
  try {
    startLoading();
    const data = await api(params);
    // 趋势图 数据
    const key = `trendChart${state.appType}`;
    state[key] = Array.isArray(data) ? data : [];
  } finally {
    endLoading();
  }
};

onBeforeMount(async () => {
  if (!query.id) return;
  queryStudentInfo();
  queryPlan();
});
defineOptions({
  name: 'StudentReport'
});
</script>
<style lang="less">
.student-report-page {
  .bg-tabs {
    .n-tabs-nav-scroll-wrapper {
      background-color: rgba(64, 158, 255, 0.1);
      line-height: 32px;
      padding-left: 16px;
      margin-top: -12px;
    }
  }
}
</style>
