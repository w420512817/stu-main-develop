<template>
  <n-grid :cols="20" :y-gap="13" :x-gap="13">
    <n-gi span="20">
      <div class="card">
        <div class="tit">基础信息数据</div>
        <q-suspense :loading="topLoading">
          <div class="mt-20px flex justify-around">
            <div v-for="item in basicInfo" :key="item.key" class="flex items-center">
              <img :src="item.img" class="w-88px h-88px" />
              <div class="ml-5">
                <div class="text-30px text-[#111] font-bold">
                  <n-number-animation :from="0" :to="item.v" show-separator />
                </div>

                <div class="text-14px text-[#666] mt-1">{{ item.tit }}</div>
              </div>
            </div>
          </div>
        </q-suspense>
      </div>
    </n-gi>
    <n-gi span="13">
      <div class="card h-full">
        <div class="tit">各项筛查情况对比</div>
        <q-suspense :loading="sComLoading">
          <div class="con relative flex justify-between mt-28px pl-2">
            <div v-for="item in trendInfo" :key="item.tit" class="situation">
              <div flex>
                <img class="w-20px h-20px" :src="item.icon" />
                <span class="text-[#222] font-bold text-14px ml-2px">{{ item.tit }}</span>
              </div>
              <div class="pl-5px">
                <div v-for="v in item.list" :key="v.tit">
                  <div class="scale">
                    <span class="text-[#222] text-26px font-bold">
                      <n-number-animation :to="v.v" :precision="2" /><template v-if="!v.hideRate">%</template>
                    </span>
                    <span :class="['ml-13px', 'trend', { up: v.undulate > 0 }, { down: v.undulate < 0 }]">
                      <template v-if="v.undulate > 0">+</template>
                      <n-number-animation :to="v.undulate" :precision="2" /><template v-if="!v.hideRate">%</template>
                    </span>
                    <img v-if="v.undulate > 0" class="w-20px h-20px ml-7px" src="@/assets/image/index/up.png" />
                    <img v-else-if="v.undulate < 0" class="w-20px h-20px ml-7px" src="@/assets/image/index/down.png" />
                    <span v-else class="w-20px h-20px ml-7px"></span>
                  </div>
                  <div class="text-14px text-[#666] mt-7px">{{ v.tit }}</div>
                </div>
              </div>
            </div>
            <div class="line left-[20%]"></div>
            <div class="line left-[50%]"></div>
            <div class="line left-[77.5%]"></div>
          </div>
        </q-suspense>
      </div>
    </n-gi>
    <n-gi span="7">
      <div class="card flex-1 h-full">
        <div class="tit">各地市筛查完成情况</div>
        <div class="con mt-5">
          <q-suspense :loading="areaTypeLoading">
            <n-data-table
              class="cusTable"
              style="
                --n-th-padding: 10px 12px;
                --n-th-font-weight: bold;
                --n-th-text-color: #222;
                --n-td-padding: 10px;
                --n-td-text-color: #222;
              "
              :columns="columns"
              :data="dataList"
              :bordered="false"
              max-height="200px"
              :render-cell="value => (value ? value : '/')"
            />
          </q-suspense>
        </div>
      </div>
    </n-gi>
    <n-gi span="20">
      <div class="card">
        <div class="tit">筛查计划看板</div>
        <div class="con mt-17px">
          <n-form inline label-width="auto" label-placement="left">
            <n-form-item label="类型">
              <n-select
                v-model:value="formValue.screenType"
                class="w-220px"
                :options="screeningType"
                placeholder="请选择"
                label-field="screenTypeName"
                value-field="screenType"
                @update:value="screenTypeChange"
              />
            </n-form-item>

            <n-form-item label="计划">
              <n-select
                v-model:value="formValue.planId"
                class="w-220px"
                placeholder="请选择"
                :options="planList"
                label-field="planName"
                value-field="planId"
                @update:value="planChange"
              />
            </n-form-item>
          </n-form>
          <n-spin :show="botLoading">
            <n-grid cols="3" x-gap="50" :opacity-0="botLoading ? '' : false">
              <n-gi>
                <div flex>
                  <img class="w-20px h-20px" src="@/assets/image/index/ratio-1.png" />
                  <span class="text-[#222] font-bold text-14px ml-2px">
                    {{ userInfo.govLevel == 3 ? '各学校筛查率（前十）' : '各地市筛查率（%）' }}
                  </span>
                </div>
                <div h-250px pt-35px flex-center>
                  <n-empty v-if="!formValue.planId" description="该类型暂无筛查计划" />
                  <div v-else-if="!chartEmp.leftChart" ref="leftChart" class="wh-full"></div>
                  <n-empty v-else />
                </div>
              </n-gi>
              <n-gi>
                <div flex>
                  <img class="w-20px h-20px" src="@/assets/image/index/ratio-1.png" />
                  <span class="text-[#222] font-bold text-14px ml-2px">各学段筛查人数统计（人）</span>
                </div>
                <div class="period mt-35px">
                  <LineC :data="periodList" num-key="v" />
                </div>
              </n-gi>

              <n-gi>
                <div flex>
                  <img class="w-20px h-20px" src="@/assets/image/index/ratio-1.png" />
                  <span class="text-[#222] font-bold text-14px ml-2px">
                    {{
                      userInfo.govLevel == 3
                        ? '各学校筛查率（后十）'
                        : '各地市筛查人数统计' + (tenThousand ? '（万人）' : '')
                    }}
                  </span>
                </div>
                <div h-250px pt-35px flex-center>
                  <n-empty v-if="!formValue.planId" description="该类型暂无筛查计划" />
                  <div v-else-if="!chartEmp.rightchart" ref="rightChart" class="wh-full"></div>
                  <n-empty v-else />
                </div>
              </n-gi>
            </n-grid>
          </n-spin>
        </div>
      </div>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted } from 'vue';
