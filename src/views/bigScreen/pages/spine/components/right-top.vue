<template>
  <SubTitle :sub-title="`${areaTitle}各学段筛查数据情况`" />
  <div class="flex-center h-80% w-full relative">
    <box2 class="relative ml-1.5vw">
      <div ref="chart" class="chart"></div>
    </box2>
    <div class="ml-1vw flex w-80%">
      <div
        class="left-top flex-col gap-y-0.1vh"
        :class="{ scale: dataList[0].hover }"
        @mouseleave="move(0)"
        @mouseenter="move(0, true)"
      >
        <div class="flex items-center">
          <span class="rhombus s2 mr-2"></span>
          <span class="rt_label titFont whitespace-nowrap rt_num !text-white"> 小学筛查进度 </span>
        </div>
        <div class="rt_num flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span>{{ dataList[0].completionRate || '0' }}%</span>
        </div>
        <div class="flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span class="rt_label rt_label-1"> 应筛查数 </span>
          <span class="rt_num ml-2">
            <n-number-animation :to="dataList[0].shouldUpNum">{{ dataList[0].shouldUpNum || '0' }} </n-number-animation>
          </span>
        </div>
        <div class="flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span class="rt_label rt_label-1">已筛查数</span>
          <span class="rt_num ml-2">
            <n-number-animation :to="dataList[0].upNum">{{ dataList[0].upNum || '0' }}</n-number-animation>
          </span>
        </div>
      </div>
      <div
        class="right-top flex-col gap-y-0.1vh"
        :class="{ scale: dataList[1].hover }"
        @mouseleave="move(1)"
        @mouseenter="move(1, true)"
      >
        <div class="flex items-center">
          <span class="rhombus mr-2"></span>
          <span class="rt_label titFont rt_num whitespace-nowrap !text-white">初中筛查进度</span>
        </div>
        <div class="rt_num flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span>{{ dataList[1].completionRate || '0' }}% </span>
        </div>
        <div class="flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span class="rt_label rt_label-1">应筛查数</span>
          <span class="rt_num ml-2">
            <n-number-animation :to="dataList[1].shouldUpNum">{{ dataList[1].shouldUpNum || '0' }} </n-number-animation>
          </span>
        </div>
        <div class="flex">
          <span class="rhombus mr-2 opacity-0"></span>
          <span class="rt_label rt_label-1">已筛查数</span>
          <span class="rt_num ml-2">
            <n-number-animation :to="dataList[1].upNum">{{ dataList[1].upNum || '0' }} </n-number-animation>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, inject, computed } from 'vue';
import box2 from './box2.vue';
import SubTitle from '@/views/bigScreen/component/SubTitle.vue';
import { prefxUpCondition } from '@/api/bigScreen/spine.js';
import { useECharts } from '@common/hooks/useECharts';
import { numToPercent } from '@common/utils/common';
import { areaTypeMap } from '@/views/bigScreen/data/index.data.js';

const params = inject('params');
const chart = ref();
const { setOptions, getInstance } = useECharts(chart);
const areaTitle = computed(() => areaTypeMap[params.level]);

let dataList = ref([
  {
    startAngle: 90,
    clockwise: true,
    prefxName: '小学',
    itemStyle: {
      color: '#FFB44A'
    }
  },
  {
    startAngle: 180,
    prefxName: '初中',
    itemStyle: {
      color: '#1FF2FD'
    }
  }
]);

async function getPrefxUpCondition() {
  let res = await prefxUpCondition(params);

  dataList.value = dataList.value.map((item, _index) => {
    let i = res.findIndex(v => v.prefxName === item.prefxName);
    if (i !== -1) {
      let v = res.splice(i, 1);
      v[0].completionRate = numToPercent(v[0].completionRate, 'noMax') || 0;
      // v[0].completionRate = _index * 20 + 10;
      return Object.assign({}, item, ...v);
    } else {
      return {
        completionRate: 0,
        prefx: null,
        prefxName: item.prefxName,
        shouldUpNum: null,
        upNum: null,
        itemStyle: item.itemStyle
      };
    }
  });
  setPie();
}

