import { toRaw } from 'vue';
import { AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

// 权限控制
const pers = {
  detail: hasPermission(2021),
  edit: hasPermission(2020),
  delete: hasPermission(2022)
};

export const createColumns = onClickBtn => {
  return [
    {
      title: '序号',
      key: 'key',
      align: 'center',
      render: (_, index) => {
        return `${index + 1}`;
      }
    },
    {
      title: '教室名称',
      key: 'name'
    },
    {
      title: '教室编号',
      key: 'serialNumber'
    },
    {
      title: '当前关联班级',
      key: 'className'
    },
    {
      title: '所属楼层',
      key: 'floorName'
    },
    {
      title: '所属教学楼',
      key: 'buildingName'
    },

    {
      title: '学校名称',
      key: 'schoolName'
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '编辑', show: pers.edit && row.canEdit, act: AC_EDIT },
            { label: '教室环境信息', show: pers.detail, act: AC_DETAILS },
            { label: '删除', show: pers.delete && row.canEdit, act: AC_DELETE }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

// 表单校验
const rbi = { trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
export const rules = {
  buildingId: { ...rbc, message: '请选择' },
  floorId: { ...rbc, message: '请选择' },
  name: { ...rbi, required: true, message: '请输入' },
  serialNumber: { ...rbi, required: true, pattern: /^\d{6}$/, message: '教室编号为6位数的阿拉伯数字' },
  length: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  width: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  frontDeskDistance: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  lastDeskDistance: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  desklxOne: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  deskLxTwo: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  deskLxThree: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  deskLxFour: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  deskLxMin: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardSerialNumber: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLength: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardWidth: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardRideHeight: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  screenSize: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  screenHighlight: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  screenPx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardIncomingLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardReflectLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLxOne: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLxTwo: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLxThree: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLxFour: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardLxMin: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  blackboardUnif: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  indoorLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  outdoorLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  daylightFactor: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  windowArea: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  landArea: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  backwallIncomingLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' },
  backwallReflectLx: { ...rbi, pattern: /^(0|[1-9]\d*)(.\d{1,2})?$/, message: '只能输到小数点后两位' }
};
