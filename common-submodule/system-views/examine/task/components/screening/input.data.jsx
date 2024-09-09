import { markRaw } from 'vue';
export const sectionAndMinte = ['thousand', 'fiftyEight', 'eightHundred'];
export const numAndStringPhysicalKeys = ['weight', 'height', 'bmi'];
export const numAndStringCheckupKeys = [
  'weight',
  'height',
  'waistline',
  'hipline',
  'bust',
  'bmi',
  'hb',
  'lfGpt',
  'lfBil',
  'bloodPlateletCount',
  'whiteBloodCellCount',
  'redBloodCellCount'
];
export const multiCheckupKeys = [
  'heart',
  'lung',
  'chest',
  'skin',
  'pastMedicalHistory',
  'leftUpperLimb',
  'rightUpperLimb',
  'leftEarGuess',
  'rightEarGuess',
  'nose',
  'pathologicalChanges'
];

export const multiCheckupStringKeys = ['historyDisease', 'bendGeneralInspection'];

export const yazhouOptions = [
  { value: 'healthyGums', label: '未见明显异常', exclusive: 1 },
  { value: 'gingivitis', label: '牙龈炎' },
  { value: 'periodontitis', label: '牙周炎' },
  { value: 'tartar', label: '牙结石' },
  { value: 'superficialPeriodontalPocket', label: '浅牙周袋' },
  { value: 'deepPeriodontalPocket', label: '深牙周袋' },
  { value: 'boilingMottledTooth', label: '氟斑牙' },
  { value: 'malocclusion', label: '错颌' },
  { value: 'enamelHypoplasia', label: '牙釉质发育不全' },
  { value: 'denture', label: '义齿' },
  { value: 'otherDiseases', label: '其他牙病' }
];
export const tuberculosisOptions = [
  { label: '有肺结核密接史', value: 1 },
  { label: '无肺结核密接史', value: 2 }
];
export const normalStatus3 = [
  { value: 0, label: '血红蛋白-正常' },
  { value: 1, label: '贫血' }
];
export const normalStatus2 = [
  { value: 1, label: '阴性' },
  { value: 2, label: '阳性' }
];
export const normalStatus = [
  { value: 1, label: '正常' },
  { value: 2, label: '异常' }
];
export const eyeLesions = [
  { value: 1, label: '无病变', exclusive: 1 },
  { value: 2, label: '弱视' },
  { value: 3, label: '斜视' },
  { value: 4, label: '外伤' },
  { value: 5, label: '先天异常' },
  { value: 6, label: '其他眼病' }
];
export const conjunctivitisIlls = [
  { value: 1, label: '无结膜炎' },
  { value: 2, label: '结膜炎' },
  { value: 3, label: '疑似结膜炎' }
];
export const colorVisions = [
  { value: 1, label: '正常' },
  { value: 2, label: '色弱' },
  { value: 3, label: '色盲' }
];
export const trachomaIllness = [
  { value: 1, label: '无沙眼' },
  { value: 2, label: '沙眼' },
  { value: 3, label: '疑似沙眼' }
];
export const channelingMirrors = [
  { value: 1, label: '正常' },
  { value: 2, label: '近视' },
  { value: 3, label: '远视' },
  { value: 4, label: '其他' }
];
// export const tonsilIllness = [
//   { value: 1, label: '未见明显异常' },
//   { value: 2, label: '异常' },
//   { value: 3, label: '1度肿大' },
//   { value: 4, label: '2度肿大' },
//   { value: 5, label: '3度肿大' },
//   { value: 6, label: '扁桃体发炎' }
// ];
export const earsIllness = [
  { value: 1, label: '未见明显异常', exclusive: 1 },
  { value: 2, label: '其他异常' },
  { value: 3, label: '耵聍' },
  { value: 4, label: '附耳' },
  { value: 5, label: '中耳炎' },
  { value: 6, label: '耳前痿管' }
];
export const noseIllness = [
  { value: 1, label: '未见明显异常', exclusive: 1 },
  { value: 2, label: '其他异常' },
  { value: 3, label: '鼻炎' },
  { value: 4, label: '鼻窦炎' },
  { value: 5, label: '鼻中隔偏曲' },
  { value: 6, label: '鼻息肉' },
  { value: 7, label: '鼻衄' },
  { value: 8, label: '鼻前庭炎' }
];
export const hearIllness = [
  { value: 1, label: '正常' },
  { value: 2, label: '听力减退' },
  { value: 3, label: '耳聋' }
];
export const SideBendStatus = [
  { value: 1, label: '无侧弯' },
  { value: 2, label: '左低右高Ⅰ度' },
  { value: 3, label: '左低右高Ⅱ度' },
  { value: 4, label: '左低右高Ⅲ度' },
  { value: 5, label: '右低左高Ⅰ度' },
  { value: 6, label: '右低左高Ⅱ度' },
  { value: 7, label: '右低左高Ⅲ度' }
];
export const SideBendStatus2 = [
  { value: 1, label: '无前后弯曲异常' },
  { value: 2, label: '前凸异常Ⅰ度' },
  { value: 3, label: '前凸异常Ⅱ度' },
  { value: 4, label: '前凸异常Ⅲ度' },
  { value: 5, label: '后凸异常Ⅰ度' },
  { value: 6, label: '后凸异常Ⅱ度' },
  { value: 7, label: '后凸异常Ⅲ度' },
  { value: 8, label: '平背Ⅰ度' },
  { value: 9, label: '平背Ⅱ度' },
  { value: 10, label: '平背Ⅲ度' }
];
export const bloodTypes = [
  { value: 1, label: 'A型' },
  { value: 2, label: 'B型' },
  { value: 3, label: 'AB型' },
  { value: 4, label: 'O型' },
  { value: 5, label: 'Rh型' }
];
export const lymphadenList = [
  { value: 1, label: '未触及（正常)' },
  { value: 2, label: '淋巴结肿大' }
];
export const armslegs = [
  { value: 1, label: '未见明显异常', exclusive: 1 },
  { value: 2, label: '其他异常' },
  { value: 3, label: 'O型腿' },
  { value: 4, label: '并指畸形' },
  { value: 5, label: '内八字' },
  { value: 6, label: 'X型腿' },
  { value: 7, label: '关节畸形' },
  { value: 8, label: '关节功能受限' },
  { value: 9, label: '外伤' },
  { value: 10, label: '四肢残缺' },
  { value: 11, label: '脑瘫' },
  { value: 12, label: '小儿麻痹' },
  { value: 13, label: '跛行' }
];
export const chestList = [
  { value: 1, label: '未见明显异常', exclusive: 1 },
  { value: 2, label: '其他异常' },
  { value: 3, label: '鸡胸' },
  { value: 4, label: '漏斗胸' },
  { value: 5, label: '扁平胸' },
  { value: 6, label: '纵膈肿瘤术后' },
  { value: 7, label: '胸廓不对称' }
];
export const skinsList = [
  { value: 1, label: '红润', exclusive: 1 },
  { value: 2, label: '其他异常 ' },
  { value: 3, label: '湿疹' },
  { value: 4, label: '皮肤癣' },
  { value: 5, label: '白癜风' },
  { value: 6, label: '手术或外伤' },
  { value: 7, label: '血管瘤' },
  { value: 8, label: '疥疮' },
  { value: 9, label: '鱼鳞病' },
  { value: 10, label: '皮炎' }
];
export const lungIllness = [
  { value: 1, label: '双肺呼吸音清未及明显干湿啰音', exclusive: 1 },
  { value: 2, label: '其他异常' },
  { value: 3, label: '哮喘音（哮喘）' },
  { value: 4, label: '干湿性啰音（肺炎）' },
  { value: 5, label: '双肺呼吸音增粗' }
];
export const heartIllness = [
  { value: 1, label: '心律齐未及明显杂音', exclusive: 1 },
  { value: 2, label: '心脏1级杂音', group: 1 },
  { value: 3, label: '心脏2级杂音', group: 1 },
  { value: 4, label: '心脏3级以上杂音', group: 1 },
  { value: 6, label: '心率不齐' },
  { value: 7, label: '频发早搏' }
];
export const spleenIllness = [
  { value: 1, label: '肋下未及' },
  { value: 2, label: '肿大' },
  { value: 3, label: '轻度肿大' }
];
export const liverIllness = [
  { value: 1, label: '肋下未及' },
  { value: 2, label: '肿大' },
  { value: 3, label: '肝脏肿大轻度' },
  { value: 4, label: '肝脏肿大中度以上' }
];
export const anamnesis = [
  { value: 1, label: '均无', exclusive: 1 },
  { value: 2, label: '肝炎' },
  { value: 3, label: '肾炎' },
  { value: 4, label: '心脏病' },
  { value: 5, label: '高血压' },
  { value: 6, label: '贫血' },
  { value: 7, label: '糖尿病' },
  { value: 8, label: '过敏性哮喘' },
  { value: 9, label: '身体残疾' },
  { value: 10, label: '近二周有不明原因咳嗽或咳痰' }
];
export const vaccinatedList1 = [
  { value: 1, label: '已全程接种' },
  { value: 2, label: '未接种' },
  { value: 3, label: '有漏种' }
];
export const vaccinatedList2 = [
  { value: 2, label: '未接种' },
  { value: 3, label: '有漏种' }
];
export const checkModeList = [
  { value: 0, label: '医师输入' },
  { value: 1, label: '学生自查' }
];
export const eyeChartTypeList = [
  { value: 1, label: '标准对数视力表(5米)' },
  { value: 4, label: '标准对数视力表(2.5米)' },
  { value: 2, label: 'C型对数视力表' },
  { value: 3, label: '儿童对数视力表' }
];
export const eyeChartTypeListSelf = [{ value: 1, label: '标准对数视力表(5米)' }];
export const wearGlassTypeList = [
  { value: 0, label: '无' },
  { value: 1, label: '框架眼镜' },
  { value: 2, label: '隐形眼镜' },
  { value: 3, label: 'OK镜' }
];
export const remarkList = [
  { value: 1, label: '学生不配合' },
  { value: 2, label: '人眼缺陷' },
  { value: 3, label: '忘记OK镜度数' },
  { value: 4, label: '其他' }
];
export const visionNumOpt = [
  { value: '5.0', label: '5.0' },
  { value: '4.9', label: '4.9' },
  { value: '4.8', label: '4.8' },
  { value: '4.7', label: '4.7' },
  { value: '4.6', label: '4.6' },
  { value: '4.5', label: '4.5' },
  { value: '4.4', label: '4.4' },
  { value: '4.3', label: '4.3' },
  { value: '4.2', label: '4.2' },
  { value: '4.1', label: '4.1' },
  { value: '4.0', label: '4.0' },
  { value: '3.9', label: '3.9' },
  { value: '3.8', label: '3.8' },
  { value: '3.7', label: '3.7' },
  { value: '3.6', label: '3.6' },
  { value: '3.5', label: '3.5' },
  { value: '3.4', label: '3.4' },
  { value: '3.3', label: '3.3' }
];
export const visionNum = [
  { value: '5.3', label: '5.3' },
  { value: '5.2', label: '5.2' },
  { value: '5.1', label: '5.1' },
  ...visionNumOpt
];

