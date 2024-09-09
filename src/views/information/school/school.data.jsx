import { toRaw } from 'vue';
import { AC_DETAILS, AC_CLASS_MANAGER, AC_EDIT } from '@common/enum/pageEnum';
import useTableActios from '@common/hooks/business/useTableActions';

import { REGEXP_PHONE, REGEXP_TEL, REGEXP_CREDIT_CODE } from '@common/utils/form/regxp';

import { createRules } from './common.data';
import { usePermission } from '@common/hooks/business/usePermission';

import { verifyCreditCode } from '@/api/institution2';
const { hasPermission } = usePermission();

// 新增/编辑表单验证规则集
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['change', 'blur'] };

export const schoolAttrOptions = [
  { label: '独立学校', value: 1 },
  { label: '附属校区', value: 2 },
  { label: '集团学校', value: 3 }
];
export const schoolTypeOptions = [
  { label: '常规', value: 10 },
  { label: '武校', value: 15 },
  { label: '体校', value: 20 },
  { label: '艺校', value: 25 },
  { label: '特殊学校', value: 30 },
  { label: '职高', value: 35 }
];
export const schoolLevelOptions = [
  { label: '常规', value: 10 },
  { label: '市示范', value: 15 },
  { label: '市一级', value: 16 },
  { label: '市二级', value: 17 },
  { label: '省一级', value: 20 },
  { label: '省二级', value: 25 },
  { label: '省三级', value: 30 },
  { label: '省示范', value: 35 },
  { label: '国家级', value: 40 }
];
export const schoolLearnPeriod = [
  { label: '幼儿园', value: 1 },
  { label: '小学', value: 2 },
  { label: '初中', value: 3 },
  { label: '普高', value: 4 },
  { label: '职高', value: 5 },
  { label: '大专', value: 6 },
  { label: '本科', value: 7 }
];

export const schoolRules = formValue => ({
  ...createRules(formValue),
  orgProperty: { ...rbc, message: '请选择学校属性', pattern: /[0-9]/ },
  socialCreditCode: {
    ...rbi,
    key: 'socialCreditCode',
    validator: function (_, value) {
      if (!value) return new Error('请输入统一社会信用代码');
      const { socialCreditCodeInit, orgProperty } = formValue;
      if (value == '-') return true; // 允许输入 -
      if (value == socialCreditCodeInit) return true; // 编辑状态 未修改社会信用代码， 不用验证
      if (orgProperty == 2) return true; // 附属学校，通过查询得到得社会信用代码，不用验证
      if (!REGEXP_CREDIT_CODE.test(value)) return new Error('请输入正确的社会信用代码格式');
      // 新增机构 或者 修改机构社会信用代码，则查询信用代码是否存在
      return new Promise((resolve, reject) => {
        verifyCreditCode({ creditCode: value }).then(data => {
          if (data) {
            reject(new Error('该统一社会信用代码已存在'));
          } else {
            resolve(true);
          }
        });
      });
    }
  },
  schoolType: { ...rbc, message: '请选择学校类型', pattern: /[0-9]/ },
  schoolTypes: { ...rbc, pattern: /[0-9]/, message: '请选择学段' },
  schoolSystemId: { ...rbc, message: '请选择学制', pattern: /[0-9]/ },
  schoolUrbanRuralAttribute: { ...rbc, message: '请选择城乡属性', pattern: /[0-9]/ },
  schoolLevel: { ...rbc, message: '请选择学校级别', pattern: /[0-9]/ },
  higherOrgId: {
    ...rbi,
    validator: function (rule, value) {
      const { orgProperty } = formValue;
      if (orgProperty == 2 && !value) return new Error('请选择上级学校');
      else return true;
    }
  },
  tel: {
    trigger: ['blur', 'input'],
    message: '限制为手机号或电话号码（包含区号）',
    validator: function (rule, value) {
      if (value && !REGEXP_PHONE.test(value) && !REGEXP_TEL.test(value)) {
        return new Error('限制为手机号或电话号码（包含区号）');
      }
      return true;
    }
  },
  officeCategory: { ...rbc, message: '请选择举办者类型', pattern: /[0-9]/ }
});

export const createColumns = onClickBtn => {
  const pers = {
    detail: hasPermission([9306]),
    edit: hasPermission([19308]),
    class: hasPermission([19307])
  };
  return [
    {
      title: '学校名称',
      key: 'name',
      minWidth: 200
    },
    {
      title: '学校属性',
      key: 'orgPropertySt'
    },
    {
      title: '学段',
      key: 'schoolTypes'
    },
    {
      title: '所属地区',
      key: 'areaName',
      width: 180
    },
    {
      title: '学校类型',
      key: 'schoolTypeSt'
    },
    {
      title: '学校级别',
      key: 'schoolLevelSt'
    },
    {
      title: '学制',
      key: 'schoolSystemSt'
    },
    {
      title: '学生数量',
      key: 'studentNumber',
      render: row => row.studentNumber || '0'
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '编辑', show: pers.edit, act: AC_EDIT },
            { label: '详情', show: pers.detail, act: AC_DETAILS },
            { label: '班级信息', show: pers.class, act: AC_CLASS_MANAGER }
            // { label: '班级信息', show: true, act: AC_CLASS_MANAGER }
          ]
        );
        return renderActions();
      }
    }
  ];
};
