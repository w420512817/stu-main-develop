export const screenTypeMap = {
  视力: '1',
  龋齿: '2',
  体检: '3',
  体测: '4',
  脊柱: '5'
};

export const areaTypeMap = {
  1: '全省',
  2: '全市',
  3: '全区'
};

export const areaChildMap = {
  1: '各市',
  2: '各区',
  3: '各学校'
};

/**
 * @param {Number|String} num
 * @description 小数转换成百分比
 */
export function numToPercent(num) {
  if (!num || Number.isNaN(Number(num))) {
    return 0;
  }
  return num >= 1 ? 100 : Math.round(num * 10000) / 100;
}

export const physicalMap = [
  { key: 'normalGeneralBendingRate', abKey: 'abnormalGeneralBendingRate', name: '一般检查' },
  { key: 'normalChestBendingRate', abKey: 'abnormalChestBendingRate', name: '胸段侧弯' },
  { key: 'normalWaistChestBendingRate', abKey: 'abnormalWaistChestBendingRate', name: '腰胸段侧弯' },
  { key: 'normalWaistBendingRate', abKey: 'abnormalWaistBendingRate', name: '腰段侧弯' },
  { key: 'normalAroundBendingRate', abKey: 'abnormalAroundBendingRate', name: '前后侧弯' }
];

export const physicalVaccineMap = [
  {
    key: 'bcgVaccineRate',
    noneKey: 'bcgVaccineNoneRate',
    missKey: 'bcgVaccineMissRate',
    name: '卡介'
  },
  {
    key: 'hepatitisBVaccineRate',
    noneKey: 'hepatitisBVaccineNoneRate',
    missKey: 'hepatitisBVaccineMissRate',
    name: '乙肝'
  },
  {
    key: 'poliomyelitisRate',
    noneKey: 'poliomyelitisNoneRate',
    missKey: 'poliomyelitisMissRate',
    name: '脊灰'
  },
  {
    key: 'tdapVaccineRate',
    noneKey: 'tdapVaccineNoneRate',
    missKey: 'tdapVaccineMissRate',
    name: '白百破'
  },
  {
    key: 'mmrVaccineRate',
    noneKey: 'mmrVaccineNoneRate',
    missKey: 'mmrVaccineMissRate',
    name: '麻腮风'
  },
  {
    key: 'jeVaccineRate',
    noneKey: 'jeVaccineNoneRate',
    missKey: 'jeVaccineMissRate',
    name: '乙脑'
  },
  {
    key: 'meningitisVaccineRate',
    noneKey: 'meningitisVaccineNoneRate',
    missKey: 'meningitisVaccineMissRate',
    name: '流脑'
  },
  {
    key: 'hepatitisAVaccineRate',
    noneKey: 'hepatitisAVaccineNoneRate',
    missKey: 'hepatitisAVaccineMissRate',
    name: '甲肝'
  }
];

export const fatlMap = [
  { key: 'normalRate', name: '正常率', color: 'rgba(39, 221, 255, 1)' },
  { key: 'obesityRate', name: '肥胖', color: 'rgba(243, 197, 73, 1)' },
  { key: 'malnutritionRate', name: '营养不良', color: 'rgba(16, 219, 135, 1)' }
];

export const map = {
  total: 0,
  list: [{ name: '', value: '' }]
};

export const listKeyMap = {
  1: {
    key: 'myopiaVOList',
    list: [
      {
        k: 'myopiaRate',
        name: '近视率'
      },
      {
        k: 'lowMyopiaRate',
        name: '低度近视率'
      },
      {
        k: 'mediumMyopiaRate',
        name: '中度近视率'
      },
      {
        k: 'highMyopiaRate',
        name: '高度近视率'
      }
    ]
  },
  2: {
    key: 'cariesVOList',
    list: [
      {
        k: 'cariesRate',
        name: '患龋率'
      },
      {
        k: 'dtCariesRate',
        name: '乳牙患龋率'
      },
      {
        k: 'ptCariesRate',
        name: '恒牙患龋率'
      }
    ]
  },
  3: {
    key: 'physicalExamVOList',
    list: [
      {
        k: 'obesityRate',
        name: '肥胖率'
      },
      {
        k: 'malnutritionRate',
        name: '营养不良率'
      },
      {
        k: 'abnormalSpineRate',
        name: '脊柱侧弯不良率'
      }
    ]
  },
  4: {
    key: 'physicalTestVOList',
    list: [
      {
        k: 'outstandingRate',
        name: '优秀率'
      },
      {
        k: 'goodRate',
        name: '良好率'
      },
      {
        k: 'passRate',
        name: '及格率'
      }
    ]
  }
};