export const visionData = {
  slSource: 0,
  eyeChartType: 1,
  isGlasses: 0,
  odVision: null,
  osVision: null,
  odEyesight: null,
  osEyesight: null,
  odGlasses: null,
  osGlasses: null,
  remarkType: null,
  remark: null
};
export const diopterData = {
  dpOdSph: null,
  dpOsSph: null,
  dpOdCyl: null,
  dpOsCyl: null,
  dpOdAxial: null,
  dpOsAxial: null,

  dpRemarkType: null,
  dpRemark: null,

  orbRightR1Mm: null,
  orbLeftR1Mm: null,
  orbRightR1D: null,
  orbLeftR1D: null,
  orbRightR2Mm: null,
  orbLeftR2Mm: null,
  orbRightR2D: null,
  orbLeftR2D: null,
  orbRightAx: null,
  orbLeftAx: null
};

export const periodontalData = {
  healthyGums: null,
  gingivitis: null,
  periodontitis: null,
  tartar: null,
  superficialPeriodontalPocket: null,
  deepPeriodontalPocket: null,
  boilingMottledTooth: null,
  malocclusion: null,
  enamelHypoplasia: null,
  denture: null,
  otherDiseases: null
};

export const permanentData = {
  totalPermanentNum: null
};

export const saprodontiaData = {
  rightTop1: null,
  rightTop2: null,
  rightTop3: null,
  rightTop4: null,
  rightTop5: null,
  rightTop6: null,
  rightTop7: null,
  rightTop8: null,
  rightBottom1: null,
  rightBottom2: null,
  rightBottom3: null,
  rightBottom4: null,
  rightBottom5: null,
  rightBottom6: null,
  rightBottom7: null,
  rightBottom8: null,
  leftTop1: null,
  leftTop2: null,
  leftTop3: null,
  leftTop4: null,
  leftTop5: null,
  leftTop6: null,
  leftTop7: null,
  leftTop8: null,
  leftBottom1: null,
  leftBottom2: null,
  leftBottom3: null,
  leftBottom4: null,
  leftBottom5: null,
  leftBottom6: null,
  leftBottom7: null,
  leftBottom8: null
};

