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
  <SubTitle :sub-title="`${areaTitle}筛查数据总览`" />
  <div class="flex">
    <div class="chart-sub-title relative">
      <span class="title-text absolute top--0.6vh left-0px">应筛查人次</span>
      <span class="percent">
        <n-number-animation :to="resObj.totalCount">{{ resObj.totalCount }}</n-number-animation>
      </span>
    </div>
    <div class="chart-sub-title relative">
      <span class="title-text absolute top--0.6vh left-0px">已筛查人次</span>
      <span class="percent">
        <n-number-animation :to="resObj.screenCount">{{ resObj.screenCount }}</n-number-animation>
      </span>
    </div>
  </div>
  <div class="expand-all">
    <div class="relative wh-full">
      <div ref="chart" class="wh-full"></div>
      <div class="w-15vh h-15vh absolute circle1">
        <div class="w-93.5% h-93.5% absolute circle2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useECharts } from '@common/hooks/useECharts';
import { ref, onMounted, inject, watch, computed } from 'vue';
import { numToPercent, screenTypeMap, areaTypeMap } from '@/views/bigScreen/data/index.data.js';

import SubTitle from '@/views/bigScreen/component/SubTitle.vue';

import { planList } from '@common/api/examine/plan';
import { govCariesScreenOverview } from '@/api/bigScreen/cavity';

const params = inject('params');
const paramsChange = inject('paramsChange');
const loadingFn = inject('loadingFn');

const chart = ref();
const currentBatch = ref('');

const selectShow = ref(false);
const selectOptions = ref([]);
const { setOptions } = useECharts(chart);

const areaTitle = computed(() => areaTypeMap[params.level]);

const resObj = ref({
  manPercent: 0,
  percent: 0,
  screenCount: 0,
  totalCount: 0,
  womanPercent: 0
});

let dataList = ref([
  {
    prefixName: '男生筛查率',
    key: 'manPercent',
    val: 70,
    itemStyle: {
      color: 'rgba(39, 221, 255, 1)'
    }
  },
  {
    key: 'womanPercent',
    prefixName: '女生筛查率',
    val: 30,
    itemStyle: {
      color: 'rgba(243, 197, 73, 1)'
    }
  }
]);

function setPie() {
  // 图表最外侧label
  let labelLine = [
    {
      type: 'pie',
      radius: '75%',
      clockwise: false,
      itemStyle: {
        color: 'transparent'
      },
      data: dataList.value.map(item => {
        return {
          name: item.prefixName,
          screenRate: item.screenRate,
          value: item.val,
          labelLine: {
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
                padding: [-12, -10, 10, -8]
              },
              name: {
                fontSize: 16,
                fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN',
                color: '#CBE5F4',
                padding: [10, 0, -6, 10]
              },
              val: {
                fontSize: 18,
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
  let outLinePie = [
    {
      // 男生，数据实时
      type: 'pie',
      clockwise: false,
      radius: ['54%', '59%'],
      label: { show: false },
      emphasis: {
        disabled: true
      },
      labelLine: {
        show: false
      },
      data: [
        {
          name: '1',
          value: dataList.value[0].screenRate,
          itemStyle: {
            color: '#51C2FF'
          }
        },
        {
          name: '2',
          value: dataList.value[1].screenRate,
          itemStyle: {
            color: 'transparent'
          }
        }
      ],
      z: 9
    }
  ];

  setOptions({
    title: {
      text: `${(resObj.value.percent * 100).toFixed(2)}%`,
      subtext: '总筛查率',
      textStyle: {
        fontSize: 22,
        color: '#CDEFFB',
        fontWeight: 'bold',
        fontFamily: 'DINAlternate-Bold,DINAlternate'
      },
      itemGap: 5,
      subtextStyle: {
        fontSize: 15,
        color: '#CDEFFB',
        fontWeight: 'bold',
        fontFamily: 'SourceHanSansCN-Bold,SourceHanSansCN'
      },
      top: '40%',
      left: 'center'
    },
    series: [
      {
        // 标题外圈提示线
        type: 'pie',
        animation: false,
        radius: ['45%', '47%'],
        label: { show: true },
        clockwise: true,
        emphasis: {
          disabled: true
        },
        itemStyle: {
          color: '#05315B'
        },
        labelLine: {
          show: false
        },
        data: [0],
        z: 1
      },
      {
        // 女生，固定一整圈
        type: 'pie',
        animation: false,
        radius: ['55%', '58%'],
        label: { show: false },
        clockwise: true,
        emphasis: {
          disabled: true
        },
        itemStyle: {
          color: '#F68B44'
        },
        labelLine: {
          show: false
        },
        data: [100],
        z: 1
      }
    ].concat(outLinePie, labelLine)
  });
}

function handleUpdateValue(val) {
  paramsChange('planId', val);
}

async function getPlanList() {
  const { records } = await planList({ appType: screenTypeMap['龋齿'] });

  // console.log('planList', records);

  if (!records.length) return;
  selectOptions.value = records;
  currentBatch.value = records[0].planId;
  paramsChange('planId', currentBatch.value);
}

async function setBar() {
  try {
    loadingFn(1);
    const res = await govCariesScreenOverview({ planId: currentBatch.value, id: params.id, level: params.level });
    // console.log('left-top', res);

    resObj.value = res;

    dataList.value.forEach(item => {
      item['screenRate'] = numToPercent(res[item.key]) || 0;
    });

    setPie();
  } finally {
    loadingFn(-1);
  }
}

onMounted(() => {
  getPlanList();
});

watch([() => params.planId, () => params.level], () => {
  setBar();
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
  padding: 0 0 0.8vw 0;
}

.chart-sub-title {
  display: flex;
  height: 40px;
  width: 50%;
  align-items: center;
  box-sizing: border-box;

  .title-text {
    width: 7.7vw;
    height: 56px;
    padding-left: 2.2vw;
    font-size: 15px;
    line-height: 50px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #e3f7ff;
    text-shadow: 0px 4px 9px rgba(255, 255, 255, 0.25), 0px 2px 8px rgba(0, 9, 25, 0.66);

    background-image: url('@/assets/image/bigScreen/chart-sub-title.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: left center;
  }

  .percent {
    font-size: 1.4vw;
    line-height: 40px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #e3f7ff;

    padding-left: 45%;
  }
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
</style>
