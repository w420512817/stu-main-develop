<template>
  <div class="wh-full relative">
    <div id="map-container" ref="mapRef" class="wh-full"></div>
    <div v-if="govLevel != params.level" class="absolute top-0 left-1.5vw">
      <n-button class="text-[#F0FCFF] text-1.05vw" text @click="goBack">
        <img style="transform: rotateZ(90deg)" class="w-1.5vw" src="@/assets/image/bigScreen/down.png" />
        返回
      </n-button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, inject, onMounted, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { govAreaMap } from '@/api/bigScreen/synthesize';
import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const {
  userInfo: { govLevel }
} = userStore;

const mapRef = ref(null);
const mapChart = ref(null);

const params = inject('params');
const paramsChange = inject('paramsChange');

const { setOptions, getInstance, echarts } = useECharts(mapRef);

const opts = {
  name: 'ditu',
  type: 'map',
  roam: true,
  map: '浙江省',
  label: { show: true },
  tooltip: {
    show: true,
    trigger: 'item',
    triggerOn: 'mousemove',
    position: function (point, params, dom, rect, size) {
      return [point[0] - (size.contentSize[0] / 2).toFixed(2), point[1] - size.contentSize[1] * 0.9];
    },
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    className: 'tooltip-wrap',
    formatter: function (p) {
      return `<div class="tooltip-large">
                <div class="title mt-2.5vh pl-2.6vh">${p.name}</div>
                <div class="content">
                  <div class="line mt-0.6vh">
                    <span>视力筛查筛查率</span>
                    <span class="text-[#F3C549]">${numToPercent(p.data?.visionScreenRate) || 0}%</span>
                  </div>
                  <div class="line mt-0.6vh">
                    <span>龋齿筛查筛查率</span>
                    <span class="text-[#32A4FF]">${numToPercent(p.data?.cariesScreenRate) || 0}%</span>
                  </div>
                  <div class="line mt-0.6vh">
                    <span>学生体测筛查率</span>
                    <span class="text-[#27DDFF]">${numToPercent(p.data?.phyExamScreenRate) || 0}%</span>
                  </div>
                  <div class="line mt-0.6vh">
                    <span>学生体检筛查率</span>
                    <span class="text-[#10DB87]">${numToPercent(p.data?.phyTestScreenRate) || 0}%</span>
                  </div>
                </div>
              </div>`;
    }
  },
  series: [
    {
      type: 'map',
      data: [],

      roam: true, // 开启鼠标缩放和平移漫游
      zoom: 1.25, // 地图缩放比例
      scaleLimit: {
        min: 0.8 // 缩放比例下限
      },
      map: '', // 此处需要和registerMap时声明的map名称一致
      label: {
        // 每一块内的文本样式
        show: true,
        color: '#fff',
        fontSize: 13,
        distance: 10,
        fontFamily: 'titleBlack'
      },
      itemStyle: {
        // 地图上每一块区域的样式
        areaColor: '#0277FF',
        borderColor: '#46CAFF',
        borderWidth: 2
      },
      emphasis: {
        // 鼠标悬浮(高亮)后样式
        itemStyle: {
          borderColor: '#43C1F5',
          areaColor: '#005CC4'
        }
      },
      select: {
        // 鼠标点击(选中)后样式
        disabled: true
      }
    }
  ]
};

const areaIds = ref([params.id]);
// 保存上一级地图的code
const lastAreaId = computed(() => {
  return areaIds.value.at(-1);
});

// 保存当前的地图边界信息
let cacheFeatures = [];

// 获取地图边界信息
async function getGeoJson(id) {
  return axios({
    url: `//cdn.qdsgvision.com/map-res/json/${id}.json`,
    method: 'get'
  });
}

// 保存当前地图区块的id和name
function saveFeatures(list) {
  let prevData = {};
  if (params.level == 3) {
    prevData = cacheFeatures.find(item => item.id == list[0].id);
  }
  cacheFeatures = list.map(item => {
    return {
      id: item.id,
      name: item.properties.name,
      ...prevData
    };
  });
}

// 地图初始化，只在挂载后触发一次
const initMap = async () => {
  const geoJson = await getGeoJson(params.id);
  saveFeatures(geoJson.data.features);
  echarts.registerMap(params.id, geoJson.data);
  opts.series[0].map = params.id;

  mapChart.value = getInstance();
  mapChart.value.on('click', mapClick);
  setOptions(opts);
  await getData();
};

