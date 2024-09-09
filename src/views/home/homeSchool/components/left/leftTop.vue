<template>
  <div class="flex mt-10px justify-between">
    <div ref="pieRef" class="w-135px h-135px flex-shrink-0"></div>
    <div v-if="params.screeningType" class="flex flex-wrap gap-y-6px content-center">
      <div v-show="params.screeningType < 2" class="text-[#333] text-14px w-full pl-4">
        <span>{{ chartData[params.screeningType].tit.label }}</span>
        <span class="text-30px font-bold ml-2">{{ chartData[params.screeningType].tit.v }}%</span>
      </div>
      <div v-for="item in legend[params.screeningType]" :key="item.label" class="flex w-50% text-14px text-[#333]">
        <img :src="item.icon" class="w-24px h-24px" />
        <span class="ml-6px whitespace-nowrap">
          {{ item.label }} <span class="font-bold">{{ item.v || 0 }}%</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, inject, watch } from 'vue';
import { useECharts } from '@common/hooks/useECharts';
import { planVO } from '@/api/dashbord/school';
import { numToPercent } from '@common/utils/common';

const params = inject('params');

const pieRef = ref();
const { setOptions } = useECharts(pieRef);
let legend = reactive({
  1: [
    {
      label: '非近视率',
      key: 'noMyopiaRate',
      icon: getImg(`ratio-1.png`)
    },
    {
      label: '高度近视率',
      key: 'highMyopiaRate',
      icon: getImg(`ratio-5.png`)
    },
    {
      label: '男生近视率',
      key: 'manMyopiaRate',
      icon: getImg(`ratio-4.png`)
    },
    {
      label: '中度近视率',
      key: 'mediumMyopiaRate',
      icon: getImg(`ratio-3.png`)
    },
    {
      label: '女生近视率',
      key: 'womanMyopiaRate',
      icon: getImg(`ratio-6.png`)
    },
    {
      label: '低度近视率',
      key: 'lowMyopiaRate',
      icon: getImg(`ratio-2.png`)
    }
  ],
  2: [
    {
      label: '非患龋率',
      key: 'noCariesRate',
      icon: getImg(`ratio-1.png`)
    },
    {
      label: '患龋率',
      key: 'cariesRate',
      icon: getImg(`ratio-5.png`)
    },
    {
      label: '男生患龋率',
      key: 'manCariesRate',
      icon: getImg(`ratio-4.png`)
    },
    {
      label: '女生患龋率',
      key: 'womanCariesRate',
      icon: getImg(`ratio-6.png`)
    }
  ],
  3: [
    {
      label: '正常率',
      key: 'normalRate',
      icon: getImg(`ratio-1.png`)
    },
    {
      label: '超重率',
      key: 'overweightRate',
      icon: getImg(`ratio-5.png`)
    },

    {
      label: '男生肥胖率',
      key: 'manObesityRate',
      icon: getImg(`ratio-4.png`)
    },
    {
      label: '女生肥胖率',
      key: 'womanObesityRate',
      icon: getImg(`ratio-2.png`)
    }
  ],
  4: [
    {
      label: '优秀率',
      key: 'outstandingRate',
      icon: getImg(`ratio-1.png`)
    },
    {
      label: '良好率',
      key: 'goodRate',
      icon: getImg(`ratio-3.png`)
    },
    {
      label: '及格率',
      key: 'passRate',
      icon: getImg(`ratio-4.png`)
    },
    {
      label: '不及格率',
      key: 'failureRate',
      icon: getImg(`ratio-6.png`)
    }
  ]
});
let chartData = reactive({
  1: {
    outside: [
      {
        label: '女生近视率',
        v: 0,
        key: 'womanMyopiaRate',
        itemStyle: {
          color: '#FFB52F'
        }
      },
      {
        label: '男生近视率',
        v: 0,
        key: 'manMyopiaRate',
        itemStyle: {
          color: '#00CD7E'
        }
      },
      {
        label: '非近视率',
        v: 0,
        itemStyle: {
          color: '#1F6CFF'
        },
        key: 'noMyopiaRate'
      }
    ],
    inner: [
      {
        label: '高度近视率',
        v: 0,
        key: 'highMyopiaRate',
        itemStyle: {
          color: '#FF5353'
        }
      },
      {
        label: '中度近视率',
        v: 0,
        key: 'mediumMyopiaRate',
        itemStyle: {
          color: '#9382F2'
        }
      },
      {
        label: '低度近视率',
        v: 0,
        key: 'lowMyopiaRate',
        itemStyle: {
          color: '#FFB52F'
        }
      },
      {
        label: '非近视率',
        v: 0,
        key: 'noMyopiaRate',
        itemStyle: {
          color: '#1F6CFF'
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(31,108,255,0.5)',
            shadowOffsetY: 2,
            shadowBlur: 8
          }
        }
      }
    ],
    tit: { label: '总近视率', key: 'myopiaRate', v: 0 },
    vKey: 'myopiaVO'
  },
  2: {
    outside: [
      {
        label: '患龋率',
        v: 0,
        itemStyle: {
          color: '#FF5353'
        },
        key: 'cariesRate'
      },
      {
        label: '非患龋率',
        v: 0,
        itemStyle: {
          color: '#1F6CFF'
        },
        key: 'noCariesRate',
        emphasis: {
          itemStyle: {
            shadowColor: '#1F6CFF',
            shadowOffsetY: 2,
            shadowBlur: 8
          }
        }
      }
    ],
    inner: [
      {
        label: '女生患龋率',
        v: 0,
        key: 'womanCariesRate',
        itemStyle: {
          color: '#FFB52F'
        }
      },
      {
        label: '男生患龋率',
        v: 0,
        key: 'manCariesRate',
        itemStyle: {
          color: '#01CC7F'
        }
      },
      {
        label: '非患龋率',
        v: 0,
        key: 'noCariesRate',
        itemStyle: {
          color: '#1F6CFF'
        }
      }
    ],
    tit: { label: '总患龋率', key: 'cariesRate', v: 0 },
    vKey: 'cariesVO'
  },
  3: {
    outside: [
      {
        label: '正常率',
        key: 'normalRate',
        v: 0,
        itemStyle: {
          color: '#1F6CFF'
        }
      },
      {
        label: '超重率',
        key: 'overweightRate',
        v: 0,
        itemStyle: {
          color: '#FF5353'
        }
      },

      {
        label: '男生肥胖率',
        key: 'manObesityRate',
        v: 0,
        itemStyle: {
          color: '#00CD7E'
        }
      },
      {
        label: '女生肥胖率',
        key: 'womanObesityRate',
        v: 0,
        itemStyle: {
          color: '#9483F2'
        }
      }
    ],
    tit: { label: '总肥胖率', key: 'obesityRate', v: 0 },
    vKey: 'physicalObesityVO'
  },
  4: {
    outside: [
      {
        label: '优秀率',
        v: 0,
        key: 'outstandingRate',
        itemStyle: {
          color: '#5281FF'
        }
      },
      {
        label: '良好率',
        v: 0,
        key: 'goodRate',
        itemStyle: {
          color: '#01CC7F'
        }
      },
      {
        label: '及格率',
        v: 0,
        key: 'passRate',
        itemStyle: {
          color: '#47B0FF'
        }
      },
      {
        label: '不及格率',
        v: 0,
        key: 'failureRate',
        itemStyle: {
          color: '#FFB52F'
        }
      }
    ],
    tit: { label: '总优秀率', key: 'outstandingRate', v: 0 },
    vKey: 'physicalTestVO'
  }
});

