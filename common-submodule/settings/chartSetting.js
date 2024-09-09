export const bar_base = {
  color: [],
  legend: {
    show: true,
    left: 'left',
    top: '0'
  },
  xAxis: {
    show: true,
    boundaryGap: '3%', // 坐标轴两边留白策略
    splitLine: {
      show: false
    },
    axisLabel: { interval: 0 }
  },
  grid: {
    top: '20%'
  }
};

export const bar_per = {
  type: 'bar_per',
  ...bar_base,
  tooltip: {
    confine: true,
    formatter: function (params) {
      let str = params[0].axisValue + '<br>';
      params.forEach(v => {
        str = str + `${v.marker}${v.seriesName}：${(v.value[v.seriesName] * 100).toFixed(2) + '%'}<br>`;
      });
      return str;
    }
  },
  yAxis: {
    min: 0, // 最小百分比
    max: 1, // 最大百分比
    splitLine: {
      show: true
    },
    axisLabel: {
      formatter: value => (value * 100).toFixed(0) + '%'
    },
    axisLine: {
      // 设置轴线的属性
      show: false
    }
  },
  series: []
};

export const bar_num = {
  ...bar_base,
  type: 'bar_num',
  grid: {
    top: '30%'
  },
  yAxis: {
    splitLine: {
      show: true
    },
    axisLine: {
      // 设置轴线的属性
      show: false
    }
  }
};

export const line_base = {
  color: ['#447EFF', '#FF68C4', '#FCC40D'],
  series: [
    {
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(68, 126, 255, 0.05)'
            },
            {
              offset: 1,
              color: 'rgba(68, 126, 255, 0.1)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    },
    {
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(255, 104, 196, 0.05)'
            },
            {
              offset: 1,
              color: 'rgba(255, 104, 196, 0.1)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    },
    {
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(252, 196, 13, 0.05)'
            },
            {
              offset: 1,
              color: 'rgba(252, 196, 13, 0.1)'
            }
          ],
          global: false // 缺省为 false
        }
      }
    }
  ]
};

export const line_per = {
  type: 'line_per',
  ...line_base,
  legend: {
    show: true,
    left: 'left',
    y: 'top'
  },
  grid: {
    top: '20%'
  },
  tooltip: {
    confine: true,
    formatter: function (params) {
      let str = params[0].axisValue + '<br>';
      params.forEach(v => {
        str =
          str +
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background:${
            v.color.colorStops
              ? `linear-gradient(0deg, ${v.color.colorStops[0].color}, ${v.color.colorStops[1].color})`
              : v.color
          }"></span>${v.seriesName}：${
            v.value[v.seriesName] ? (v.value[v.seriesName] * 100).toFixed(2) + '%' : '0%'
          }<br>`;
      });
      return str;
    }
  },
  xAxis: {
    show: true,
    boundaryGap: '3%', // 坐标轴两边留白策略
    splitLine: {
      show: false
    },
    axisLabel: { interval: 0 }
  },
  yAxis: {
    // min: 0, // 最小百分比
    // max: 1, // 最大百分比
    splitLine: {
      show: true
    },
    axisLine: {
      // 设置轴线的属性
      show: false
    },
    axisLabel: {
      formatter: value => (value * 100).toFixed(0) + '%'
    }
  }
};

export const line_num = {
  type: 'line_num',
  color: [],
  legend: {
    show: true
  },
  tooltip: {
    confine: true,
    formatter: function (params) {
      let str = params[0].axisValue + '<br>';
      params.forEach(v => {
        str =
          str +
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background:${
            v.color.colorStops
              ? `linear-gradient(0deg, ${v.color.colorStops[0].color}, ${v.color.colorStops[1].color})`
              : v.color
          }"></span>${v.seriesName}：${v.value[v.seriesName] ? v.value[v.seriesName] : 0}<br>`;
      });
      return str;
    }
  },
  xAxis: {
    show: true,
    boundaryGap: false, // 坐标轴两边留白策略
    splitLine: {
      show: false
    }
  },
  yAxis: {
    splitLine: {
      show: true
    },
    axisLine: {
      // 设置轴线的属性
      show: false
    },
    axisLabel: {
      // formatter: value => (value * 100).toFixed(0) + '%'
    }
  }
};

export const pie_base = {
  color: ['#00CE74', '#FCC40D', '#FF68C4', '#447EFF'],
  title: [
    {
      top: 'center',
      left: 'center',
      textStyle: {
        rich: {
          name: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333333',
            padding: [10, 0]
          },
          val: {
            fontSize: 14,
            fontWeight: 'normal',
            color: '#333333'
          }
        }
      }
    }
  ],
  series: [
    {
      radius: ['50%', '60%'],
      center: ['50%', '50%']
    }
  ]
};

export const pie_per = {
  type: 'pie_per',

  grid: {
    top: '20%'
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return `${params.name}:${(params.value * 100).toFixed(2)}%`;
    }
  },
  label: {
    formatter: function (params) {
      return `${params.name}:${(params.value * 100).toFixed(2)}%`;
    }
  },
  // 图例 旁边的文字描述
  legend: {
    show: false,
    left: 'left',
    y: 'top'
  }
};

export const bar_row_per = {
  grid: {
    right: '5%'
  },
  tooltip: {
    confine: true,
    valueFormatter: value => (value * 100).toFixed(0) + '%'
  },
  legend: {
    show: true
  },
  xAxis: {
    type: 'value',
    show: true,
    boundaryGap: '5%', // 坐标轴两边留白策略
    axisTick: {
      show: false
    },
    splitLine: {
      show: true
    },
    axisLabel: {
      formatter: value => (value * 100).toFixed(0) + '%'
    }
  },
  yAxis: {
    type: 'category',
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      // 设置轴线的属性
      show: false
    }
  }
};
