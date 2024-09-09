<template>
  <SubTitle :sub-title="`${areaTitle}各学段筛查情况`" />
  <div class="expand-all overflow-hidden">
    <div class="h-50%">
      <div class="relative wh-full">
        <div ref="pie" class="wh-full"></div>
        <div class="w-15vh h-15vh absolute circle1">
          <div class="w-93.5% h-93.5% absolute circle2"></div>
        </div>
      </div>
    </div>

    <div class="relative h-50%">
      <div ref="bar" class="h-full"></div>
      <!-- <div class="absolute top-16% left-9% flex-col justify-evenly h-88%">
        <img src="@/assets/image/bigScreen/bar-left.png" alt="" />
        <img src="@/assets/image/bigScreen/bar-left.png" alt="" />
        <img src="@/assets/image/bigScreen/bar-left.png" alt="" />
        <img src="@/assets/image/bigScreen/bar-left.png" alt="" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue';

import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { useECharts } from '@common/hooks/useECharts';

import { areaTypeMap, numToPercent } from '@/views/bigScreen/data/index.data.js';
import { getPrefixPhysicalScreen } from '@/api/bigScreen/phyExam';

const params = inject('params');
const loadingFn = inject('loadingFn');

const areaTitle = computed(() => areaTypeMap[params.level]);

const pie = ref();
const bar = ref();
const { setOptions: setPieOpt } = useECharts(pie);
const { setOptions: setBarOpt } = useECharts(bar);

let dataList = ref([
  {
    startAngle: -220,
    prefixName: '小学',
    itemStyle: {
      color: '#FEFF38'
    }
  },
  {
    startAngle: 50,
    prefixName: '初中',
    itemStyle: {
      color: '#22DA82'
    }
  },
  {
    startAngle: -150,
    prefixName: '普高',
    itemStyle: {
      color: '#FFB44A'
    }
  },
  {
    startAngle: -50,
    prefixName: '职高',
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
      radius: [`${56 - i * 14}%`, `${61 - i * 13}%`],
      startAngle: item.startAngle,
      labelLine: {
        show: false
      },
      itemStyle: {
        borderRadius: 4
      },
      data: [
        {
          value: item.screenRate,
          itemStyle: item.itemStyle
        },
        {
          value: 100 - item.screenRate,
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
      radius: [`${57 - i * 11}%`, `${58 - i * 11}%`],
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
      radius: '75%',
      itemStyle: {
        color: 'transparent'
      },
      data: dataList.value.map(item => {
        return {
          name: item.prefixName,
          screenRate: item.screenRate,
          value: 25,
          labelLine: {
            length: 30,
            length2: 20,
            lineStyle: {
              color: item.itemStyle.color
            }
          },
          label: {
            show: true,
            position: 'outside',
            formatter: function (params) {
              return `{name|${params.name}} {val|${params.data.screenRate}%} \n{hr|●}`;
            },
            rich: {
              hr: {
                fontSize: 18,
                color: item.itemStyle.color,
                padding: [-15, -10, 10, -8]
              },
              name: {
                fontSize: 16,
                fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN',
                color: '#CBE5F4',
                padding: [10, 10, -6, 10]
              },
              val: {
                fontSize: 20,
                fontFamily: 'DINAlternate-Bold, DINAlternate',
                fontWeight: 'bold',
                color: item.itemStyle.color,
                padding: [10, 0, -6, 0]
              }
            }
          }
        };
      })
    }
  ];
  setPieOpt({
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

function setBar(res) {
  const yAxisData = res.map(item => item.prefixName);
  const seriesData0 = res.map(item => item.allCount);
  const seriesData1 = res.map(item => item.stdCount);
  setBarOpt({
    tooltip: {
      show: false
    },
    legend: {
      // 图例相关
      show: true,
      top: 10,
      left: 20,
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#CBE5F4',
        fontSize: '12px'
      },
      data: [
        { name: '应筛查人数', itemStyle: { color: '#27DDFF' } },
        { name: '已筛查人数', itemStyle: { color: '#F3C549' } }
      ]
    },
    grid: {
      // 图形容器
      show: false,
      top: '20%',
      left: '3%',
      right: '10%',
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#CBE5F4',
        fontSize: '12px',
        margin: 20
      }
    },
    series: [
      {
        name: '应筛查人数',
        type: 'bar',
        barWidth: 8,
        barGap: '30%',
        data: seriesData0,
        label: {
          show: true,
          position: 'right',
          color: '#27DDFF'
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(39, 221, 255, 0)'
              },
              {
                offset: 0.8,
                color: 'rgba(39, 221, 255, 1)'
              },
              {
                offset: 1,
                color: 'rgba(39, 221, 255, 1)'
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      {
        name: '已筛查人数',
        type: 'bar',
        barWidth: 8,
        barGap: '100%',
        data: seriesData1,
        label: {
          show: true,
          position: 'right',
          color: '#F3C549'
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(239, 178, 36, 0)'
              },
              {
                offset: 0.8,
                color: 'rgba(239, 178, 36, 1)'
              },
              {
                offset: 1,
                color: 'rgba(239, 178, 36, 1)'
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  });
}

async function getData() {
  try {
    loadingFn(1);
    const res = await getPrefixPhysicalScreen({ planId: params.planId, id: params.id, level: params.level });

    dataList.value.forEach(item => {
      const temp = res.find(i => i.prefixName === item.prefixName);

      if (temp) {
        item['screenRate'] = numToPercent(temp.screenRate) || 0;
        item['stdCount'] = temp.stdCount || 0;
        item['allCount'] = temp.allCount || 0;
      } else {
        item['screenRate'] = 0;
        item['stdCount'] = 0;
        item['allCount'] = 0;
      }
    });

    setPie();
    setBar(res);
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
  padding: 0 0.8vw 0.8vw 0.8vw;

  ._text {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #cbe5f4;
  }
  .screenRate {
    margin-left: 0.5vw;
    font-size: 22px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
  }

  .left_top {
    display: flex;
    align-items: center;
    right: -2vw;
    top: 0.6vw;
  }
  .left_bot {
    display: flex;
    align-items: center;
    right: -2vw;
    bottom: 0.6vw;
  }
  .right_top {
    display: flex;
    align-items: center;
    left: -2vw;
    top: 0.6vw;
  }
  .right_bot {
    display: flex;
    align-items: center;
    left: -2vw;
    bottom: 0.6vw;
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
