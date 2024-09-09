<template>
  <div class="-top-2" absolute w-full z-1 pointer-events-none>
    <div class="flex justify-between">
      <n-select
        v-model:show="selectShow"
        v-model:value="currentBatch"
        class="!w-45% batch-select pointer-events-auto"
        label-field="planName"
        value-field="planId"
        :options="selectOptions"
        @update:value="handleUpdateValue"
      >
        <template #arrow>
          <img v-if="selectShow" src="@/assets/image/bigScreen/arrow-top.png" alt="" class="w-full" />
          <img v-else src="@/assets/image/bigScreen/arrow-bottom.png" alt="" class="w-full" />
        </template>
      </n-select>
      <n-select
        ref="selectInstRef"
        :value="areaIdModel"
        :options="lowerArea"
        label-field="regionName"
        value-field="regionId"
        :node-props="() => ({ class: 'slabel' })"
        class="!w-20% batch-select pointer-events-auto"
        style="font-family: nomal"
        :to="false"
        :class="{ 'pointer-events-none': isAreaGov }"
        @update:value="changeArea"
      >
        <template #arrow>
          <transition name="slide-left">
            <img v-if="!isAreaGov" src="@/assets/image/bigScreen/down.png" />
          </transition>
        </template>
      </n-select>
      <SwitchNav class="w-30% relative -top-1 pointer-events-auto" :nav-list="tabData" @nav-change="changeViewMode" />
    </div>
    <div class="data">
      <div class="top w-100% mx-auto flex justify-between text-center">
        <div class="i-bg">
          <div class="text-28px text-[#fff] font-bold">
            <n-number-animation :to="data.shouldUpNum">{{ data.shouldUpNum || '0' }}</n-number-animation>
          </div>
          <div class="text-1vw text-[#fff] relative top-3.5 titFont">应筛总人数</div>
        </div>
        <div class="i-bg">
          <div class="text-28px text-[#fff] font-bold">{{ data.completionRate || '0' }}%</div>
          <div class="text-1vw text-[#fff] relative top-3.5 titFont">筛查进度</div>
        </div>
        <div class="i-bg">
          <div class="text-28px text-[#fff] font-bold">
            <n-number-animation :to="data.upNum">{{ data.upNum || '0' }}</n-number-animation>
          </div>
          <div class="text-1vw text-[#fff] relative top-3.5 titFont">实际筛查人数</div>
        </div>
      </div>
    </div>
  </div>
  <div class="relative" wh-full>
    <div ref="chart" wh-full></div>
    <div class="absolute top-0 right-1vw titFont"></div>
    <div v-show="cacheCode.length > 1" class="absolute top-6vh left-0 titFont">
      <n-button class="primaty text-[#F0FCFF] text-1.05vw" text @click="backMap">
        <img style="transform: rotateZ(90deg)" class="w-1.5vw" src="@/assets/image/bigScreen/down.png" />
        返回
      </n-button>
    </div>

    <div v-show="viewMode == 1" class="legend text-0.8vw text-white">
      <div class="flex items-center">
        <img src="@/assets/image/bigScreen/bar-icon.png" class="w-0.6vw -ml-0.1vw" />
        <span class="ml-0.5vw text-0.85vw">异常学生占比</span>
      </div>
      <div class="mt-0.4vh">
        <div class="rhombus !bg-[#00D4DD]"></div>
        <span class="ml-0.5vw">正常＜3%</span>
      </div>
      <div class="my-0.4vh">
        <div class="rhombus !bg-[#DFD433]"></div>
        <span class="ml-0.5vw">3%≤ 异常 &lt;6%</span>
      </div>
      <div>
        <div class="rhombus !bg-[#DA8458]"></div>
        <span class="ml-0.5vw">异常 ≥ 6%</span>
      </div>
    </div>
    <div v-show="viewMode == 0" class="legend">
      <div class="flex items-end">
        <img src="@/assets/image/bigScreen/bar.png" class="w-1.3vw h-2.5vw" />
        <span class="text-0.9vw text-white ml-0.2vw font-medium">任务进度</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch, reactive, nextTick, computed } from 'vue';
