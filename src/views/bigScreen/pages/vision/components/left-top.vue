<template>
  <n-select
    v-model:show="selectShow"
    v-model:value="currentBatch"
    class="batch-select"
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
  <SubTitle :sub-title="`${areaTitle}上报数据总览`" />
  <div class="expand-all flex">
    <div class="h-full w-40% flex justify-center items-center relative">
      <div ref="ball" class="wh-full"></div>
      <div class="w-14.5vh h-14.5vh absolute circle1">
        <div class="w-95% h-95% absolute circle2"></div>
      </div>
      <div class="chart-title">总上报率</div>
    </div>
    <div class="h-full w-60% flex-col gap-y-0.5vh">
      <div>
        <div class="subtitle-colored">上报情况</div>
        <div class="flex">
          <div class="flex-col items-center">
            <div class="subtitle-num m-b-4px">
              <n-number-animation :to="resObj?.stdCount || 0">{{ resObj?.stdCount || 0 }}</n-number-animation>
            </div>
            <div class="subtitle-text">应上报人数</div>
          </div>
          <div class="m-l-4vw flex-col items-center">
            <div class="subtitle-num m-b-4px">
              <n-number-animation :to="resObj?.completionCount || 0">
                {{ resObj?.completionCount || 0 }}
              </n-number-animation>
            </div>
            <div class="subtitle-text">实际上报人数</div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex-col">
        <div class="subtitle-colored">近视情况</div>
        <div ref="bar" class="flex-1"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed, reactive } from 'vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { useECharts } from '@common/hooks/useECharts';
import { planList } from '@common/api/examine/plan';
import { screenVisionOverview } from '@/api/bigScreen/vision';
import { screenTypeMap, areaTypeMap, numToPercent } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const paramsChange = inject('paramsChange');
const loadingFn = inject('loadingFn');

const currentBatch = ref('');
const selectShow = ref(false);
const selectOptions = ref([]);
const areaTitle = computed(() => areaTypeMap[params.level]);

const ball = ref();
const bar = ref();
const { setOptions: setBall } = useECharts(ball);
const { setOptions: setBar } = useECharts(bar, 'bigScreen');

const dataList = reactive([
  { key: 'unionHighMyopiaRate', name: '高度', rate: 0, color: '#F96161' },
  { key: 'unionMediumMyopiaRate', name: '中度', rate: 0, color: '#F6D59D' },
  { key: 'unionLowMyopiaRate', name: '低度', rate: 0, color: '#5E97FD' },
  { key: 'unionGirlMyopiaRate', name: '女生', rate: 0, color: '#E3B0F9' },
  { key: 'unionBoyMyopiaRate', name: '男生', rate: 0, color: '#67E5F6' },
  { key: 'unionMyopiaRate', name: areaTitle, rate: 0, color: '#A0FFC4' }
]);

const resObj = ref(null);

const ballOpts = {
  tooltip: {
    show: false
  },
  series: [
    {
      type: 'liquidFill',
      radius: '48%',
      center: ['50%', '50%'],
      data: [0, 0], // data个数代表波浪数
      backgroundStyle: {
        borderWidth: 0,
        color: 'transparent'
      },
      // 修改波浪颜色
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#446DC5'
            },
            {
              offset: 1,
              color: '#1FD3FB'
            }
          ]
        }
      ],
      label: {
        position: ['50%', '60%'],
        formatter: '%',
        fontSize: 30,
        color: '#E3F7FF'
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#2B5A90'
        }
      }
    },
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['50%', '50.5%'],
      borderCap: 'round',
      startAngle: -90,
      data: [
        {
          // 外圈进度条
          name: '',
          value: 30,
          labelLine: {
            show: false
          },
          itemStyle: {
            borderColor: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#1877C6'
                },
                {
                  offset: 1,
                  color: '#A6CBE9'
                }
              ]
            },
            borderWidth: 4
          },
          emphasis: {
            disabled: true,
            scale: false
          },
          label: {
            show: false
          }
        },
        {
          // 外圈左侧进度条头部的圆球
          name: '',
          value: 1,
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{hr|●}',
            rich: {
              hr: {
                color: '#AFF0FF',
                fontSize: 20,
                padding: [0, -10, 0, -4]
              }
            }
          },
          emphasis: {
            disabled: true,
            scale: false
          }
        },
        {
          // 画剩余的刻度圆环
          name: '',
          value: 60,
          itemStyle: {
            color: 'transparent'
          },
          emphasis: {
            disabled: true
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        },
        {
          // 解决叠加明显的问题
          name: '',
          value: 0.2,
          itemStyle: {
            color: 'rgba(0,0,0,0)'
          }
        }
      ]
    },
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['50%', '50.5%'],
      borderCap: 'round',
      startAngle: -90,
      clockwise: false,
      data: [
        {
          // 外圈进度条
          name: '',
          value: 30,
          labelLine: {
            show: false
          },
          itemStyle: {
            borderColor: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#1877C6'
                },
                {
                  offset: 1,
                  color: '#A6CBE9'
                }
              ]
            },
            borderWidth: 4
          },
          emphasis: {
            disabled: true
          },
          label: {
            show: false
          }
        },
        {
          // 外圈左侧进度条头部的圆球
          name: '',
          value: 1,
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{hr|●}',
            rich: {
              hr: {
                color: '#AFF0FF',
                fontSize: 20,
                padding: [0, -10, 0, -20]
              }
            }
          },
          emphasis: {
            disabled: true,
            labelLine: {
              show: false
            },
            itemStyle: {
              color: '#5886f0'
            }
          }
        },
        {
          // 画剩余的刻度圆环
          name: '',
          value: 60,
          itemStyle: {
            color: 'transparent'
          },
          emphasis: {
            disabled: true
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        },
        {
          // 解决叠加明显的问题
          name: '',
          value: 0.2,
          itemStyle: {
            color: 'rgba(0,0,0,0)'
          }
        }
      ]
    }
  ]
};

