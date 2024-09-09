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
import { ref, inject, watch, onMounted, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { govAreaCariesMap } from '@/api/bigScreen/cavity';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const {
  userInfo: { govLevel }
} = userStore;

const mapRef = ref(null);
const mapChart = ref(null);

const params = inject('params');
const paramsChange = inject('paramsChange');
const loadingFn = inject('loadingFn');

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
      return `<div class="tooltip-small">
                <div class="title mt-2.3vh pl-2.6vh">${p.data?.name || ''}</div>
                <div class="content">
                  <div class="line">
                    <span>参与人数</span>
                    <span class="text-[#F3C549]">${p.data?.totalCount || 0} <i class="unit">人</i></span>
                  </div>
                  <div class="line mt-0.5vh">
                    <span>参与学校数</span>
                    <span class="text-[#27DDFF]">${p.data?.orgNum || 0} <i class="unit">所</i></span>
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
  cacheFeatures = list.map(item => {
    return {
      id: item.id,
      name: item.properties.name
    };
  });
}

async function getAreaMapData() {
  // 重新获取地图区域数据
  const res = await govAreaCariesMap({ planId: params.planId, id: params.id, level: params.level });
  // console.log('map-data', res);
  cacheFeatures.forEach(item => {
    const temp = res.find(i => i.areaId === item.id);
    item.orgNum = temp?.orgNum || 0;
    item.totalCount = temp?.totalCount || 0;
  });
  opts.series[0].data = cacheFeatures;
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
};

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
  if (params.level + 1 === 4) return;

  // 点击地图下钻到下一级
  paramsChange('level', params.level + 1);
  paramsChange('id', obj.data.id);
  areaIds.value.push(obj.data.id);

  // 重新渲染
  const geoJson = await getGeoJson(obj.data.id);
  saveFeatures(geoJson.data.features);

  await getAreaMapData();
  // 渲染
  echarts.registerMap(obj.data.id, geoJson.data);
  opts.series[0].map = obj.data.id;
  setOptions(opts);
};

// 获取地图区域数据
async function getData() {
  try {
    loadingFn(1);
    await getAreaMapData();
    setOptions(opts);
  } finally {
    loadingFn(-1);
  }
}

onMounted(() => {
  initMap();
});

watch(
  () => params.planId,
  () => {
    getData();
  }
);
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
.tooltip-small {
  width: 19.4vh;
  height: 15.4vh;

  overflow: hidden;

  background-image: url('@/assets/image/bigScreen/tooltip-small.png');
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
    padding: 1.5vh 2.5vh 0 2.5vh;

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

        & > i {
          font-style: normal;
          font-size: 1vh;
        }
      }
    }
  }
}
</style>