import LineC from './components/lineC.vue';
import QSuspense from '@common/qd-components/QSuspense/index.vue';
import { columns } from './index.data';
import { useECharts } from '@common/hooks/useECharts';
import useApi from '@common/hooks/business/useApi';
import useLoading from '@common/hooks/useLoading';
import { getPlanList } from '@common/api/examine/plan';
import {
  getEdbScreenCount,
  screeningComparison,
  getScreenAreaTypeRate,
  getScreeningTypeList,
  cityScreenRate,
  schoolScreenRate,
  cityScreenCount,
  prefixScreenCount
} from '@/api/dashbord';
import { useUserStore } from '@/store/modules/user';
import { numToPercent } from '@common/utils/common/index';
import { multiply, divide } from 'lodash-es';

const { fetch: getEdbScreenCountApi, loading: topLoading } = useApi(getEdbScreenCount);
const { fetch: screeningComparisonApi, loading: sComLoading } = useApi(screeningComparison);
const { fetch: getScreenAreaTypeRateApi, loading: areaTypeLoading } = useApi(getScreenAreaTypeRate);
const userStore = useUserStore();
const { userInfo } = userStore;
const { loading: botLoading, startLoading, endLoading } = useLoading();

const leftChart = ref();
const rightChart = ref();
const { setOptions: setLeftChart } = useECharts(leftChart);
const { setOptions: setRightChart } = useECharts(rightChart);

const formValue = reactive({
  planId: null,
  screenType: null
});

const basicInfo = reactive([
  { img: getImg('basic-1.png'), v: 0, key: 'screenCount', tit: '累计筛查总/人次' },
  { img: getImg('basic-2.png'), v: 0, key: 'schoolCount', tit: '学校数' },
  { img: getImg('basic-3.png'), v: 0, key: 'studentCount', tit: '总人数/人' },
  { img: getImg('basic-4.png'), v: 0, key: 'planCount', tit: '下发计划数' },
  { img: getImg('basic-5.png'), v: 0, key: 'endTaskCount', tit: '任务完成数' }
]);