import { geoData, getScreenProgress, getAreaUpNum } from '@/api/bigScreen/spine';
import { debounce } from 'lodash-es';
import * as echarts from 'echarts';
import axios from 'axios';
import { useECharts } from '@common/hooks/useECharts';
import { numToPercent } from '@common/utils/common';
import { cloneDeep } from 'lodash-es';
import { useUserStore } from '@/store';
import centroid from '@turf/centroid';
import { getColor, decode, lineData, scatterData2, getValue, scatterData } from './mapUtil';
import SwitchNav from '../../../component/SwitchNav.vue';
import { screenTypeMap } from '@/views/bigScreen/data/index.data';
import { planList } from '@common/api/examine/plan';

const params = inject('params');
const paramsChange = inject('paramsChange');
const changeParams = inject('paramsChange');
const tabData = [
  { type: 1, name: '健康情况' },
  { type: 0, name: '筛查任务' }
];
const selectOptions = ref([]);
const data = ref({});
const currentBatch = ref(null);
const selectShow = ref(false);
let selectInstRef = ref();
let viewMode = ref(1);
let initData = [
  { name: '台州市', value: 0, percent: '0%' },
  { name: '嘉兴市', value: 0, percent: '0%' },
  { name: '宁波市', value: 0, percent: '0%' },
  { name: '舟山市', value: 0, percent: '0%' },
  { name: '温州市', value: 0, percent: '0%' },
  { name: '丽水市', value: 0, percent: '0%' },
  { name: '衢州市', value: 0, percent: '0%' },
  { name: '金华市', value: 0, percent: '0%' },
  { name: '湖州市', value: 0, percent: '0%' },
  { name: '杭州市', value: 0, percent: '0%' },
  { name: '绍兴市', value: 0, percent: '0%' }
];
const chart = ref();

let cacheCode = reactive([{ name: params.name, code: params.id }]);
const userStore = useUserStore();
const { setOptions, getInstance } = useECharts(chart);
const btnLoad = ref(true);
const areaIdModel = ref(userStore.userInfo.areaId);

// 地图形状过于不规则 中心点会不准 已政府经纬度为准
let centerNomal = [
  '秀洲区',
  '龙港市',
  '瑞安市',
  '平阳县',
  '海宁市',
  '象山县',
  '宁波市',
  '椒江区',
  '玉环市',
  '岱山县',
  '嵊泗县'
];
let areaMapLN = {};
let geoCoordMap = {};
let customerBatteryCityData = cloneDeep(initData);

const isAreaGov = computed(() => {
  return userStore.userInfo.govLevel === 3;
});

const lowerArea = computed(() => {
  let res = [];
  let stack = [...userStore.getAreaTree];
  for (let i = 0; i < stack.length; i++) {
    const item = stack[i];
    if (item.regionId === userStore.userInfo.areaId) {
      let { regionId, level, regionName, children } = item;
      children = children || [];
      res = children.reduce(
        (perv, v) => {
          let { regionId, level, regionName } = v;
          if (!(regionName.includes('直辖区') || regionName.includes('直属'))) {
            perv.push({ regionId, level, regionName });
          }
          return perv;
        },
        [{ regionId, level, regionName }]
      );
      break;
    }
    if (item.children?.length) {
      stack.push(...item.children);
    }
  }
  return res;
});

async function getPlanList() {
  const { records } = await planList({ appType: screenTypeMap['脊柱'] });

  // console.log('planList', records);

  if (!records.length) return;
  selectOptions.value = records;
  currentBatch.value = records[0].planId;
  paramsChange('planId', currentBatch.value);
}

async function changeViewMode(v) {
  if (btnLoad.value || viewMode.value === v.type) return;
  viewMode.value = v.type;
  await initChart();
}