export const checkupData = {
  examCheckupId: null,
  bcgVaccine: null,
  bcgVaccineRemark: null,
  hepatitisBVaccine: null,
  hepatitisBVaccineRemark: null,
  poliomyelitis: null,
  poliomyelitisRemark: null,
  tdapVaccine: null,
  tdapVaccineRemark: null,
  mmrVaccine: null,
  mmrVaccineRemark: null,
  jeVaccine: null,
  jeVaccineRemark: null,
  meningitisVaccine: null,
  meningitisVaccineRemark: null,
  hepatitisAVaccine: null,
  hepatitisAVaccineRemark: null,
  pastMedicalHistory: null,
  ageOfSpermatogenesis: null,
  ageOfMenarche: null,
  height: null,
  weight: null,
  bust: null,
  waistline: null,
  hipline: null,
  bmi: null,
  tuberculosisInquiry: null,
  heart: null,
  lung: null,
  liver: null,
  spleen: null,
  head: null,
  neck: null,
  chest: null,
  limbs: null,
  skin: null,
  ln: null,
  meg: null,
  leftUpperLimb: null,
  rightUpperLimb: null,
  chestBending: null,
  waistChestBending: null,
  waistBending: null,
  aroundBending: null,
  leftEarHearing: null,
  rightEarHearing: null,
  leftEarGuess: null,
  rightEarGuess: null,
  nose: null,
  tonsil: null,
  leftTrachoma: null,
  rightTrachoma: null,
  leftKcs: null,
  rightKcs: null,
  pathologicalChanges: null,
  leftCv: null,
  rightCv: null,
  leftStringOfMirror: null,
  rigthtStringOfMirror: null,
  odEyesight: null,
  osEyesight: null,
  bt: null,
  hb: null,
  helminthEggs: null,
  redBloodCellCount: null,
  whiteBloodCellCount: null,
  bloodPlateletCount: null,
  isAnemia: null,
  lfGptL: null,
  lfBil: null,
  tuberculinTest: null,
  bendGeneralInspection: null, // 以下是脊柱侧弯相关字段
  anteriorFlexionThoracic: null,
  anteriorFlexionWaistChest: null,
  spinalMovementTest: 0,
  anteriorLumbarFlexion: null,
  thoracicSegmentAtr: null,
  thoracolumbarSegmentAtr: null,
  lumbarSegmentAtr: null,
  bfBendGeneralInspection: null,
  proneTest: null,
  historyDisease: null
};
export const physicalData = {
  physicalId: null,
  abdominal: null,
  abdominalRemark: null,
  height: null,
  weight: null,
  bmi: null,
  body_remark: null,
  eightHundred: null,
  eightHundredRemark: null,
  thousand: null,
  thousandRemark: null,
  fifty: null,
  fiftyRemark: null,
  fiftyEight: null,
  fiftyEightRemark: null,
  jump: null,
  jumpRemark: null,
  pullUp: null,
  pullUpRemark: null,
  skipping: null,
  skippingRemark: null,
  stf: null,
  stfRemark: null,
  vc: null,
  vcRemark: null
};