function setPie() {
  let pieData = chartData[params.screeningType || 1];
  console.log(pieData);
  // 内部展示title
  const tit = { title: {} };
  // 默认外环
  let series = [
    // 外环
    {
      name: 'bg',
      type: 'pie',
      radius: ['60%', '85%'],
      itemStyle: {
        color: '#fff',
        shadowBlur: 14,
        shadowColor: 'rgba(33,90,211,0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 4
      },
      data: [1],
      z: 0,
      emphasis: {
        disabled: true
      },
      labelLine: {
        show: false
      },
      animation: false
    },
    {
      type: 'pie',
      radius: ['67%', '78%'],
      labelLine: {
        show: false
      },
      data: pieData.outside.reduce((perv, item) => {
        if (!item.v) return perv;
        perv.push({
          value: item.v,
          itemStyle: item.itemStyle,
          emphasis: {
            itemStyle: {
              shadowColor: item.itemStyle.color,
              shadowOffsetY: 2,
              shadowBlur: 8
            }
          }
        });
        // 间隔
        perv.push({
          value: 0.015,
          itemStyle: {
            color: '#fff'
          },
          emphasis: {
            disabled: true
          }
        });
        return perv;
      }, [])
    }
  ];
  if (pieData.inner) {
    // 内环
    let innerSeries = [
      {
        type: 'pie',
        radius: [0, '50%'],
        itemStyle: {
          color: '#fff'
        },
        data: [1],
        z: 1,
        emphasis: {
          disabled: true
        },
        labelLine: {
          show: false
        },
        animation: false
      },
      {
        type: 'pie',
        radius: [0, '45%'],
        z: 2,
        labelLine: {
          show: false
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff'
        },

        data: pieData.inner.reduce((perv, item) => {
          if (!item.v) return perv;
          perv.push({
            value: item.v,
            itemStyle: item.itemStyle,
            emphasis: item.emphasis
          });
          return perv;
        }, [])
      }
    ];
    series = series.concat(innerSeries);
  }
  if (params.screeningType > 2) {
    tit.title = {
      text: chartData[params.screeningType].tit.v + '%',
      subtext: chartData[params.screeningType].tit.label,
      textStyle: {
        color: '#333',
        fontSize: 30
      },
      subtextStyle: {
        color: '#666',
        fontSize: 14
      },
      top: '28%',
      left: 'center'
    };
  }
  let option = {
    ...tit,
    // tooltip: { show: true },
    legend: { show: false },
    series
  };
  setOptions(option);
}

function getImg(v) {
  return new URL(`../../../../../assets/image/dashbord/${v}`, import.meta.url).href;
}

async function getPlanVO() {
  let resKey = chartData[params.screeningType].vKey;
  let curObj = chartData[params.screeningType];
  let res = await planVO(params);
  let resV = res[resKey];
  legend[params.screeningType].forEach(item => {
    item.v = numToPercent(resV[item.key]);
  });

  curObj.tit.v = numToPercent(resV[curObj.tit.key]);
  curObj.outside.forEach(item => {
    item.v = resV[item.key];
  });
  curObj.inner?.forEach(item => {
    item.v = resV[item.key];
  });
  setPie();
}

watch(
  () => params.planId,
  () => {
    if (params.planId && params.screeningType) {
      getPlanVO();
    }
  }
);
</script>

<style lang="less" scoped></style>
