<template>
  <SubTitle :sub-title="`${areaTitle}BMI值人数`" />
  <div class="flex justify-evenly">
    <div v-for="item in dataList" :key="item.name" class="chart-sub-title">
      <span class="title-text">{{ item.name }}</span>
      <span class="percent">
        <n-number-animation :to="item.num">{{ item.num }}</n-number-animation>
      </span>
    </div>
  </div>
  <div ref="chart" class="expand-all"></div>
</template>

<script setup>
import { ref, reactive, watch, inject, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { getPhysicalFatVO } from '@/api/bigScreen/phyExam';
import { areaTypeMap, fatlMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');

const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart, 'bigScreen');

const dataList = reactive([
  { name: '正常人数', num: 0, key: 'normalStdCount', color: 'rgba(39, 221, 255, 1)' },
  { name: '肥胖人数', num: 0, key: 'obesityStdCount', color: 'rgba(243, 197, 73, 1)' },
  { name: '营养不良', num: 0, key: 'malnutritionStdCount', clolr: 'rgba(16, 219, 135, 1)' }
]);

const opts = {
  tooltip: {
    show: false
  },
  legend: {
    show: false
  },
  series: [
    {
      name: '全省BMI值人数',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,

      data: [
        { value: 0, name: '正常' },
        { value: 0, name: '肥胖' },
        { value: 0, name: '营养不良' }
      ]
    }
  ]
};

async function getData() {
  try {
    loadingFn(1);
    const res = await getPhysicalFatVO({
      planId: params.planId,
      id: params.id,
      level: params.level
    });

    // console.log('right-bot', res);

    dataList.forEach(item => {
      item.num = Number(res[item.key]);
    });

    // const tempList = [
    //   {
    //     value: 10,
    //     name: '正常率'
    //   },
    //   {
    //     value: 10,
    //     name: '肥胖'
    //   },
    //   {
    //     value: 10,
    //     name: '营养不良'
    //   }
    // ];
    const tempList = [];

    const dataTotal = tempList.reduce((prev, curr) => prev + curr.value, 0);

    tempList.forEach((item, idx) => {
      item.percent = item.value / dataTotal;
      item.angle = item.percent * Math.PI * 2; // 弧度制的角度
      if (idx == 0) {
        item.startAngle = 0;
        item.endAngle = item.angle;
      } else {
        item.startAngle = tempList[idx - 1].startAngle + tempList[idx - 1].angle;
        item.endAngle = item.startAngle + item.angle;
      }
    });

    // 颜色列表
    const _color = [
      {
        r: 39,
        g: 221,
        b: 255
      },
      {
        r: 243,
        g: 197,
        b: 73
      },
      {
        r: 16,
        g: 219,
        b: 135
      }
    ];

    fatlMap.forEach(it => {
      // it.key
      tempList.push({
        value: res[it.key],
        name: it.name,
        label: {
          show: true,
          position: 'outside',
          formatter: '{name|{b}} {val|{d}%} \n{hr|●}',
          rich: {
            hr: {
              color: it.color,
              fontSize: 18,
              padding: [-14, -12, 0, -10]
            },
            name: {
              fontSize: 16,
              fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN',
              color: '#CBE5F4',
              padding: [0, 10, -6, 10]
            },
            val: {
              fontSize: 20,
              fontFamily: 'DINAlternate-Bold, DINAlternate',
              fontWeight: 'bold',
              color: it.color,
              padding: [0, 0, -6, 0]
            }
          }
        }
      });
    });

    // console.log('right-bot-tempList', tempList);

    opts.series[0].data = setGradientColorInItemStyle(tempList, _color);

    setOptions(opts);
  } finally {
    loadingFn(-1);
  }
}
function getCoordinates(startArc, endArc) {
  // 这里计算扇形最外层的x,y坐标
  const position = [Math.sin(startArc), -Math.cos(startArc), Math.sin(endArc), -Math.cos(endArc)];
  // 这里求得了最外层两个顶点坐标的差值。
  const dx = position[2] - position[0];
  const dy = position[3] - position[1];

  // 这里在根据两点坐标的差值计算x,y,x2,y2
  return getLocation(dx, dy);
}

function getLocation(dx, dy) {
  const tanV = dx / dy;
  // 这里是在计算按照横向渐变还是按照纵向渐变。
  const directSign = Math.abs(tanV) < 1;
  const t = directSign ? tanV : 1 / tanV;

  const sign1 = t > 0 ? 1 : -1;
  const sign2 = dx > 0 ? 1 : -1;
  const sign = directSign ? sign1 * sign2 : sign2;

  // 把整个圆形的坐标映射到了[0-1]之间0.5，0.5即为圆心坐标。
  const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2];
  // 这里给纵向渐变还是横向渐变赋值、即group中的第三项和第四项的值
  const group2 = sign > 0 ? [0, 1] : [1, 0];
  const group = [...group1, ...group2];
  const keys = directSign ? ['x', 'x2', 'y', 'y2'] : ['y', 'y2', 'x', 'x2'];

  const res = {};
  keys.forEach((k, idx) => {
    res[k] = group[idx];
  });
  return res;
}

function setGradientColorInItemStyle(data, colorlist, startOpacity = 1, endOpacity = 0) {
  for (let i = 0; i < data.length; i++) {
    const color = colorlist[i];
    const startAngle = data[i].startAngle;
    const endAngle = data[i].endAngle;
    // 这里计算了 线性渐变的起止方向
    // @ts-ignore
    const coordinates = getCoordinates(startAngle, endAngle);
    data[i].itemStyle = {
      color: {
        ...coordinates,
        type: 'linear',
        global: false,
        colorStops: [
          {
            offset: 1,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${startOpacity})`
          },
          {
            offset: 0,
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${endOpacity})`
          }
        ]
      }
    };
  }
  return data;
}

watch([() => params.planId, () => params.level], () => {
  getData();
});
</script>

<style lang="less" scoped>
.expand-all {
  width: 100%;
  flex: 1;
}
.chart-sub-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 1.2vw;

  background-image: url('@/assets/image/bigScreen/chart-sub-title.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: -0.5vw -0.3vw;

  .title-text {
    margin-right: 0.5vw;
    font-size: 15px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #e3f7ff;
    text-shadow: 0px 4px 9px rgba(255, 255, 255, 0.25), 0px 2px 8px rgba(0, 9, 25, 0.66);
  }

  .percent {
    font-size: 18px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #e3f7ff;
  }
}
</style>
