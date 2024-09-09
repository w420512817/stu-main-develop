import { toRaw } from 'vue';

import { AC_DETAILS, AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

export const noticeType = [
  { label: '系统通知', value: 0 },
  { label: '学校通知', value: 1 }
];

export const noticeSendStatues = [
  { label: '待发送', value: 0 },
  { label: '已发送', value: 1 },
  { label: '发送失败', value: 2 }
];

export const noticeTimeType = [
  { label: '立即通知', value: 0 },
  { label: '定时通知', value: 1 }
];

export const sendColumns = handleTableClick => {
  const pers = {
    detail: hasPermission(9400),
    // send: hasPermission(3048),
    edit: hasPermission(9399),
    delete: hasPermission(9401)
  };
  return [
    {
      key: 'appGroupName',
      title: '应用名称',
      align: 'center'
    },
    {
      key: 'score',
      title: '总分',
      align: 'center'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            {
              label: '编辑',
              show: pers.edit && row.noticeSendStatus !== 1,
              act: AC_EDIT
            },
            { label: '删除', show: pers.delete, act: AC_DELETE }
          ]
        );
        return renderActions();
      }
    }
  ];
};

const rbc = { required: true, trigger: ['blur', 'change'] };
export const rules = {
  noticeTitle: { ...rbc, message: '请输入通知标题' },
  noticeType: { type: 'number', ...rbc, message: '请输入通知类型' },
  notifiedOrgId: { ...rbc, message: '请选择通知学校' },
  notifiedPersonId: { type: 'array', ...rbc, message: '请选择通知对象' },
  noticeContent: { ...rbc, message: '请输入通知内容' },
  noticeTime: { ...rbc, message: '请选择通知时间' },
  noticeTimeType: { type: 'number', ...rbc, message: '请选择通知方式' }
};
export const appOptions = [
  { label: '视力应用', value: '1' },
  { label: '龋齿应用', value: '2' },
  { label: '体测应用', value: '3' },
  { label: '体检应用', value: '4' }
];

export const screenItems = [
  {
    key: ['tz_kajiemiao', 'tz_yxgyym', 'tz_gshzyyz', 'tz_bbpym', 'tz_msfym', 'tz_lnym', 'tz_ynym', 'tz_jgym'],
    list: [
      { name: '已全程接种', id: '1' },
      { name: '未接种', id: '2' },
      { name: '漏种', id: '3' }
    ]
  },
  { key: ['tz_stxt'], list: [{ name: 'bmi', id: '6', key: 'bmi' }] },
  {
    key: ['tz_xdcw', 'tz_yxdcw', 'tz_ydcw'],
    list: [
      { name: '无侧弯', id: '1' },
      { name: '左低右高Ⅰ度', id: '2' },
      { name: '左低右高Ⅱ度', id: '3' },
      { name: '左低右高Ⅲ度', id: '4' },
      { name: '右低左高Ⅰ度', id: '5' },
      { name: '右低左高Ⅱ度', id: '6' },
      { name: '右低左高Ⅲ度', id: '7' }
    ]
  },
  {
    key: ['tz_qhwq'],
    list: [
      { name: '无前后弯曲', id: '1' },
      { name: '前凸异常Ⅰ度', id: '2' },
      { name: '前凸异常高Ⅱ度', id: '3' },
      { name: '前凸异常Ⅲ度', id: '4' },
      { name: '后凸异常Ⅰ度', id: '5' },
      { name: '后凸异常Ⅱ度', id: '6' },
      { name: '后凸异常Ⅲ度', id: '7' },
      { name: '平背Ⅰ度', id: '8' },
      { name: '平背Ⅱ度', id: '9' },
      { name: '平背Ⅲ度', id: '10' }
    ]
  },
  {
    key: ['hengya'],
    list: [{ name: '恒牙总数', id: '1', key: 'hengya' }]
  },
  {
    key: ['yazhou'],
    list: [
      { name: '未见明显异常', key: 'healthyGums', id: '1' },
      { name: '牙龈炎', key: 'gingivitis', id: '2' },
      { name: '牙周炎', key: 'periodontitis', id: '3' },
      { name: '牙石', key: 'tartar', id: '4' },
      { name: '浅牙周袋', key: 'superficialPeriodontalPocket', id: '5' },
      { name: '深牙周袋', key: 'deepPeriodontalPocket', id: '6' },
      { name: '沸斑牙', key: 'boilingMottledTooth', id: '7' },
      { name: '错颌', key: 'malocclusion', id: '8' },
      { name: '牙釉质发育不全', key: 'enamelHypoplasia', id: '9' },
      { name: '义齿', key: 'denture', id: '10' },
      { name: '其他牙病', key: 'otherDiseases', id: '11' }
    ]
  },
  {
    key: ['qg'],
    list: [
      { name: '球镜', key: 'odSph', id: '1', precision: 2 },
      { name: '柱镜', key: 'osCyl', id: '2', precision: 2 }
    ]
  },
  {
    key: ['sl'],
    list: [
      { name: '裸眼视力', key: 'vision', id: '1', precision: 1 }
      // { name: '戴镜视力', key: 'eyesight', id: '2', precision: 1 },//注释掉这两个选项
      // { name: '戴镜度数', key: 'frameglass', id: '3' }
    ]
  }
];
