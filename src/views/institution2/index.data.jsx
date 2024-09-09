import ColoredStatus from '@common/components/custom/ColoredStatus.vue';
import { AC_DELETE, AC_DETAILS, AC_STOP_START } from '@common/enum/pageEnum';
import { REGEXP_CREDIT_CODE } from '@common/utils/form/regxp';
import { verifyCreditCode, checkOrgNameExist } from '@/api/institution2';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
import { useUserStore } from '@/store';
const { hasPermission } = usePermission();

// 表单校验
const regb = { required: true, trigger: ['blur'] };
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['change', 'blur'] };

export function createColumns(onClickBtn) {
  let { userInfo } = useUserStore();
  // 权限控制
  const pers = {
    detail: hasPermission(1057) || true,
    startpause: hasPermission(1056) || true,
    delete: hasPermission(1055) || true
  };
  return [
    { key: 'orgName', title: '机构名称' },
    { key: 'schoolCount', title: '学校数量' },
    { key: 'hospitalCount', title: '医院数量' },
    { key: 'socialCount', title: '社会机构数量' },
    {
      key: 'effectiveDays',
      title: '有效期',
      render({ effectiveDays }) {
        return effectiveDays ? effectiveDays + '天' : '/';
      }
    },
    {
      key: 'statusSt',
      title: '状态',
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
      fixed: 'right',
      width: 120,
      render: row => {
        let noSelfOrg = userInfo.orgId !== row.orgId;
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, row);
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            {
              label: row.status ? '启用' : '停用',
              show: pers.startpause && noSelfOrg,
              disabled: false,
              act: AC_STOP_START,
              icon: 'ion:settings-outline'
            },
            { label: '删除', show: pers.delete && noSelfOrg, act: AC_DELETE, icon: 'mi:delete' }
          ]
        );

        return renderActions();
      }
    }
  ];
}
export const createRules = formValue => ({
  name: {
    required: true,
    trigger: ['blur'],
    validator: function (_, value) {
      if (!value) return new Error('请输入机构名称');
      if (value.trim()?.length > 100) return new Error('请输入100个以内字符');
      const { copyname } = formValue;
      if (value == copyname) return true;
      return new Promise((resolve, reject) => {
        checkOrgNameExist({ name: value }).then(data => {
          if (data) {
            reject(new Error('机构名已经存在'));
          } else {
            resolve(true);
          }
        });
      });
    }
  },
  socialCreditCode: {
    required: true,
    trigger: 'blur',
    validator: function (_, value) {
      if (!value) return new Error('请输入统一社会信用代码');
      if (!REGEXP_CREDIT_CODE.test(value)) return new Error('请输入正确的社会信用代码格式');
      const { socialCreditCodeInit } = formValue;
      if (value == socialCreditCodeInit) return true;
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
  regionId: { ...rbc, message: '请选择所属地区' },
  address: { ...rbi, message: '请输入100个以内字符' },
  lnglat: {
    required: true,
    message: '请选择机构坐标',
    trigger: 'blur',
    key: 'lnglat'
  },
  roleId: { ...rbc, message: '请选择机构权限组', pattern: /[0-9]/ },
  accountNumber: { ...rbc, message: '请选择账号数量', pattern: /[0-9]/ },
  dateRange: {
    ...rbc,
    validator: function (_, value) {
      if (!value?.length) return new Error('请选择机构有效期');
      return true;
    }
  },
  dataMaskingType: {
    ...regb,
    validator: function (_, value) {
      const { isDataMasking } = formValue;
      if (isDataMasking && !value?.length) {
        return new Error('点击设置，选择脱敏字段');
      }
      return true;
    }
  }
});

export const createGovRules = formValue => ({
  orgAttribute: { ...regb, message: '请选择政府机构类型', pattern: /[0-9]/ },
  manageAreaId: { ...regb, message: '请选择管理区域', pattern: /[0-9]/ },
  ...createRules(formValue)
});

export const accountNumberOptions = [
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 100, value: 100 }
];

export const governmentAttrOptions = [
  { label: '教育局', value: 1 },
  { label: '卫建委', value: 2 },
  { label: '市监局', value: 3 }
];