export const spineData = {
  bendGeneralInspection: ['1'],
  anteriorFlexionThoracic: 1,
  anteriorFlexionWaistChest: 1,
  anteriorLumbarFlexion: 1,
  thoracicSegmentAtr: null,
  thoracolumbarSegmentAtr: null,
  lumbarSegmentAtr: null,
  bfBendGeneralInspection: 1,
  spinalMovementTest: 0,
  proneTest: null,
  historyDisease: ['1'],
  suggestion: ['1'],
  spineId: null,
  operatorName: undefined,
  updateTime: undefined
};

import CheckupItem1 from './components/CheckupItem1.vue';
import LabelAndInput from './components/LabelAndInput.vue';
import BMI from './components/BMI.vue';
import Growth from './components/growth.vue';
import diopter from './components/diopter.vue';
import vision from './components/vision.vue';
import vision2 from './vision/vision.vue';
import diopters from './vision/diopters.vue';
import run from './components/run.vue';
import saprodontia from './components/saprodontia.vue';
import bodyshape from './components/bodyshape.vue';
import spine from './components/spine.vue';
import SpineCurvature from './spine/SpineCurvature.vue';
import SpineAround from './spine/SpineAround.vue';
import SpineDisHis from './spine/SpineDisHis.vue';

export const examCheckupItems = [
  {
    code: 'tz_kajiemiao',
    formItem: ['bcgVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'bcgVaccine', title: '卡介苗', type: 2, options: vaccinatedList1 },
      { key: 'bcgVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_yxgyym',
    formItem: ['hepatitisBVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'hepatitisBVaccine', title: '乙型肝炎疫苗', type: 2, options: vaccinatedList1 },
      { key: 'hepatitisBVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_gshzyyz',
    formItem: ['poliomyelitis'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'poliomyelitis', title: '脊髓灰质炎疫症', type: 2, options: vaccinatedList1 },
      { key: 'poliomyelitisRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_bbpym',
    formItem: ['tdapVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'tdapVaccine', title: '百白破疫苗', type: 2, options: vaccinatedList1 },
      { key: 'tdapVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_msfym',
    formItem: ['mmrVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'mmrVaccine', title: '麻腮风疫苗', type: 2, options: vaccinatedList1 },
      { key: 'mmrVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_lnym',
    formItem: ['meningitisVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'meningitisVaccine', title: '流脑疫苗', type: 2, options: vaccinatedList1 },
      { key: 'meningitisVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_ynym',
    formItem: ['jeVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'jeVaccine', title: '乙脑疫苗', type: 2, options: vaccinatedList1 },
      { key: 'jeVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_jgym',
    formItem: ['hepatitisAVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'hepatitisAVaccine', title: '甲肝疫苗', type: 2, options: vaccinatedList1 },
      { key: 'hepatitisAVaccineRemark', title: '建议', type: 1 }
    ]
  },
  {
    code: 'tz_jwbs',
    formItem: ['pastMedicalHistory'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'pastMedicalHistory', title: '既往病史', type: 3, options: anamnesis }]
  },
  {
    code: 'tz_qtym', // 这个业务里不用
    formItem: ['otherVaccine'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'otherVaccine', title: '其他疫苗', type: 1, options: vaccinatedList1 }]
  },
  {
    code: 'tz_qcqfy',
    formItem: ['ageOfSpermatogenesis', 'ageOfMenarche'],
    component: markRaw(Growth),
    title: '青春期发育',
    type: 'inputCheckUpScreeningQuery'
  },
  {
    code: 'tz_stxt',
    formItem: ['height', 'weight', 'bust', 'waistline', 'hipline', 'bmi'],
    component: markRaw(bodyshape),
    title: '身体形态',
    type: 'inputCheckUpScreeningQuery'
  },
  {
    code: 'tz_fjhmqjcsjkyzzwz',
    component: markRaw(CheckupItem1),
    formItem: ['tuberculosisInquiry'],
    type: 'inputCheckUpScreeningQuery',
    formItemConfig: [
      {
        key: 'tuberculosisInquiry',
        title: '肺结核密切接触史及可疑症状问诊',
        options: tuberculosisOptions,
        type: 2,
        required: true
      }
    ]
  },
  {
    code: 'tz_xin',
    formItem: ['heart'],
    component: markRaw(CheckupItem1),
    type: 'inputCheckUpScreeningQuery',
    formItemConfig: [{ key: 'heart', title: '心', options: heartIllness, type: 3 }]
  },
  {
    code: 'tz_fei',
    formItem: ['lung'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'lung', title: '肺', type: 3, options: lungIllness }]
  },
  {
    code: 'tz_gan',
    formItem: ['liver'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'liver', title: '肝', type: 2, options: liverIllness }]
  },
  {
    code: 'tz_pi',
    formItem: ['spleen'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'spleen', title: '脾', type: 2, options: spleenIllness }]
  },
  {
    code: 'tz_toubu',
    formItem: ['head'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'head', title: '头部', type: 2, options: normalStatus }]
  },
  {
    code: 'tz_jingbu',
    formItem: ['neck'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'neck', title: '颈部', type: 2, options: normalStatus }]
  },
  {
    code: 'tz_zuoshangzhi',
    formItem: ['leftUpperLimb'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'leftUpperLimb', title: '左上肢', type: 3, options: armslegs }]
  },
  {
    code: 'tz_youshangzhi',
    formItem: ['rightUpperLimb'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'rightUpperLimb', title: '右上肢', type: 3, options: armslegs }]
  },
  {
    code: 'tz_sizhi',
    formItem: ['limbs'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'limbs', title: '四肢', type: 2, options: normalStatus }]
  },
  {
    code: 'tz_xiongbu',
    formItem: ['chest'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'chest', title: '胸部', type: 3, options: chestList }]
  },
  {
    code: 'tz_pifu',
    formItem: ['skin'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'skin', title: '皮肤', type: 3, options: skinsList }]
  },
  {
    code: 'tz_linbajie',
    formItem: ['ln'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'ln', title: '淋巴结', type: 2, options: lymphadenList }]
  },
  {
    code: 'tz_nxwszq',
    formItem: ['meg'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'meg', title: '男性外生殖器', type: 2, options: normalStatus }]
  },
  {
    code: 'tz_jzwqybjc',
    formItem: [
      'bendGeneralInspection',
      'anteriorFlexionThoracic',
      'anteriorFlexionWaistChest',
      'anteriorLumbarFlexion',
      'spinalMovementTest',
      'thoracicSegmentAtr',
      'thoracolumbarSegmentAtr',
      'lumbarSegmentAtr'
    ],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(spine)
  },
  {
    code: 'tz_jzqhwqybjc',
    formItem: ['bfBendGeneralInspection', 'proneTest'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(spine)
  },
  {
    code: 'tz_jzjbs',
    formItem: ['historyDisease'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(spine)
  },
  // 以下老的脊柱侧弯 ---start
  {
    code: 'tz_xdcw',
    formItem: ['chestBending'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'chestBending', title: '胸段侧弯', type: 2, options: SideBendStatus }]
  },
  {
    code: 'tz_yxdcw',
    formItem: ['waistChestBending'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'waistChestBending', title: '腰胸段侧弯', type: 2, options: SideBendStatus }]
  },
  {
    code: 'tz_ydcw',
    formItem: ['waistBending'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'waistBending', title: '腰段弯曲', type: 2, options: SideBendStatus }]
  },
  {
    code: 'tz_qhwq',
    formItem: ['aroundBending'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'aroundBending', title: '前后弯曲', type: 2, options: SideBendStatus2 }]
  },
  // 以上老的脊柱侧弯 ---end

  {
    code: 'tz_wedygm',
    formItem: ['rightEarGuess', 'leftEarGuess'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'leftEarGuess', title: '外耳道与鼓膜（左耳）', type: 3, options: earsIllness },
      { key: 'rightEarGuess', title: '外耳道与鼓膜（右耳）', type: 3, options: earsIllness }
    ]
  },
  {
    code: 'tz_bi',
    formItem: ['nose'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'nose', title: '鼻', type: 3, options: noseIllness }]
  },
  {
    code: 'tz_tingli',
    formItem: ['rightEarHearing', 'leftEarHearing'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'rightEarHearing', title: '听力（右耳）', type: 2, options: hearIllness },
      { key: 'leftEarHearing', title: '听力（左耳）', type: 2, options: hearIllness }
    ]
  },
  {
    code: 'tz_quguang',
    formItem: ['r1', 'r2', 'ax', 'axial', 'cyl', 'sph', 'dpRemarkType'],
    component: markRaw(diopter),
    type: 'inputCheckUpScreeningQuery'
  },
  {
    code: 'tz_shili',
    formItem: ['vision', 'eyesight', 'glasses', 'remarkType'],
    component: markRaw(vision),
    type: 'inputCheckUpScreeningQuery'
  },
  {
    code: 'tz_chuanjing',
    formItem: ['rigthtStringOfMirror', 'leftStringOfMirror'],
    title: '串镜',
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'rigthtStringOfMirror', title: '串镜（左眼）', type: 2, options: channelingMirrors },
      { key: 'leftStringOfMirror', title: '串镜（右眼）', type: 2, options: channelingMirrors }
    ]
  },
  {
    code: 'tz_yjsfybb',
    formItem: ['pathologicalChanges'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'pathologicalChanges', title: '眼睛是否有病变', type: 3, options: eyeLesions }]
  },

  {
    code: 'tz_shayan',
    formItem: ['rightTrachoma', 'leftTrachoma'],
    title: '沙眼',
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'rightTrachoma', title: '沙眼（左眼）', type: 2, options: trachomaIllness },
      { key: 'leftTrachoma', title: '沙眼（右眼）', type: 2, options: trachomaIllness }
    ]
  },
  {
    code: 'tz_jiemoyan',
    formItem: ['leftKcs', 'rightKcs'],
    title: '结膜炎',
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'leftKcs', title: '结膜炎（左眼）', type: 2, options: conjunctivitisIlls },
      { key: 'rightKcs', title: '结膜炎（右眼）', type: 2, options: conjunctivitisIlls }
    ]
  },
  {
    code: 'tz_sejue',
    formItem: ['leftCv', 'rightCv'],
    title: '色觉',
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'leftCv', title: '色觉（左眼）', type: 2, options: colorVisions },
      { key: 'rightCv', title: '色觉（右眼）', type: 2, options: colorVisions }
    ]
  },
  {
    code: 'tz_yazhou',
    formItem: ['yazhou'],
    component: markRaw(CheckupItem1),
    title: '牙周',
    type: 'inputCheckUpScreeningQuery',
    formItemConfig: [{ key: 'yazhou', title: '牙周', type: 3, options: yazhouOptions }]
  },
  {
    code: 'tz_hyzs',
    formItem: ['totalPermanentNum'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      { key: 'totalPermanentNum', title: '恒牙总数', type: 4, suffix: '颗', message: '', max: 32, min: 0, precision: 0 }
    ]
  },
  {
    code: 'tz_quchi',
    formItem: ['quchi'],
    title: '龋齿',
    component: markRaw(saprodontia)
  },
  {
    code: 'tz_xuechanggui',
    formItem: ['redBloodCellCount', 'whiteBloodCellCount', 'whiteBloodCellCount'],
    title: '血常规',
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      {
        key: 'redBloodCellCount',
        title: '红细胞计数',
        type: 4,
        required: true,
        suffix: '10^12/L',
        min: 1,
        max: 10,
        precision: 1,
        message: '范围1-10，必须是0.1的整数倍'
      },
      {
        key: 'whiteBloodCellCount',
        title: '白细胞计数',
        type: 4,
        required: true,
        suffix: '10^9/L',
        min: 0.1,
        max: 200,
        precision: 1,
        message: '范围0-200，必须是0.1的整数倍'
      },
      {
        key: 'bloodPlateletCount',
        title: '血小板计数',
        type: 4,
        required: true,
        suffix: '10^9/L',
        min: 0.1,
        max: 800,
        precision: 1,
        message: '范围0-800，必须是0.1的整数倍'
      }
    ]
  },
  {
    code: 'tz_xuexing',
    formItem: ['bt'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'bt', title: '血型', type: 2, options: bloodTypes }]
  },
  {
    code: 'tz_xhdb',
    formItem: ['hb'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [
      {
        key: 'hb',
        title: '血红蛋白',
        type: 4,
        required: true,
        suffix: 'g/L',
        min: 50,
        max: 240,
        precision: 1,
        message: '范围50-240，必须是0.1的整数倍'
      }
    ]
  },
  {
    code: 'tz_sfpx',
    formItem: ['isAnemia'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'isAnemia', title: '是否贫血', options: normalStatus3, type: 2 }]
  },
  {
    code: 'tz_ruchongluan',
    formItem: ['helminthEggs'],
    type: 'inputCheckUpScreeningQuery',
    component: markRaw(CheckupItem1),
    formItemConfig: [{ key: 'helminthEggs', title: '蠕虫卵', options: normalStatus2, type: 2 }]
  },
  {
    code: 'tz_gangongneng',
    formItem: ['lfGpt', 'lfBil'],
    component: markRaw(CheckupItem1),
    type: 'inputCheckUpScreeningQuery',
    title: '肝功能',
    formItemConfig: [
      {
        key: 'lfGpt',
        title: '肝功能-谷丙转氨酶',
        type: 4,
        required: true,
        suffix: 'U/L',
        min: 0.1,
        max: 2000,
        precision: 1,
        message: '范围0-2000，必须是0.1的整数倍'
      },
      {
        key: 'lfBil',
        title: '肝功能-胆红素',
        type: 4,
        required: true,
        suffix: 'umol/L',
        min: 0.1,
        max: 500,
        precision: 1,
        message: '范围0-500，必须是0.1的整数倍'
      },
      { key: 'lfRemark', title: '备注:(选填)', type: 1 }
    ]
  },
  {
    code: 'tz_jhjssy',
    formItem: ['tuberculinTest'],
    component: markRaw(CheckupItem1),
    type: 'inputCheckUpScreeningQuery',
    formItemConfig: [{ key: 'tuberculinTest', title: '结核菌素试验', options: normalStatus2, type: 2 }]
  }
];
const inpNum = v => !v || /^\d+$/.test(v);
const inputNumberAndPoint = v => !v || /^\d+(\.\d{0,1})?$/.test(v);
export const examPhysicalItems = [
  {
    code: 'tc_fhl',
    formItem: ['vc'],
    component: markRaw(LabelAndInput),
    title: '肺活量',
    formKey: 'vc',
    formKey2: null,
    suffix: 'ml',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_1000mp',
    formItem: ['thousand'],
    component: markRaw(run),
    title: '1000米跑',
    formKey: 'thousand',
    formKey2: 'thousand2',
    type: 'inputPhysicalScreeningQuery'
  },
  {
    code: 'tc_50mwfp',
    formItem: ['fiftyEight'],
    component: markRaw(run),
    title: '50米*8往返跑',
    formKey: 'fiftyEight',
    formKey2: 'fiftyEight2',
    type: 'inputPhysicalScreeningQuery'
  },
  {
    code: 'tc_ytxs',
    formItem: ['pullUp'],
    component: markRaw(LabelAndInput),
    title: '引体向上',
    formKey: 'pullUp',
    suffix: '个',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_zwtqq',
    formItem: ['el'],
    component: markRaw(LabelAndInput),
    title: '坐位体前屈',
    formKey: 'stf',
    suffix: 'cm',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_50mp',
    formItem: ['fifty'],
    component: markRaw(LabelAndInput),
    title: '50米跑',
    formKey: 'fifty',
    formKey2: 'fifty2',
    suffix: '秒',
    type: 'inputPhysicalScreeningQuery',
    allowI: inputNumberAndPoint
  },
  {
    code: 'tc_ldty',
    formItem: ['jump'],
    component: markRaw(LabelAndInput),
    title: '立定跳远',
    formKey: 'jump',
    suffix: 'cm',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_1mints',
    formItem: ['skipping'],
    component: markRaw(LabelAndInput),
    title: '一分钟跳绳',
    formKey: 'skipping',
    suffix: '个',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_800mp',
    formItem: ['eightHundred'],
    component: markRaw(run),
    title: '800米跑',
    formKey: 'eightHundred',
    formKey2: 'eightHundred2',
    type: 'inputPhysicalScreeningQuery'
  },
  {
    code: 'tc_1minywqz',
    formItem: ['abdominal'],
    component: markRaw(LabelAndInput),
    title: '一分钟仰卧起坐',
    formKey: 'abdominal',
    suffix: '个',
    type: 'inputPhysicalScreeningQuery',
    allowI: inpNum
  },
  {
    code: 'tc_tzzs',
    formItem: ['height', 'weight', 'bmi'],
    component: markRaw(BMI),
    title: '体重指数',
    type: 'inputPhysicalScreeningQuery'
  }
];
export const eyeScreenItems = [
  {
    code: 'sl',
    formItem: ['vision', 'eyesight', 'glasses', 'remarkType'],
    component: markRaw(vision2),
    type: 'inputEyesScreeningQuery'
  },
  {
    code: 'qg',
    formItem: ['r1', 'r2', 'ax', 'axial', 'cyl', 'sph', 'dpRemarkType'],
    component: markRaw(diopters),
    type: 'inputEyesScreeningQuery'
  }
];

