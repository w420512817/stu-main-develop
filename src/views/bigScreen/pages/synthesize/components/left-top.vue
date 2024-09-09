<template>
  <SubTitle :sub-title="'筛查数据总览'" />
  <div class="expand-all">
    <div v-for="item in dataList" :key="item.appType" :class="['absolute', item.class]">
      <div class="chart-sub-title">
        <span class="title-text">{{ item.fullName }}</span>
        <span :class="['percent', item.color]">{{ item.percent }}%</span>
      </div>
      <div class="content">
        <div class="content-item">
          <span>应筛查人数</span>
          <span :class="['percent', item.color]">{{ item.totalCount }}</span>
        </div>
        <div class="content-item">
          <span>已筛查人数</span>
          <span :class="['percent', item.color]">{{ item.screenCount }}</span>
        </div>
      </div>
    </div>

    <div class="relative chart-wrap">
      <div ref="chart" class="wh-full"></div>
      <div class="w-16vh h-16vh absolute circle1">
        <div class="w-93.5% h-93.5% absolute circle2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { useECharts } from '@common/hooks/useECharts';

import { numToPercent } from '@/views/bigScreen/data/index.data.js';
import { govDataOverview } from '@/api/bigScreen/synthesize';

const params = inject('params');

const chart = ref();
const { setOptions } = useECharts(chart);

let dataList = ref([
  {
    appType: 2,
    fullName: '龋齿筛查率',
    color: 'blue_text',
    class: 'right_top',
    startAngle: 50,
    itemStyle: {
      color: '#32a4ff'
    }
  },

  {
    appType: 4,
    fullName: '学生体测率',
    color: 'green_text',
    class: 'right_bot',
    startAngle: -50,
    itemStyle: {
      color: '#10db87'
    }
  },

  {
    appType: 3,
    fullName: '学生体检率',
    color: 'cyan_text',
    class: 'left_bot',
    startAngle: -150,
    itemStyle: {
      color: '#27ddff'
    }
  },
  {
    appType: 1,
    fullName: '视力筛查率',
    color: 'yellow_text',
    class: 'left_top',
    startAngle: -220,
    itemStyle: {
      color: '#f3c549'
    }
  }
]);

function setPie() {
  let bars = dataList.value.map((item, i) => {
    return {
      name: `pie${i}`,
      type: 'pie',
      radius: [`${69 - i * 14}%`, `${76 - i * 14}%`],
      startAngle: item.startAngle,
      labelLine: {
        show: false
      },
      itemStyle: {
        borderRadius: 4
      },
      data: [
        {
          value: item.percent,
          itemStyle: item.itemStyle
        },
        {
          value: 100 - item.percent,
          itemStyle: {
            color: 'rgba(0, 0, 0, 0)'
          }
        }
      ]
    };
  });

  let lines = dataList.value.map((item, i) => {
    return {
      type: 'pie',
      animation: false,
      radius: [`${72 - i * 14}%`, `${73 - i * 14}%`],
      startAngle: 0,
      label: { show: true },
      clockwise: true,
      emphasis: {
        disabled: true
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: '#004999'
      },
      labelLine: {
        show: false
      },
      data: [0],
      z: 1
    };
  });

  let labelLine = [
    {
      type: 'pie',
      radius: '100%',
      itemStyle: {
        color: 'transparent'
      },
      data: dataList.value.map(item => {
        return {
          name: item.fullName,
          value: 25,
          labelLine: {
            // length: 20,
            // length2: 20,
            lineStyle: {
              color: item.itemStyle.color
            }
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{hr|●}',
            rich: {
              hr: {
                fontSize: 18,
                color: item.itemStyle.color,
                padding: [10, -10, 10, -8]
              }
            }
          }
        };
      })
    }
  ];
  setOptions({
    title: {
      text: '筛查率',
      textStyle: {
        fontSize: 14,
        color: '#CDEFFB'
      },
      top: 'center',
      left: 'center'
    },
    series: bars.concat(lines, labelLine)
  });
}
async function getData() {
  const res = await govDataOverview({ planId: '', id: params.id, level: params.level });

  // console.log('left-top', res);

  dataList.value.forEach(item => {
    const temp = res.find(i => i.appType === item.appType);

    if (temp) {
      item['percent'] = numToPercent(temp.percent) || 0;
      item['screenCount'] = temp.screenCount || 0;
      item['totalCount'] = temp.totalCount || 0;
    } else {
      item['percent'] = 0;
      item['screenCount'] = 0;
      item['totalCount'] = 0;
    }
  });

  setPie();
}

onMounted(() => {
  getData();
});

watch(
  () => params.level,
  () => {
    getData();
  }
);
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/batch-select.less';
.expand-all {
  width: 100%;
  flex: 1;
  position: relative;
  padding: 0 0 0.8vw 0;

  .left_top {
    left: 0;
    top: 1vw;
  }
  .left_bot {
    left: 0;
    bottom: 0.5vw;
  }
  .right_top {
    right: 0.4vw;
    top: 1vw;
  }
  .right_bot {
    right: 0.4vw;
    bottom: 0.5vw;
  }

  .chart-sub-title {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 2.2vw;
    margin-bottom: 0.5vw;

    background-image: url('@/assets/image/bigScreen/chart-sub-title.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: -0.5vw -0.8vw;

    .title-text {
      margin-right: 0.5vw;
      font-size: 15px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #e3f7ff;
      text-shadow: 0px 4px 9px rgba(255, 255, 255, 0.25), 0px 2px 8px rgba(0, 9, 25, 0.66);
    }

    .percent {
      font-size: 1.25vw;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
    }
  }

  .content {
    padding-left: 2.2vw;

    .content-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5vw;

      & > span:nth-child(1) {
        margin-right: 0.5vw;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #cbe5f4;
      }
      & > span:nth-child(2) {
        font-size: 0.94vw;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        line-height: 21px;
      }
    }
  }

  .yellow_text {
    color: #f3c549;
  }
  .blue_text {
    color: #32a4ff;
  }
  .green_text {
    color: #10db87;
  }
  .cyan_text {
    color: #27ddff;
  }

  .chart-wrap {
    width: 38%;
    height: 46%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .circle1 {
    .inset0();
    margin: auto;
    border: 2px solid #073a61;
    border-radius: 50%;
  }
  .circle2 {
    .inset0();
    margin: auto;
    border: 2px dashed #196b97;
    border-radius: 50%;
    animation: rotate 50s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
</style>
