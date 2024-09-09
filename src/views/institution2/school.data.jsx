import { toRaw } from 'vue';
import { REGEXP_PHONE, REGEXP_TEL, REGEXP_CREDIT_CODE } from '@common/utils/form/regxp';

import ColoredStatus from '@common/components/custom/ColoredStatus.vue';
import { AC_DELETE, AC_DETAILS, AC_STOP_START } from '@common/enum/pageEnum';

import { createRules } from './index.data';

import { verifyCreditCode } from '@/api/institution2';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

// 新增/编辑表单验证规则集
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['change', 'blur'] };
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
  // 权限控制
  const pers = {
    detail: hasPermission(1008) || true,
    startpause: hasPermission(1007) || true,
    delete: hasPermission(1006) || true
  };
  return [
    {
      title: '名称',
      key: 'name',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '学校属性',
      key: 'orgPropertySt'
    },
    {
      title: '学段',
      key: 'schoolTypesSt'
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
      key: 'educationalSystemSt'
    },
    {
      title: '有效期（天）',
      key: 'effectiveDays'
    },
    {
      title: '应用组数量',
      key: 'applicationNumber'
    },
    {
      title: '学校状态',
      key: 'status',
      width: 100,
      render(row) {
        return (
          <ColoredStatus icon-class="mr-1" status={row.status}>
            {{ default: () => row.statusSt }}
          </ColoredStatus>
        );
      }
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
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            {
              label: row.status ? '启用' : '停用',
              show: pers.startpause,
              disabled: false,
              act: AC_STOP_START,
              icon: 'ion:settings-outline'
            },
            { label: '删除', show: pers.delete, act: AC_DELETE, icon: 'mi:delete' }
          ]
        );

        return renderActions();
      }
    }
  ];
};

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
  // { label: '无', value: 0 },
  { label: '幼儿园', value: 1 },
  { label: '小学', value: 2 },
  { label: '初中', value: 3 },
  { label: '普高', value: 4 },
  { label: '职高', value: 5 },
  { label: '大专', value: 6 },
  { label: '本科', value: 7 }
];
export const schoolStausOptions = [
  { label: '运营中', value: 0 },
  { label: '已停用', value: 1 }
];

export const UrbanRuralAttributeOptions = [
  { label: '城市', value: 0 },
  { label: '乡镇', value: 1 }
];

export const officeCategoryOptions = [
  { label: '公办', value: 1 },
  { label: '民办', value: 0 }
];

export const accountNumberOptions = [
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 100, value: 100 }
];

export const monitotNumOptions = [
  { label: '城区', value: '1' },
  { label: '乡镇', value: '2' }
];

export const areaNumOptions = [
  { label: '好片', value: 1 },
  { label: '中片', value: 2 },
  { label: '差片', value: 3 }
];