function setPie() {
  let bars = dataList.value.map((item, i) => {
    return {
      name: `pie${i}`,
      type: 'pie',
      radius: [`${85 - i * 20}%`, `${93 - i * 19}%`],
      startAngle: item.startAngle,
      clockwise: false,
      labelLine: {
        show: false
      },
      emphasis: {
        scaleSize: 2
      },
      data: [
        {
          value: item.completionRate,
          itemStyle: item.itemStyle
        },
        {
          value: 100 - item.completionRate,
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
      radius: [`${90 - i * 20}%`, `${90 - i * 20}%`],
      startAngle: 0,
      hoverAnimation: false,
      label: { show: true },
      clockwise: true,
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
    polar: {
      center: ['50%', '50%']
    },
    angleAxis: {
      startAngle: -90,
      clockwise: true,
      max: 100,
      // 隐藏刻度线
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    radiusAxis: {
      type: 'category',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: bars.concat(lines)
  });
  chartE();
}

function move(i, enter) {
  dataList.value[i].hover = !!enter;
  getInstance().dispatchAction({
    type: enter ? 'highlight' : 'downplay',
    seriesIndex: i
  });
}

function chartE() {
  function out() {
    dataList.value.forEach(item => {
      item.hover = false;
    });
  }
  getInstance().on('mousemove', v => {
    out();
    let index = v.seriesName.replace(/\D/g, '');
    if (index && v.dataIndex === 0 && dataList.value[index]) {
      dataList.value[index].hover = true;
    }
  });
  getInstance().on('mouseout', out);
}

watch(params, () => {
  params.planId && getPrefxUpCondition();
});
</script>

<style lang="less" scoped>
.chart {
  width: 5.5vw;
  height: 5.5vw;
}
.titFont {
  font-weight: 300 !important;
  font-size: 0.93vw !important;
}
.rt_label {
  width: 5.5vw;
  font-size: 0.8vw;
  color: #b7d5f0;
  &-1 {
    width: auto;
    margin-right: 0.2vw;
  }
}
.rt_num {
  font-size: 0.9vw;
  font-weight: bold;
}
.line {
  position: absolute;
  top: -5%;
  left: -20%;
  &::after,
  &::before {
    content: ' ';
    position: absolute;
    width: 2vh;
    height: 0.1vw;
    opacity: 0.7;
    background: #e0e10a;
  }
  &::before {
    transform-origin: right center;
    transform: rotateZ(230deg);
  }
}
.line2 {
  position: absolute;
  top: -8%;
  right: -20%;
  &::after,
  &::before {
    content: ' ';
    position: absolute;
    width: 2vh;
    height: 0.1vw;
    opacity: 0.7;
    background: #10db87;
    left: -1.4vw;
  }
  &::after {
    transform-origin: left center;
    transform: rotateZ(-230deg);
  }
}
.line3 {
  position: absolute;
  top: 106%;
  left: -20%;
  &::after,
  &::before {
    content: ' ';
    position: absolute;
    width: 2vh;
    height: 0.1vw;
    opacity: 0.7;
    background: #ffb347;
    right: -1.4vw;
    top: 45%;
  }
  &::before {
    transform-origin: right center;
    transform: rotateZ(-230deg);
  }
}
.line4 {
  position: absolute;
  top: 106%;
  right: -20%;
  &::after,
  &::before {
    content: ' ';
    position: absolute;
    width: 2vh;
    height: 0.1vw;
    opacity: 0.7;
    background: #0ed2db;
    left: -1.4vw;
    top: 48%;
  }
  &::after {
    transform-origin: left center;
    transform: rotateZ(230deg);
  }
}

.left-bottom {
  position: absolute;
  bottom: 0;
  left: 0;

  .rt_num {
    color: #ffb347;
  }
}
.right-top {
  // position: absolute;
  // top: 0;
  // right: 0;

  .rt_num {
    color: #0ed2db;
  }
}
.right-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  .rt_num {
    color: #0ed2db;
  }
}
.right-top,
.left-top,
.left-bottom,
.right-bottom {
  transition: all 0.5s;
  transform-origin: center;
  width: 50%;
  &.scale {
    transform: scale(1.08);
  }
}

.left-top {
  // position: absolute;
  // top: 0;
  // left: 0;
  .rt_num {
    color: #ffb347;
  }
}
</style>