const trendInfo = reactive([
  {
    icon: getImg('ratio-1.png'),
    tit: '视力筛查',
    list: [
      { tit: '视力不良比例', v: 0, undulate: 0, key: 'poorVisionRate', undulateKey: 'poorVisionDValue' },
      { tit: '平均视力', v: 0, undulate: 0, key: 'avgVision', undulateKey: 'avgVisionDValue', hideRate: 1 },
      { tit: '平均屈光度', v: 0, undulate: 0, key: 'avgDiopter', undulateKey: 'avgDiopterDValue', hideRate: 1 }
    ]
  },
  {
    icon: getImg('ratio-2.png'),
    tit: '龋齿筛查',
    list: [
      { tit: '患龋率', v: 0, undulate: 0, key: 'cariesRate', undulateKey: 'cariesDValue' },
      { tit: '乳牙患龋率', v: 0, undulate: 0, key: 'dtCariesRate', undulateKey: 'dtCariesDValue' },
      { tit: '恒牙患龋率', v: 0, undulate: 0, key: 'ptCariesRate', undulateKey: 'ptCariesDValue' }
    ]
  },
  {
    icon: getImg('ratio-3.png'),
    tit: '体测筛查',
    list: [
      { tit: '优秀率', v: 0, undulate: 0, key: 'outstandingRate', undulateKey: 'outstandingDValue' },
      { tit: '良好率', v: 0, undulate: 0, key: 'goodRate', undulateKey: 'goodDValue' },
      { tit: '及格率', v: 0, undulate: 0, key: 'passRate', undulateKey: 'passDValue' }
    ]
  },
  {
    icon: getImg('ratio-4.png'),
    tit: '体检筛查',
    list: [
      { tit: '肥胖率', v: 0, undulate: 0, key: 'fatRate', undulateKey: 'fatDValue' },
      { tit: '营养不良率', v: 0, undulate: 0, key: 'malnutritionRate', undulateKey: 'malnutritionDValue' },
      { tit: '脊柱侧弯不良率', v: 0, undulate: 0, key: 'scoliosisRate', undulateKey: 'scoliosisDValue' }
    ]
  }
]);

const dataList = ref([]);
const periodList = ref([]);

const screeningType = ref([]);
const planList = ref([]);
const chartEmp = reactive({
  leftChart: false,
  rightchart: false
});
const tenThousand = ref(false);

