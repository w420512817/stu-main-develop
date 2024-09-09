export const sourceDataEnum = {
  // 一般检查

  bendGeneralInspection: {
    1: '正常',
    2: '双肩不等高',
    3: '双侧肩胛骨下角不等高',
    4: '两侧腰凹不对称',
    5: '双侧髂嵴不等高',
    6: '棘突连线倾斜或偏离正中线'
  },
  // 前屈胸段

  anteriorFlexionThoracic: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  // 前屈腰胸段

  anteriorFlexionWaistChest: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  spinalMovementTest: {
    1: '是',
    0: '否'
  },
  // 前屈腰段

  anteriorLumbarFlexion: {
    1: '无侧弯',
    2: '左低右高ATR＜5°',
    3: '左低右高ATR≥5°',
    4: '右低左高ATR＜5°',
    5: '右低左高ATR≥5°'
  },
  // 胸段ATR

  thoracicSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 腰胸ATR

  thoracolumbarSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 腰段ATR

  lumbarSegmentAtr: {
    1: 'ATR＜5°',
    2: '5°≤ATR＜7°',
    3: '7°≤ATR＜10°',
    4: 'ATR≥10°'
  },
  // 一般检查2

  bfBendGeneralInspection: {
    1: '正常',
    2: '前凸体征',
    3: '后凸体征'
  },
  // 俯卧试验

  proneTest: {
    1: '前后凸体征消失',
    2: '前凸体征',
    3: '后凸体征'
  },
  // 疾病史
  historyDisease: {
    1: '无',
    2: '脊柱弯曲异常家族史',
    3: '脊柱外伤病史',
    4: '脊柱手术病史'
  },
  // 建议
  suggestion: {
    1: '保持健康方式',
    2: '随访',
    3: '进一步检查确认'
  }
};
