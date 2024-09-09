<template>
  <basic-modal
    v-bind="$attrs"
    :mask-closable="false"
    :title="title"
    class="w-800px"
    @register="register"
    @ok="handleSubmit"
    @visible-change="handleVisibleChange"
  >
    <n-text>机构坐标：</n-text>
    <input id="keyInput" v-model="keyword" class="search-input" type="text" placeholder="输入关键词检索位置" />

    <div id="map" ref="mapRef" class="map-container"></div>
    <!-- <div id="map2" class="w-0 h-0"></div> -->
  </basic-modal>
</template>

<script setup>
import { string } from 'vue-types';
import { ref, nextTick } from 'vue';

import { useScript } from '@common/hooks/web/useScript';
import { useModalInner } from '@common/components/custom/Modal';

const BAI_DU_MAP_URL = 'https://api.map.baidu.com/getscript?v=3.0&ak=qDuP92cC2XgSrXTIaQvG0GwTZNWQWCtU';

// const BAI_DU_MAP_URL = 'https://api.map.baidu.com/getscript?v=3.0&ak=haodxOAuDXIi4L9cqgE8qLOK8Xzk6N8I';
const defaultPoint = { lng: 120.15, lat: 30.28 }; // 默认定位到杭州
window.HOST_TYPE = '2'; // 为了百度地图的相关接口和文件也调用https协议，这里需要声明window.HOST_TYPE = '2'（目的是上面的BAI_DU_MAP_URL的返回数据里面是根据window.HOST_TYPE = '2'来判断使用https协议的）

let BMap = null;
let map = null;
let geoc = null;
let selectItem = {};

const { toPromise } = useScript({ src: BAI_DU_MAP_URL });
const [register, { closeModal }] = useModalInner();

const mapRef = ref(null);
const keyword = ref('');

const props = defineProps({
  name: string(),
  title: { type: String, default: '查询机构位置' }
});

const emit = defineEmits(['onSuccess', 'register']);

function handleVisibleChange(visible) {
  visible && initMap();
}

/**
 * 地图初始化
 * */
async function initMap() {
  await toPromise();
  await nextTick();
  BMap = window.BMap;
  map = new BMap.Map('map');
  geoc = new BMap.Geocoder();
  resetMap();

  map.addEventListener('click', function (e) {
    map.clearOverlays();
    getAddress(e.point);
  });

  let ac = new BMap.Autocomplete({ input: 'keyInput', location: map }); // 建立一个自动完成的对象
  ac.addEventListener('onconfirm', function (e) {
    // 鼠标点击下拉列表后的事件
    const { business } = e.item.value;
    let keyWords = business;
    keyword.value = business;
    searchPlace(keyWords);
  });
  keyword.value = props.name;

  props.name && searchPlace(props.name);
}

/**
 * 通过点击获取的位置
 * */
function getAddress(data) {
  geoc.getLocation(data, function (searchResult) {
    const { business: title, address, point } = searchResult;
    selectItem = { point, title, address };
    showInfoWindow(selectItem);
  });
}
/**
 * 重置地图
 * */
function resetMap() {
  map.clearOverlays(); // 清除地图上所有覆盖物
  let { lng, lat } = defaultPoint;
  const point = new BMap.Point(lng, lat); // 120.343373,31.540212
  map.centerAndZoom(point, 12);
  map.enableScrollWheelZoom(true);
}

/**
 * 检索地点
 * */
function searchPlace(keyWords) {
  map.clearOverlays(); // 清除地图上所有覆盖物
  const local = new BMap.LocalSearch(map, {
    onSearchComplete: item => {
      if (local.getStatus() === 0) {
        // 查询成功
        const { point, title, address } = item.getPoi(0);
        selectItem = { point, title, address };
        showInfoWindow(selectItem);
      } else {
        window.$message.error('没有查到哦，请重新查询');
      }
    }
  });
  local.search(keyWords);
}

/**
 * 信息窗口
 * */
function showInfoWindow({ point, title, address }) {
  map.centerAndZoom(point, 15);
  let marker = new BMap.Marker(point);
  map.addOverlay(marker); // 添加标注

  const cHtml = `<div class="result-list"><p>${title}</p><p>${address}</p><p><span>经度：${point.lng}</span> <span>纬度：${point.lat}</span></p></div>`;
  const infoWindow = new BMap.InfoWindow(cHtml, {
    offset: new BMap.Size(-5, -20),
    enableCloseOnClick: false,
    enableMessage: false
  });
  map.openInfoWindow(infoWindow, point);
}

function handleSubmit() {
  const { point } = selectItem;

  if (point) {
    emit('onSuccess', { lng: point.lng.toFixed(6), lat: point.lat.toFixed(6) });
    closeModal();
  } else {
    window.$message.error('请查询并选择机构位置');
  }
}
</script>

<style lang="less">
.map-container {
  height: calc(100vh - 300px);
}
.search-input {
  width: 250px;
  height: 40px;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 30px;
  border: 1px solid #f2f2f2;
}

.tangram-suggestion-main {
  z-index: 2001; // 比模态窗大1. 不要使用 deep写法。
}

.BMap_bubble_content {
  .result-list {
    font-size: 13px;
    p {
      line-height: 1.3;
      color: #777;
      &:first-child {
        font-size: 15px;
        color: #2080f0;
        font-weight: bold;
        margin-bottom: 5px;
      }
      &:last-child {
        margin-top: 10px;
        font-size: 12px;
        span {
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