function getImg(v) {
  return new URL(`../../../assets/image/index/${v}`, import.meta.url).href;
}
// 配置下方左侧图表
async function setLeftOpts(list) {
  if (!list.length) {
    chartEmp.leftChart = !list.length;
    return;
  }
  await nextTick();
  const flag = userInfo.govLevel == 3; // 当账号为区级账号时为true,其他情况为false

  // serise数据
  const seriesData = list.map(item => numToPercent(item.percent));
  // x轴数据
  const xAxisData = list.map(item => (flag ? item.orgName : item.areaName));
  let option = {
    grid: {
      top: '10%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: { show: true, trigger: 'axis', valueFormatter: v => v + '%' },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          color: '#386FFF'
        },
        data: seriesData
      },
      {
        // 分隔
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        symbolRepeat: 'fixed',
        symbolMargin: 1,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [18, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: seriesData,
        width: 2,
        z: 0,
        zlevel: 1
      },
      {
        // 背景
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        emphasis: {
          itemStyle: {
            color: '#F7F9FE'
          }
        },
        animation: false,
        symbolRepeat: 'fixed',
        symbolMargin: 0,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [24, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: Array(list.length).fill(100), // 动态生成对应个数的100填充数组
        width: 4,
        z: 0,
        zlevel: 0
      }
    ],
    legend: { show: false },
    yAxis: {
      axisLine: { show: false },
      axisLabel: { color: '#777777' },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      max: 100,
      minInterval: 25,
      offset: 5
    },
    xAxis: {
      axisLine: { color: 'rgba(255, 255, 255, 0.25)', lineStyle: { color: '#EEEEEE' } },
      axisLabel: { color: '#777777' },
      axisTick: { show: false },
      data: xAxisData
    }
  };
  setLeftChart(option);
}
// 配置下方右侧图表
async function setRightOpts(list) {
  chartEmp.rightchart = !list.length;
  if (!list.length) return;
  await nextTick();
  const flag = userInfo.govLevel == 3; // 当账号为区级账号时为true,其他情况为false

  let barOption = {
    grid: {
      top: '10%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: { show: true, trigger: 'axis', valueFormatter: v => v + '%' },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          color: '#386FFF'
        },
        data: []
      },
      {
        // 分隔
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        symbolRepeat: 'fixed',
        symbolMargin: 1,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [18, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: [],
        width: 2,
        z: 0,
        zlevel: 1
      },
      {
        // 背景
        tooltip: { show: false },
        type: 'pictorialBar',
        itemStyle: {
          color: '#F7F9FE'
        },
        emphasis: {
          itemStyle: {
            color: '#F7F9FE'
          }
        },
        symbolRepeat: 'fixed',
        symbolMargin: 0,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [24, 3],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        data: Array(list.length).fill(100), // 动态生成对应个数的100填充数组
        width: 4,
        z: 0,
        zlevel: 0
      }
    ],
    legend: { show: false },
    yAxis: {
      axisLine: { show: false },
      axisLabel: { color: '#777777' },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      max: 100,
      minInterval: 25,
      offset: 5
    },
    xAxis: {
      axisLine: { color: 'rgba(255, 255, 255, 0.25)', lineStyle: { color: '#EEEEEE' } },
      axisLabel: { color: '#777777' },
      axisTick: { show: false },
      data: []
    }
  };

  let lineOption = {
    grid: {
      top: '10%',
      right: '5%',
      bottom: '10%',
      left: '15%'
    },
    tooltip: { show: true, trigger: 'axis', valueFormatter: v => (tenThousand.value ? multiply(v, 10000) : v) + ' 人' },
    legend: { show: false },
    yAxis: {
      axisLine: { show: false },
      axisLabel: { color: '#777777' },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      offset: 5
    },
    xAxis: {
      axisLine: { color: 'rgba(255, 255, 255, 0.25)', lineStyle: { color: '#EEEEEE' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#EEEEEE' } },
      axisLabel: { color: '#777777' },
      axisTick: { show: false },
      data: []
    },
    series: [
      {
        type: 'line',
        barWidth: 16,
        itemStyle: {
          color: '#386FFF'
        },
        symbol: 'rect',
        showSymbol: false,
        symbolSize: [4, 2],
        data: [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 255, 255, 0)'
              },
              {
                offset: 0.2,
                color: 'rgba(227, 235, 255, 0.05)'
              },
              {
                offset: 1,
                color: 'rgba(56, 111, 255, 0.25)'
              }
            ]
          }
        }
      }
    ]
  };
  if (flag) {
    const seriesData = list.map(item => numToPercent(item.percent));
    const xAxisData = list.map(item => item.orgName);
    barOption.series[0].data = seriesData;
    barOption.series[1].data = seriesData;
    barOption.xAxis.data = xAxisData;
  } else {
    tenThousand.value = false;
    let data = list.map(item => item.count);
    let maxCount = Math.max(...data);
    if (maxCount >= 10000) {
      data = data.map(v => divide(v, 10000));
      tenThousand.value = true;
    }
    lineOption.series[0].data = data;
    lineOption.xAxis.data = list.map(item => item.areaName);
  }
  setRightChart(flag ? barOption : lineOption);
  // 区级账号，右侧图表改为柱状图,其他情况为折线图
}
// 查询下面三个图
async function queryByCondition() {
  if (!formValue.planId) return;
  const { govLevel, orgId } = userInfo;
  const params = { orgId, planId: formValue.planId, screeningType: formValue.screenType };

  if (govLevel == 3) {
    let schoolScreenRateQ = schoolScreenRate({
      type: '1',
      ...params
    });
    let schoolScreenRateH = schoolScreenRate({
      type: '2',
      ...params
    });
    // 左侧图--区级账号，查各学校筛查率前十
    const res1 = await schoolScreenRateQ;
    setLeftOpts(res1);
    // 右侧图--区级账号，查各学校筛查率后十
    const res2 = await schoolScreenRateH;
    setRightOpts(res2);
  } else {
    let cityScreenRateP = cityScreenRate(params);
    let cityScreenCountP = cityScreenCount(params);
    // 左侧图--查各地市筛查率
    const res1 = await cityScreenRateP;
    setLeftOpts(res1);

    // 右侧图--查各地市筛查人数统计
    const res2 = await cityScreenCountP;
    setRightOpts(res2);
  }

  // 查中间图数据-各地市筛查人数统计
  const res3 = await prefixScreenCount(params);
  periodList.value = res3.map(item => {
    return {
      v: (item.maleCount + item.femaleCount) * 10000,
      name: item.prefixName
    };
  });
}
// 查询初始数据
async function getData() {
  getEdbScreenCountApi().then(res => {
    basicInfo.forEach(item => {
      item.v = Number(res[item.key]);
    });
  });

  screeningComparisonApi({ planId: '', id: userInfo.areaId, level: userInfo.govLevel }).then(res => {
    trendInfo.forEach(item => {
      item.list.forEach(it => {
        if (['avgVision', 'avgDiopter'].includes(it.key)) {
          // 平均视力、平均屈光度无需转换下百分比
          it.v = Number(res[it.key]);
          it.undulate = Number(res[it.undulateKey]);
        } else {
          it.v = numToPercent(Number(res[it.key]));
          it.undulate = numToPercent(Number(res[it.undulateKey]));
        }
      });
    });
  });

  getScreenAreaTypeRateApi().then(res => {
    dataList.value = res;
  });
  startLoading();
  // 先查类型
  screeningType.value = await getScreeningTypeList();
  formValue.screenType = screeningType.value[0].screenType;

  // 按类型查计划
  const { list } = await getPlanList({ appType: formValue.screenType });
  planList.value = list;
  formValue.planId = planList.value[0].planId;

  await planChange();
}
// 类型切换
async function screenTypeChange(val) {
  try {
    startLoading();
    // 按类型查计划
    const { records } = await getPlanList({ appType: val });
    planList.value = records;
    formValue.planId = planList.value[0]?.planId || null;

    await queryByCondition();
  } finally {
    endLoading();
  }
}
// 计划切换
async function planChange() {
  try {
    startLoading();
    await queryByCondition();
  } finally {
    endLoading();
  }
}

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.home {
  font-size: @font-size;
}
.card {
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(110, 116, 125, 0.1);
  border-radius: 7px;
  padding: 20px;
  & .tit {
    font-size: 16px;
    color: #222;
    font-weight: bold;
    line-height: 1;
    padding-left: 8px;
    position: relative;
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #386fff;
    }
  }
}

.line {
  position: absolute;
  height: 83px;
  width: 1px;
  background-color: #eee;
  top: 0;
  bottom: 0;
  margin: auto 0;
}

.situation {
  position: relative;
  .scale {
    display: flex;
    align-items: flex-end;
    line-height: 1;
    margin-top: 18px;
    img {
      position: relative;
      top: 3px;
    }
  }
  .trend {
    font-size: 16px;
    font-weight: bold;
  }
  .up {
    color: #ff4c4c;
  }
  .down {
    color: #00b179;
  }
}

.item {
  margin-top: 14px;
  &:last-child {
    margin-top: 0;
  }
  .bar-bg {
    height: 12px;
    background: linear-gradient(270deg, #386fff 0%, rgba(56, 111, 255, 0) 100%);
    border-radius: 8px;
    position: relative;
    min-width: 12px;
    width: var(--wid);
    animation: widAni 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    &::after {
      content: ' ';
      position: absolute;
      right: 0;
      width: 12px;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: #3577f6;
    }
  }
}

@keyframes widAni {
  0% {
    width: 0;
  }
  100% {
    width: var(--wid);
  }
}
</style>
