import { toRaw } from 'vue';
import { NSwitch } from 'naive-ui';

import { REGEXP_PWD, REGEXP_ACCOUNT, REGEXP_PHONE } from '@common/utils/form/regxp';
import { getConfirmPwdRule } from '@common/utils/form/rule';
import { CheckExist } from '@/api/systemManage/account';

import { AC_DELETE, AC_RESET, AC_EDIT, AC_STOP_START } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
import { useUserStore } from '@/store';

const {
  userInfo: { id }
} = useUserStore();
const { hasPermission } = usePermission();

export const statusMap = [
  { label: '启用', className: 'statusClass1', value: 1 },
  { label: '禁用', className: 'statusClass0', value: 2 }
];

export const createColumns = handleTableClick => {
  const pers = {
    edit: hasPermission(9381),
    reset: hasPermission(9382),
    delete: hasPermission(9383)
  };
  return [
    { title: '姓名', key: 'realName', align: 'center', minWidth: 80 },
    { title: '用户名', key: 'account', align: 'center', minWidth: 80 },
    { title: '手机号', key: 'phone', align: 'center', minWidth: 150 },
    { title: '角色', key: 'roleName', align: 'center', minWidth: 80 },
    { title: '所属机构', key: 'orgName', align: 'center', minWidth: 80 },
    { title: '创建时间', key: 'createTime', align: 'center', minWidth: 170 },
    {
      title: '状态',
      key: 'status',
      minWidth: 120,
      render(row) {
        const { status } = row;
        return (
          <div className="status-label">
            <NSwitch
              vShow={status === 2 || status === 1}
              disabled={!hasPermission(9384)}
              size="small"
              value={+status === 1}
              onClick={() => {
                hasPermission(9384) && handleTableClick(AC_STOP_START, row);
              }}
            ></NSwitch>
            <span className={statusMap[status - 1]?.className} pl-2>
              {row.statusLabel}
            </span>
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render(row) {
        const { delete: persD, reset, edit } = pers;
        const ISEXAMINE = row.status === 0;
        const isReject = row.status === 3;
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            // { label: '审核', show: shenhe && ISEXAMINE && !isReject, act: 'AC_EXAMINE' },
            { label: '编辑', show: edit && !ISEXAMINE && !isReject, act: AC_EDIT },
            { label: '重置密码', act: AC_RESET, show: reset && !ISEXAMINE && !isReject },
            { label: '删除', act: AC_DELETE, show: persD && !ISEXAMINE && row.id !== id }
          ]
        );
        return renderActions();
      }
    }
  ];
};

const rbi = { required: true, trigger: ['blur', 'input'] };

export const rules = ({ password, id }) => ({
  // orgId: { ...rbi, message: '请选择机构' },
  areaId: { ...rbi, message: '请选择所属地区' },
  realName: { ...rbi, message: '请输入姓名' },
  account: [
    { ...rbi, key: 'account', pattern: REGEXP_ACCOUNT, message: '6-30字符的英文和数字输入，必须包含英文字母' },
    {
      key: 'account',
      trigger: 'blur',
      async validator(_r, account) {
        if (!account || !REGEXP_ACCOUNT.test(account)) return;
        return CheckExistFunc({ account, id: id.value });
      }
    }
  ],
  phone: {
    key: 'phone',
    trigger: ['blur', 'input'],
    required: true,
    async validator(_r, phone) {
      if (!phone) {
        throw Error('请输入手机号');
      }
      if (!REGEXP_PHONE.test(phone)) {
        throw Error('请输入正确的手机号');
      }
      return CheckExistFunc({ phone, id: id.value });
    }
  },
  idCard: [
    { ...rbi, message: '请输入身份证号' },
    {
      trigger: 'blur',
      async validator(_r, idCard) {
        if (!idCard) return;
        return CheckExistFunc({ idCard, id: id.value });
      }
    }
  ],
  roleId: { ...rbi, message: '请选择角色' },
  password: {
    ...rbi,
    pattern: REGEXP_PWD,
    message: '支持8-20字符，且必须包含字母和数字'
  },
  confirmPassword: getConfirmPwdRule(password),
  permissonList: { type: 'array', message: '请选择数据权限', ...rbi }
});

async function CheckExistFunc(data) {
  data.isBizPlatform = true;
  const { success, message } = await CheckExist(data);
  if (success) return Promise.resolve(true);
  else return Promise.reject(new Error(message));
}

export function password() {
  function RandomNumBoth(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    let num = Min + Math.round(Rand * Range); // 四舍五入
    return num;
  }
  const pos = RandomNumBoth(8, 20);
  let password = '';
  while (!password) {
    let pas = '';
    for (let i = 0; i < pos; i++) {
      // 随机字符串 ASCLL码0-9 A-Z a-z
      switch (RandomNumBoth(1, 3)) {
        case 1:
          {
            let number = RandomNumBoth(48, 57);
            pas += String.fromCharCode(number);
          }
          break;
        case 2:
          {
            let cap = RandomNumBoth(65, 90);
            pas += String.fromCharCode(cap);
          }
          break;
        case 3:
          {
            let lower = RandomNumBoth(97, 122);
            pas += String.fromCharCode(lower);
          }
          break;
      }
    }
    // 判断符合规则
    if (REGEXP_PWD.test(pas)) {
      password = pas;
    }
  }

  return password;
}
