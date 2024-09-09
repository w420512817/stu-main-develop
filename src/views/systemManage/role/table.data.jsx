import { toRaw } from 'vue';

import { AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';
import { CheckRoleExist } from '@/api/systemManage/role';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
import { useUserStore } from '@/store';

const { hasPermission } = usePermission();

export const createColumns = handleTableClick => {
  const pers = {
    detail: hasPermission(9388),
    edit: hasPermission(9387),
    delete: hasPermission(9389)
  };
  return [
    { title: '角色名称', key: 'name', ellipsis: true },
    {
      title: '备注',
      key: 'remark',
      ellipsis: {
        tooltip: {
          width: 300
        }
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail && row.isDefault === 1, act: AC_DETAILS },
            { label: '编辑', show: pers.edit && row.isDefault !== 1, act: AC_EDIT },
            { label: '删除', show: pers.delete && row.isDefault !== 1, act: AC_DELETE }
          ]
        );
        return renderActions();
      }
    }
  ];
};

const rbc = { required: true, trigger: ['blur', 'change', 'input'] };

export const createRules = state => ({
  orgId: [
    {
      required: true,
      trigger: ['blur'],
      message: '请选择机构'
    }
  ],
  roleName: [
    {
      required: true,
      trigger: ['blur', 'input'],
      async validator(_r, roleName) {
        if (!roleName) {
          throw Error('请输入角色名称');
        }
        const {
          userInfo: { orgId }
        } = useUserStore();
        const res = await CheckRoleExist({ roleName, type: state.type, roleId: state.id, orgId });
        if (res) {
          throw Error('角色名称已存在');
        }
      }
    }
  ],
  permissonList: {
    ...rbc,
    type: 'array',
    message: '请选择角色权限'
  }
});