const barOpts = {
  tooltip: { show: true },
  legend: { show: false },
  grid: {
    // 图形容器
    show: false,
    top: 5,
    left: 5,
    right: 80,
    bottom: -10
  },
  yAxis: {
    type: 'category',
    splitLine: {
      show: false
    },
    axisTick: { show: false },
    axisLine: {
      show: false
    },
    axisLabel: {
      color: '#CBE5F4',
      fontSize: '12px'
    },
    data: []
  },
  xAxis: {
    show: false,
    type: 'value',
    max: 100,
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: [
    {
      // 小方块
      tooltip: { show: false },
      type: 'pictorialBar',
      symbolRepeat: 'fixed',
      symbolMargin: 3,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [4, 10],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      colorBy: 'data',
      data: [],
      width: 2,
      z: 0,
      zlevel: 1
    },
    {
      // 背景色
      tooltip: { show: false },
      type: 'pictorialBar',
      itemStyle: {
        color: '#0C335C'
      },
      symbolRepeat: 'fixed',
      symbolMargin: 0,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [24, 14],
      symbolPosition: 'start',
      symbolOffset: [0, 0],
      data: [],
      width: 4,
      z: 0,
      zlevel: 0
    }
  ]
};

function handleUpdateValue(val) {
  paramsChange('planId', val);
}

async function getPlanList() {
  const { list } = await planList({ appType: screenTypeMap['视力'] });

  // console.log('planList', records);

  if (!list.length) return;
  selectOptions.value = list;
  currentBatch.value = list[0].planId;
  paramsChange('planId', currentBatch.value);
}

async function getData() {
  try {
    loadingFn(1);
    const res = await screenVisionOverview({ planId: currentBatch.value, areaId: params.id });
    // console.log('left-top', res);

    resObj.value = res;

    ballOpts.series[0].label.formatter = numToPercent(res?.completionRate) + '%';
    let v = res?.completionRate || 0;
    ballOpts.series[0].data = [v, v];
    setBall(ballOpts);

    dataList.forEach(item => {
      item.rate = numToPercent(res[item.key]);
    });

    barOpts.yAxis.data = dataList.map(item => item.name);
    barOpts.series[0].data = dataList.map(item => {
      return {
        name: item.name,
        value: item.rate,
        itemStyle: {
          color: item.color
        }
      };
    });
    barOpts.series[1].data = Array(dataList.length).fill(100);

    setBar(barOpts);
  } finally {
    loadingFn(-1);
  }
}

onMounted(() => {
  getPlanList();
});

watch([() => params.planId, () => params.level], () => {
  getData();
});
</script>

<style lang="less" scoped>
@import '@/views/bigScreen/styles/batch-select.less';

.batch-select {
  width: 60%;
  height: 2.2vw;
  padding-left: 0.5vw;
}
.expand-all {
  width: 100%;
  flex: 1;
  position: relative;

  .absolute {
    position: absolute;
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
.subtitle-num {
  font-size: 16px;
  font-family: Arial-Black, Arial;
  font-weight: 900;
  color: #ffffff;
}
.subtitle-text {
  font-size: 14px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #729dcb;
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

.chart-title {
  position: absolute;
  bottom: 0.5vh;

  font-size: 16px;
  font-family: YouSheBiaoTiHei;
  color: #e3f7ff;
}
</style>
