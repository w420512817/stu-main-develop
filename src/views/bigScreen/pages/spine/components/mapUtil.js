import * as echarts from 'echarts';

export function getColor() {
  let dColor = '#01DCE5';
  let lineColor = [
    {
      offset: 0,
      color: 'rgba(1, 220, 229, 0.9)'
    },
    {
      offset: 0.5,
      color: 'rgba(1, 220, 229, 0.7)'
    },
    {
      offset: 1,
      color: 'rgba(1, 220, 229, 0.2)'
    }
  ];
  let colorStops = [
    {
      offset: 0,
      color: 'rgba(41, 240, 254, 0.46)' // 0% 处的颜色
    },
    {
      offset: 0.75,
      color: 'rgba(41, 240, 254, 0.46)' // 100% 处的颜色
    },
    {
      offset: 0.751,
      color: 'rgba(41, 240, 254, 0.40)' // 100% 处的颜色
    },
    {
      offset: 1,
      color: 'rgba(41, 240, 254, 0.40)' // 100% 处的颜色
    }
  ];
  // let num = v.data.coords?.[2] || v.data?.[2] || v.data.percent;
  // if (viewMode.value) {
  //   if (parseFloat(num) >= 40) {
  //     dColor = 'rgba(239, 77, 62, 1)';
  //     lineColor = [
  //       {
  //         offset: 0,
  //         color: 'rgba(239, 77, 62, 1)'
  //       },
  //       {
  //         offset: 1,
  //         color: 'rgba(239, 77, 62, 0.5)'
  //       }
  //     ];
  //     colorStops = [
  //       {
  //         offset: 0,
  //         color: 'rgba(239, 77, 62, 0.41)' // 0% 处的颜色
  //       },
  //       {
  //         offset: 0.75,
  //         color: 'rgba(239, 77, 62, 0.41)' // 100% 处的颜色
  //       },
  //       {
  //         offset: 0.751,
  //         color: '#EF4D3E' // 100% 处的颜色
  //       },
  //       {
  //         offset: 1,
  //         color: '#EF4D3E' // 100% 处的颜色
  //       }
  //     ];
  //   } else if (parseFloat(num) >= 10) {
  //     dColor = '#f1c64a';
  //     lineColor = [
  //       {
  //         offset: 0,
  //         color: '#f1c64a'
  //       },
  //       {
  //         offset: 1,
  //         color: 'rgb(241,198,74, 0.5)'
  //       }
  //     ];
  //     colorStops = [
  //       {
  //         offset: 0,
  //         color: 'rgb(22,255,255, 0)' // 0% 处的颜色
  //       },
  //       {
  //         offset: 0.75,
  //         color: 'rgb(22,255,255, 0)' // 100% 处的颜色
  //       },
  //       {
  //         offset: 0.751,
  //         color: '#f1c64a' // 100% 处的颜色
  //       },
  //       {
  //         offset: 1,
  //         color: '#f1c64a' // 100% 处的颜色
  //       }
  //     ];
  //   }
  // }
  return {
    dColor,
    lineColor: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, lineColor),
    colorStops
  };
}

export function decodePolygon(coordinate, encodeOffsets, encodeScale) {
  let result = [];
  let prevX = encodeOffsets[0];
  let prevY = encodeOffsets[1];
  for (let i = 0; i < coordinate.length; i += 2) {
    let x = coordinate.charCodeAt(i) - 64;
    let y = coordinate.charCodeAt(i + 1) - 64;
    // ZigZag decoding
    x = (x >> 1) ^ -(x & 1);
    y = (y >> 1) ^ -(y & 1);
    // Delta deocding
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    // Dequantize
    result.push([x / encodeScale, y / encodeScale]);
  }
  return result;
}
export function decode(json) {
  if (!json.UTF8Encoding) {
    return json;
  }
  let encodeScale = json.UTF8Scale;
  if (encodeScale == null) {
    encodeScale = 1024;
  }
  let features = json.features;
  for (let f = 0; f < features.length; f++) {
    let feature = features[f];
    let geometry = feature.geometry;
    let coordinates = geometry.coordinates;
    let encodeOffsets = geometry.encodeOffsets;
    for (let c = 0; c < coordinates.length; c++) {
      let coordinate = coordinates[c];
      if (geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(coordinate, encodeOffsets[c], encodeScale);
      } else if (geometry.type === 'MultiPolygon') {
        for (let c2 = 0; c2 < coordinate.length; c2++) {
          let polygon = coordinate[c2];
          coordinate[c2] = decodePolygon(polygon, encodeOffsets[c][c2], encodeScale);
        }
      }
    }
  }
  // Has been decoded
  json.UTF8Encoding = false;
  return json;
}

// getValue 动态计算对应的值
export function getValue(data, customerBatteryCityData, geoCoordMap, params) {
  const res = scatterAllData(customerBatteryCityData, geoCoordMap, params).find(item => {
    return item.data.toString() == data.toString();
  });
  return res?.percent;
}

// 动态计算柱形图的高度（定一个max）
function lineMaxHeight(params) {
  let lnEnum = {
    1: 0.06,
    2: 0.02,
    3: 0.003
  };
  return lnEnum[params.level];
}
// 柱状体的主干
export function lineData(customerBatteryCityData, geoCoordMap, params) {
  return customerBatteryCityData.map(item => {
    let num = parseFloat(item.percent) > 100 ? 100 : parseFloat(item.percent);
    num = num / 8;
    return {
      coords: [
        geoCoordMap[item.name],
        [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + num * lineMaxHeight(params)],
        item.percent
      ]
    };
  });
}
// 柱状体的顶部
export function scatterData(customerBatteryCityData, geoCoordMap, params) {
  const data = scatterAllData(customerBatteryCityData, geoCoordMap, params);
  return data?.map(item => {
    return item.data;
  });
}
// 获取全额数据
export function scatterAllData(customerBatteryCityData, geoCoordMap, params) {
  return customerBatteryCityData.map(item => {
    let num = parseFloat(item.percent) > 100 ? 100 : parseFloat(item.percent);
    num = num / 8;
    return {
      name: item.name,
      value: item.value,
      percent: item.percent,
      data: [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + num * lineMaxHeight(params), item.percent]
    };
  });
}
// 柱状体的底部
export function scatterData2(customerBatteryCityData, geoCoordMap) {
  return customerBatteryCityData.map(item => {
    return {
      name: item.name,
      value: geoCoordMap[item.name],
      percent: item.percent
    };
  });
}