async function getGeoData() {
  if (!params.planId) {
    return;
  }

  customerBatteryCityData = cloneDeep(initData);

  if (viewMode.value) {
    let res = await geoData(params);
    if (params.level === 3) {
      res = res.reduce(
        (perv, item) => {
          perv[0].abnormalSpineCount += ~~item.abnormalSpineCount;
          perv[0].normalSpineCount += ~~item.normalSpineCount;
          return perv;
        },
        [{ name: areaMapLN.name, abnormalSpineCount: 0, normalSpineCount: 0 }]
      );
      let { abnormalSpineCount, normalSpineCount } = res[0];
      res[0].percent = abnormalSpineCount / (abnormalSpineCount + normalSpineCount);
    }
    customerBatteryCityData.forEach(item => {
      let i = res.findIndex(v => v.name === item.name);
      if (i !== -1) {
        item.value = numToPercent(res[i].percent, 'noMax');
        item.zcValue = res[i].normalSpineCount;
        item.unValue = res[i].abnormalSpineCount;
        item.percent = numToPercent(res[i].percent, 'noMax') + '%';
        res.splice(i, 1);
      }
    });
  } else {
    let res = await getScreenProgress(params);
    if (params.level === 3) {
      let areaRes = res.find(item => item.areaId == params.id);
      areaRes && (res = [areaRes]);
    }
    customerBatteryCityData.forEach(item => {
      let i = res.findIndex(v => v.areaId == item.code);
      if (i !== -1) {
        item.value = res[i].screenCount;
        item.unValue = res[i].totalCount;
        item.percent = numToPercent(res[i].percent, 'noMax') + '%';
        // item.percent = 80 + '%';
        res.splice(i, 1);
      }
    });
  }
}

async function getGeo(json) {
  if (json) {
    geoCoordMap = json.features.reduce((perv, item) => {
      item.properties.adcode = item.properties.adcode || item.id;
      let p = centroid(item);
      let ln = p.geometry.coordinates;
      if (centerNomal.includes(item.properties.name)) {
        ln = item.properties.center || item.properties.cp;
      }
      perv[item.properties.name] = [...ln, item.properties.adcode];
      return perv;
    }, {});

    initData = Object.keys(geoCoordMap).map(key => {
      return { name: key, value: '0', percent: '0%', code: geoCoordMap[key][2] };
    });
  }
}

const init = async () => {
  let { data: geoJson } = await axios({
    url: `//cdn.qdsgvision.com/map-res/json/${params.id}.json`,
    method: 'get'
  });
  let { features } = geoJson || {};
  let properties = features[0].properties;
  areaMapLN = { ...properties, code: properties.adcode || features[0].id };
  geoJson = decode(geoJson);
  initChart(geoJson);
};