export const examSpineItems = [
  {
    code: 'jzcw',
    formItem: [
      'bendGeneralInspection',
      'anteriorFlexionThoracic',
      'anteriorFlexionWaistChest',
      'anteriorLumbarFlexion',
      'thoracicSegmentAtr',
      'thoracolumbarSegmentAtr',
      'lumbarSegmentAtr'
    ],
    component: markRaw(SpineCurvature),
    type: 'inputSpineScreeningQuery'
  },
  {
    code: 'jzqhwq',
    formItem: ['bfBendGeneralInspection', 'proneTest'],
    component: markRaw(SpineAround),
    type: 'inputSpineScreeningQuery'
  },
  {
    code: 'jzjbs',
    formItem: ['historyDisease'],
    component: markRaw(SpineDisHis),
    type: 'inputSpineScreeningQuery'
  }
];

export let sourceData = {
  ybjc: [
    { value: '1', label: '正常' },
    { value: '2', label: '双肩不等高' },
    { value: '3', label: '双侧肩胛骨下角不等高' },
    { value: '4', label: '两侧腰凹不对称' },
    { value: '5', label: '双侧髂嵴不等高' },
    { value: '6', label: '棘突连线倾斜或偏离正中线' }
  ],
  qqxd: [
    { value: 1, label: '无侧弯' },
    { value: 2, label: '左低右高ATR＜5°' },
    { value: 3, label: '左低右高ATR≥5°' },
    { value: 4, label: '右低左高ATR＜5°' },
    { value: 5, label: '右低左高ATR≥5°' }
  ],
  qqyxd: [
    { value: 1, label: '无侧弯' },
    { value: 2, label: '左低右高ATR＜5°' },
    { value: 3, label: '左低右高ATR≥5°' },
    { value: 4, label: '右低左高ATR＜5°' },
    { value: 5, label: '右低左高ATR≥5°' }
  ],
  qqyd: [
    { value: 1, label: '无侧弯' },
    { value: 2, label: '左低右高ATR＜5°' },
    { value: 3, label: '左低右高ATR≥5°' },
    { value: 4, label: '右低左高ATR＜5°' },
    { value: 5, label: '右低左高ATR≥5°' }
  ],
  xdATR: [
    { value: 1, label: 'ATR＜5°' },
    { value: 2, label: '5°≤ATR＜7°' },
    { value: 3, label: '7°≤ATR＜10°' },
    { value: 4, label: 'ATR≥10°' }
  ],
  yxdATR: [
    { value: 1, label: 'ATR＜5°' },
    { value: 2, label: '5°≤ATR＜7°' },
    { value: 3, label: '7°≤ATR＜10°' },
    { value: 4, label: 'ATR≥10°' }
  ],
  ydATR: [
    { value: 1, label: 'ATR＜5°' },
    { value: 2, label: '5°≤ATR＜7°' },
    { value: 3, label: '7°≤ATR＜10°' },
    { value: 4, label: 'ATR≥10°' }
  ],
  ybjc2: [
    { value: 1, label: '正常' },
    { value: 2, label: '前凸体征' },
    { value: 3, label: '后凸体征' }
  ],
  fwsy: [
    { value: 1, label: '前后凸体征消失' },
    { value: 2, label: '前凸体征' },
    { value: 3, label: '后凸体征' }
  ],
  jbs: [
    { value: '1', label: '无' },
    { value: '2', label: '脊柱弯曲异常家族史' },
    { value: '3', label: '脊柱外伤病史' },
    { value: '4', label: '脊柱手术病史' }
  ]
};

export const spineRelField = [
  'bendGeneralInspection',
  'anteriorFlexionThoracic',
  'anteriorFlexionWaistChest',
  'anteriorLumbarFlexion'
];
