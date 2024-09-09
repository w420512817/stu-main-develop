export const toothOptions = [
  [
    { label: 'A-无龋', value: 'A', id: 1 },
    { label: 'B-冠龋', value: 'B', id: 2 },
    { label: 'C-已充填有龋', value: 'C', id: 3 },
    { label: 'D-已充填无龋', value: 'D', id: 4 },
    { label: 'E-因龋缺失', value: 'E', id: 5 },
    { label: 'X-缺牙', value: 'X', id: 6 },
    { label: 'Q-其他', value: 'Q', id: 7 }
  ],
  [
    { label: '0-无龋', value: '0', id: 8 },
    { label: '1-冠龋', value: '1', id: 9 },
    { label: '2-已充填有龋', value: '2', id: 10 },
    { label: '3-已充填无龋', value: '3', id: 11 },
    { label: '4-因龋缺失', value: '4', id: 12 },
    { label: '5-缺牙', value: '5', id: 13 },
    { label: '9-其他', value: '9', id: 14 }
  ]
];

export const defWidth = [70, 70, 110, 110, 94, 70, 70, 88];

export const refOpt = [
  'leftTop8',
  'leftTop7',
  'leftTop8',
  'leftTop6',
  'leftTop5',
  'leftTop4',
  'leftTop3',
  'leftTop2',
  'leftTop1',
  'rightTop1',
  'rightTop2',
  'rightTop3',
  'rightTop4',
  'rightTop5',
  'rightTop6',
  'rightTop7',
  'rightTop8',
  'leftBottom8',
  'leftBottom7',
  'leftBottom6',
  'leftBottom5',
  'leftBottom4',
  'leftBottom3',
  'leftBottom2',
  'leftBottom1',
  'rightBottom1',
  'rightBottom2',
  'rightBottom3',
  'rightBottom4',
  'rightBottom5',
  'rightBottom6',
  'rightBottom7',
  'rightBottom8'
];

export const optJSON = [
  [
    { label: ['', '18'], num: 1, field: 'leftTop8', disabled: 1, type: 1 },
    { label: ['', '17'], num: 2, field: 'leftTop7', disabled: 2, type: 1 },
    { label: ['', '16'], num: 3, field: 'leftTop6', disabled: 3, type: 1 },
    { label: ['55', '15'], num: 4, field: 'leftTop5', disabled: 3, type: 2 },
    { label: ['54', '14'], num: 5, field: 'leftTop4', disabled: 3, type: 2 },
    { label: ['53', '13'], num: 6, field: 'leftTop3', disabled: 3, type: 2 },
    { label: ['52', '12'], num: 7, field: 'leftTop2', disabled: 3, type: 2 },
    { label: ['51', '11'], num: 8, field: 'leftTop1', disabled: 3, type: 2 },
    { label: ['61', '21'], num: 9, field: 'rightTop1', disabled: 3, type: 2 },
    { label: ['62', '22'], num: 10, field: 'rightTop2', disabled: 3, type: 2 },
    { label: ['63', '23'], num: 11, field: 'rightTop3', disabled: 3, type: 2 },
    { label: ['64', '24'], num: 12, field: 'rightTop4', disabled: 3, type: 2 },
    { label: ['65', '25'], num: 13, field: 'rightTop5', disabled: 3, type: 2 },
    { label: ['', '26'], num: 14, field: 'rightTop6', disabled: 3, type: 1 },
    { label: ['', '27'], num: 15, field: 'rightTop7', disabled: 2, type: 1 },
    { label: ['', '28'], num: 16, field: 'rightTop8', disabled: 1, type: 1 }
  ],
  [
    { label: ['48'], num: 17, field: 'leftBottom8', disabled: 1, type: 1 },
    { label: ['47'], num: 18, field: 'leftBottom7', disabled: 2, type: 1 },
    { label: ['46'], num: 19, field: 'leftBottom6', disabled: 3, type: 1 },
    { label: ['45', '85'], num: 20, field: 'leftBottom5', disabled: 3, type: 2 },
    { label: ['44', '84'], num: 21, field: 'leftBottom4', disabled: 3, type: 2 },
    { label: ['43', '83'], num: 22, field: 'leftBottom3', disabled: 3, type: 2 },
    { label: ['42', '82'], num: 23, field: 'leftBottom2', disabled: 3, type: 2 },
    { label: ['41', '81'], num: 24, field: 'leftBottom1', disabled: 3, type: 2 },
    { label: ['31', '71'], num: 25, field: 'rightBottom1', disabled: 3, type: 2 },
    { label: ['32', '72'], num: 26, field: 'rightBottom2', disabled: 3, type: 2 },
    { label: ['33', '73'], num: 27, field: 'rightBottom3', disabled: 3, type: 2 },
    { label: ['34', '74'], num: 28, field: 'rightBottom4', disabled: 3, type: 2 },
    { label: ['35', '75'], num: 29, field: 'rightBottom5', disabled: 3, type: 2 },
    { label: ['36'], num: 30, field: 'rightBottom6', disabled: 3, type: 1 },
    { label: ['37'], num: 31, field: 'rightBottom7', disabled: 2, type: 1 },
    { label: ['38'], num: 32, field: 'rightBottom8', disabled: 1, type: 1 }
  ]
];
export const cariesItems = [
  {
    formItem: [
      'healthyGums',
      'gingivitis',
      'periodontitis',
      'tartar',
      'superficialPeriodontalPocket',
      'deepPeriodontalPocket',
      'boilingMottledTooth',
      'malocclusion',
      'enamelHypoplasia',
      'denture',
      'otherDiseases'
    ],
    code: 'yazhou',
    type: 'inputCariesScreeningQuery'
  },
  {
    formItem: ['totalPermanentNum'],
    code: 'hengya',
    type: 'inputCariesScreeningQuery'
  },
  {
    formItem: refOpt,
    code: 'quchi',
    type: 'inputCariesScreeningQuery'
  }
];
