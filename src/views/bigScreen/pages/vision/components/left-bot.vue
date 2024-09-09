<template>
  <SubTitle :sub-title="`${areaTitle}各学段上报数据`" />
  <div class="expand-all">
    <div v-for="item in dataList" :key="item.prefix" :class="['absolute', item.class]">
      <div class="content">
        <div class="content-item">
          <span>{{ item.fullName }}</span>
          <span :class="['completeRate', item.color]">{{ item.completeRate }}%</span>
        </div>
        <div class="content-item">
          <span>应上报数</span>
          <span :class="['completeRate', item.color]">{{ item.stdCount }}</span>
        </div>
        <div class="content-item">
          <span>已上报数</span>
          <span :class="['completeRate', item.color]">{{ item.completeCount }}</span>
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
import { ref, inject, watch, computed } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { prefixOverview } from '@/api/bigScreen/vision';
import { areaTypeMap, numToPercent } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const loadingFn = inject('loadingFn');
const areaTitle = computed(() => areaTypeMap[params.level]);

const chart = ref();
const { setOptions } = useECharts(chart);

let dataList = ref([
  {
    prefix: 2,
    fullName: '小学上报率',
    color: 'yellow_text',
    class: 'left_top',
    startAngle: -220,
    itemStyle: {
      color: '#FEFF38'
    }
  },
  {
    prefix: 3,
    fullName: '初中上报率',
    color: 'blue_text',
    class: 'right_top',
    startAngle: 50,
    itemStyle: {
      color: '#22DA82'
    }
  },
  {
    prefix: 4,
    fullName: '高中上报率',
    color: 'cyan_text',
    class: 'left_bot',
    startAngle: -150,
    itemStyle: {
      color: '#FFB44A'
    }
  },
  {
    prefix: 1,
    fullName: '幼儿园上报率',
    color: 'green_text',
    class: 'right_bot',
    startAngle: -50,
    itemStyle: {
      color: '#1FF2FD'
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
          value: item.completeRate,
          itemStyle: item.itemStyle
        },
        {
          value: 100 - item.completeRate,
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
      radius: '98%',
      itemStyle: {
        color: 'transparent'
      },
      data: dataList.value.map(item => {
        return {
          name: item.fullName,
          value: 25,
          labelLine: {
            length: 20,
            length2: 20,
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
      text: '类别\n占比',
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
  try {
    loadingFn(1);
    const res = await prefixOverview({ planId: params.planId, areaId: params.id });
    // console.log('left-bottom', res);
    dataList.value.forEach(item => {
      const temp = res?.find(i => i.prefix == item.prefix);

      if (temp) {
        item['completeRate'] = numToPercent(temp.completeRate) || 0;
        item['completeCount'] = temp.completeCount || 0;
        item['stdCount'] = temp.stdCount || 0;
      } else {
        item['completeRate'] = 0;
        item['completeCount'] = 0;
        item['stdCount'] = 0;
      }
    });

    setPie();
  } finally {
    loadingFn(-1);
  }
}

watch([() => params.planId, () => params.level], () => {
  getData();
});
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/batch-select.less';
.expand-all {
  width: 100%;
  flex: 1;
  position: relative;
  padding: 0 0 0.8vw 0;

  .absolute {
    // width: 35%;
    // height: 35%;
    position: absolute;
  }

  .left_top {
    left: 0;
    top: 1vh;
  }
  .left_bot {
    left: 0;
    bottom: 0;
  }
  .right_top {
    right: 0.4vw;
    top: 1vh;
  }
  .right_bot {
    right: 0.4vw;
    bottom: 0;
  }

  .content {
    padding-left: 0.8vw;

    .content-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.2vh;

      & > span:nth-child(1) {
        margin-right: 0.5vw;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #cbe5f4;
      }
      & > span:nth-child(2) {
        font-size: 18px;
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

  .chart-wrap {
    width: 38%;
    height: 80%;
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