async function initChart(json) {
  btnLoad.value = true;
  json && echarts.registerMap(params.id, json);
  await getGeo(json);
  await getGeoData();
  let zoom = {
    zoom: 0.7,
    aspectScale: 0.9,
    map: params.id
  };
  let viewOpt = {};
  let label = {
    label: { show: false }
  };
  let series = [
    {
      geoIndex: 0,
      type: 'map',
      left: '7%',
      right: '7%',
      label: {
        show: true,
        fontFamily: 'titleBlack',
        emphasis: {
          show: false,
          textStyle: {
            color: '#fff'
          }
        }
      },

      select: {
        disabled: true
      },
      ...zoom,
      roam: true,
      data: customerBatteryCityData
    }
  ];
  if (viewMode.value === 1) {
    viewOpt.visualMap = {
      show: false,
      type: 'piecewise',
      seriesIndex: 0,
      pieces: [
        { lte: 0, color: '#0171F2' },
        { gt: 0, lt: 3, color: '#0277FF' },
        { gte: 3, lt: 6, color: '#DFD433' },
        { gte: 6, color: '#DA8458' }
      ]
    };
  }
  let arr = [
    // 柱状体
    {
      type: 'lines',
      zlevel: 5,
      effect: {
        // 箭头不展示
        show: false,
        period: 4, // 箭头指向速度，值越小速度越快
        trailLength: 0.02, // 特效尾迹长度[0,1]值越大，尾迹越长重
        symbol: 'arrow', // 箭头图标
        // symbol: imgDatUrl,
        symbolSize: 10 // 图标大小
      },
      lineStyle: {
        width: 10, // 尾迹线条宽度
        color: v => {
          let c = getColor(v);
          return c.lineColor;
        },
        opacity: 1, // 尾迹线条透明度
        curveness: 0 // 尾迹线条曲直度
      },
      label: {
        show: false
        // position: 'end',
        // formatter: '245'
      },
      silent: true,
      data: lineData(customerBatteryCityData, geoCoordMap, params)
    },
    // 柱状体的顶部
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 15,
      label: {
        show: true,
        formatter: function (v) {
          return `{v|${getValue(v.data, customerBatteryCityData, geoCoordMap, params)}}`;
        },
        color: '#00163C',
        borderRadius: 3,
        backgroundColor: '#01DCE5',
        position: 'top',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        fontSize: 12,
        rich: {
          v: {
            padding: [5, 10],
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      symbol: 'circle',
      symbolSize: [10, 5],
      itemStyle: {
        color: v => {
          let c = getColor(v);
          return c.dColor;
        },
        opacity: 1
      },
      silent: true,
      data: scatterData(customerBatteryCityData, geoCoordMap, params)
    },
    // 柱状体的底部
    {
      colorBy: 'data',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 4,
      rippleEffect: {
        period: 4,
        scale: 1,
        brushType: 'fill'
      },
      label: {
        formatter: '{b}',
        position: 'bottom',
        color: '#fff',
        fontSize: 13,
        distance: 10,
        show: true,
        fontFamily: 'titleBlack'
      },
      symbol: 'circle',
      symbolSize: [10, 5],
      itemStyle: {
        color: v => {
          let c = getColor(v);
          return c.dColor;
        }
      },
      silent: true,
      animation: false,
      data: scatterData2(customerBatteryCityData, geoCoordMap, params)
    },
    // 底部外框
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 4,
      label: {
        show: false
      },
      rippleEffect: {
        period: 4,
        scale: 3,
        brushType: 'fill'
      },
      hoverAnimation: true,
      symbol: 'circle',
      symbolSize: [15, 10],
      itemStyle: {
        color: v => {
          let c = getColor(v);
          return {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: c.colorStops,
            global: false // 缺省为 false
          };
        },
        opacity: 1
      },
      silent: true,
      data: scatterData2(customerBatteryCityData, geoCoordMap, params)
    }
  ];
  if (params.level === 3) {
    arr[2].symbolSize = [0, 0];
    // arr = [arr[2]];
  }
  series.push(...arr);
  const option = {
    ...viewOpt,
    tooltip: {
      trigger: 'item',
      show: true,
      enterable: true,
      textStyle: {
        fontSize: 14,
        color: '#fff'
      },
      padding: 0,
      borderWidth: 0,
      backgroundColor: 'rgba(37,108,190,0)',
      formatter: params => {
        const { data } = params ?? {};
        console.log(viewMode.value);
        if (!viewMode.value) {
          return `
                  <div class="tooltip">
                  <div>
                      <div class="rhombus"></div>
                      <div class="text">
                        已筛查人数：${data?.value || 0}
                      </div>
                  </div>
                  <div class='mt-1vh'>
                      <div class="rhombus"></div>
                      <div class="text">
                        应筛查人数：${data?.unValue || 0}
                      </div>
                  </div>
                  <div class='mt-1vh'>
                      <div class="rhombus"></div>
                      <div class="text">
                        筛查进度百分比：${data?.percent || 0}
                      </div>
                  </div>
                  `;
        }
        return `
                  <div class="tooltip">
                  <div>
                      <div class="rhombus s2"></div>
                      <div class="text">
                          异常学生：${data?.unValue || 0}
                      </div>
                  </div>
                  <div class='mt-1vh'>
                      <div class="rhombus"></div>
                      <div class="text">
                          正常学生：${data?.zcValue || 0}
                      </div>
                  </div>

                  `;
      }
    },
    geo: {
      ...zoom,
      roam: false,
      layoutSize: '125%',
      layoutCenter: ['53%', '60%'],
      left: '7%',
      right: '7%',
      itemStyle: {
        areaColor: '#0277FF',
        borderColor: '#46CAFF',
        borderWidth: 2
      },
      scaleLimit: {
        min: 0.3
      },
      ...label,
      emphasis: {
        ...label,
        itemStyle: {
          borderColor: '#43C1F5',
          areaColor: '#005CC4'
        }
      }
    },
    series
  };
  setOptions(option);
  await nextTick();
  btnLoad.value = false;

  setTimeout(() => {
    let chart = getInstance();
    let opt = chart.getOption();
    opt.geo[0].roam = true;
    chart.setOption(opt);
  }, 700);
}

function changeArea(v, opt) {
  selectInstRef.value?.blur();
  if (areaIdModel.value === v) {
    return;
  }
  cacheCode.splice(opt.level - userStore.userInfo.govLevel, Infinity);
  cacheCode.push({ name: opt.regionName, code: opt.regionId });
  nextTick(() => {
    changeOptId(v);
    changeParams('id', v);
    changeParams('name', opt.regionName);
    changeParams('level', opt.level);
  });
}

function changeOptId(v) {
  let isCon = lowerArea.value.some(item => item.regionId === v);
  isCon && (areaIdModel.value = v);
}

const backMap = debounce(() => {
  let perI = cacheCode.length - 2;
  let { name, code } = cacheCode[perI];
  changeOptId(code);
  changeParams('id', code);
  changeParams('name', name);
  changeParams('level', perI + userStore.userInfo.govLevel);
  cacheCode.splice(cacheCode.length - 1);
}, 200);

onMounted(() => {
  getInstance().on(
    'click',
    debounce(paramsMap => {
      if (params.level === 3 || paramsMap.data.code === params.id) return;
      cacheCode.push({ name: paramsMap.data.name, code: paramsMap.data.code });
      changeOptId(paramsMap.data.code + '');
      changeParams('id', paramsMap.data.code);
      changeParams('level', cacheCode.length + (userStore.userInfo.govLevel - 1));
      changeParams('name', paramsMap.data.name);
    }, 200)
  );
});

watch(params, () => {
  init();
});

async function getShouldUpNum() {
  let res = await getAreaUpNum(params);
  res.completionRate = numToPercent(res.completionRate, 'noMax');
  data.value = res;
}

function handleUpdateValue(val) {
  paramsChange('planId', val);
}

onMounted(() => {
  getPlanList();
});

watch(params, () => {
  getShouldUpNum();
});
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/batch-select.less';

.batch-select {
  width: 50%;
  height: 2.2vw;
  padding-left: 0.5vw;
}

.expand-all {
  width: 100%;
  flex: 1;
  padding: 0 0 0.8vw 0;
}
.data {
  width: 27vw;
  height: 3.6vw;
  background-size: 100% 100%;
  margin: auto;
  margin-top: 0.7vh;
  position: relative;
  z-index: 99;
  transform: translateZ(99px);
}
.i-bg {
  width: 6vw;
  position: relative;
  z-index: 2;
  &::after {
    content: ' ';
    position: absolute;
    width: 7.5vw;
    height: 4.5vw;
    background: url('@/assets/image/bigScreen/title-bg.png') no-repeat;
    background-size: 100%;
    background-position: 0 0;
    bottom: 16px;
    left: -10%;
    z-index: -1;
  }
  // &:nth-child(2)::after {
  //   left: -38%;
  // }
  // &:nth-child(3)::after {
  //   left: -25%;
  // }
}

:deep(.tooltip) {
  padding: 24px 24px;
  box-sizing: border-box;
  background: url('@/assets/image/bigScreen/border.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
:deep(.text) {
  margin-left: 6px;
  display: inline-block;
  font-size: 18px;
}

.legend {
  pointer-events: none;
  position: absolute;
  bottom: 0;
  right: 5%;
}
</style>
