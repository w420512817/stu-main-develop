import { toRaw } from 'vue';
import { AC_DELETE, AC_EDIT, AC_RESET } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createAccountColumns = onClickBtn => {
  // 权限控制
  const pers = {
    accountEdit: hasPermission([1011, 1032, 1047, 1060]) || true,
    accountReset: hasPermission([1013, 1034, 1049, 1062]) || true,
    accountDelete: hasPermission([1012, 1033, 1048, 1061]) || true
  };
  return [
    {
      title: '姓名',
      key: 'realName'
    },
    {
      title: '用户名',
      key: 'account'
    },
    {
      title: '手机号',
      key: 'phone'
    },
    {
      title: '角色',
      key: 'roleName'
    },
    {
      title: '创建时间',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'actions',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '编辑', show: pers.accountEdit, act: AC_EDIT },
            { label: '重置密码', show: pers.accountReset, act: AC_RESET },
            { label: '删除', show: pers.accountDelete, act: AC_DELETE }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const createSubSchoolColumns = onClickBtn => {
  // 权限控制
  const pers = {
    subSchoolRemove: hasPermission(1015) || true
  };
  return [
    {
      title: '学校名称',
      key: 'lowerOrgName'
    },
    {
      title: '学校属性',
      key: 'orgPropertySt'
    },
    {
      title: '所属地区',
      key: 'lowerOrgArea'
    },
    {
      title: '操作',
      key: 'actions',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [{ text: '移除', show: pers.subSchoolRemove, act: AC_DELETE }]
        );

        return renderActions();
      }
    }
  ];
};