async function getAreaMapData() {
  // 区级取市级的信息
  // if (params.level == 3) return;
  // 重新获取地图区域数据
  const res = await govAreaMap({ planId: '', id: params.id, level: params.level });
  cacheFeatures.forEach(item => {
    const temp = res.find(i => i.areaId === item.id);
    item.visionScreenRate = temp?.visionScreenRate || 0;
    item.cariesScreenRate = temp?.cariesScreenRate || 0;
    item.phyExamScreenRate = temp?.phyExamScreenRate || 0;
    item.phyTestScreenRate = temp?.phyTestScreenRate || 0;
  });
  opts.series[0].data = cacheFeatures;
}

// 返回上一级地图
async function goBack() {
  areaIds.value.splice(areaIds.value.length - 1, 1);
  paramsChange('level', params.level - 1);
  paramsChange('id', lastAreaId.value);
  // 重新渲染
  const geoJson = await getGeoJson(lastAreaId.value);
  saveFeatures(geoJson.data.features);
  await getAreaMapData();
  echarts.registerMap(lastAreaId.value, geoJson.data);
  opts.series[0].map = lastAreaId.value;
  setOptions(opts);
}

// 区块点击事件，下钻
const mapClick = async obj => {
  // console.log('obj', obj);

  // 区级不再下钻
  if (params.level === 3) return;

  // 点击地图下钻到下一级
  paramsChange('level', params.level + 1);
  paramsChange('id', obj.data.id);
  areaIds.value.push(obj.data.id);

  // 重新渲染
  const geoJson = await getGeoJson(obj.data.id);
  saveFeatures(geoJson.data.features);

  // 重新获取地图区域数据
  await getAreaMapData();
  // 渲染
  echarts.registerMap(obj.data.id, geoJson.data);
  opts.series[0].map = obj.data.id;
  setOptions(opts);
};

// 获取地图区域数据
async function getData() {
  await getAreaMapData();

  setOptions(opts);
}

onMounted(() => {
  initMap();
});
</script>

<style lang="less" scoped>
:deep(.n-spin-content) {
  height: 100%;
}

.subtitle-colored {
  width: 176px;
  height: 24px;
  box-sizing: border-box;
  padding-left: 1vw;

  background-image: url('@/assets/image/bigScreen/colored-sub-title.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 center;

  font-size: 14px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #e3f7ff;
  text-shadow: 0px 2px 8px rgba(0, 9, 25, 0.66);
}

.subtitle {
  width: 80%;
  height: 37px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #e3f7ff;

  border-bottom: 1px solid;
  border-image: linear-gradient(45deg, rgba(22, 100, 170, 0), rgba(101, 168, 227, 1), rgba(23, 104, 176, 0)) 1 1;
}

.area {
  width: 80%;
  height: 37px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(194, 221, 255, 0.8);
  border-bottom: 1px solid;
  border-image: linear-gradient(45deg, rgba(22, 100, 170, 0), rgba(101, 168, 227, 1), rgba(23, 104, 176, 0)) 1 1;
}

.yellow-text {
  font-size: 14px;
  font-family: SourceHanSansCN-Heavy, SourceHanSansCN;
  font-weight: 800;
  color: #f6c745;
  text-shadow: 0px 1px 2px #082f6e;
}
</style>

<style lang="less">
.tooltip-wrap {
  box-shadow: none !important;
}
.tooltip-large {
  width: 19.4vh;
  height: 21.6vh;

  overflow: hidden;

  background-image: url('@/assets/image/bigScreen/tooltip-largest.png');
  background-size: 100%;
  background-repeat: no-repeat;

  .title {
    box-sizing: border-box;
    font-size: 1.85vh;
    font-family: YouSheBiaoTiHei;
    color: #e3f7ff;
  }

  .content {
    box-sizing: border-box;
    padding: 1.5vh 1vh 0 2.5vh;

    .line {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > span:nth-child(1) {
        font-size: 1.3vh;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #cbe5f4;
      }
      & > span:nth-child(2) {
        font-size: 1.67vh;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
      }
    }
  }
}
</style>
