import { toRaw } from 'vue';
import { AC_DETAILS, AC_DELETE, AC_CANCEL } from '@common/enum/pageEnum';
import ColoredStatus from '@common/components/custom/ColoredStatus.vue';
import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

// 权限控制
const pers = {
  detail: hasPermission(1000),
  dele: hasPermission(1000),
  cancel: hasPermission(1000)
};

export const createColumns = ({ handleTableClick }) => {
  return [
    { type: 'selection' },
    { title: '帐号', key: 'account' },
    { title: '邮箱', key: 'email' },
    { title: '昵称', key: 'nickname', minWidth: 60 },
    { title: '角色', key: 'role' },
    { title: '创建时间', key: 'createTime', minWidth: 170 },
    {
      title: '状态',
      key: 'status',
      minWidth: 80,
      render(row) {
        // return (
        //   <ColoredStatus status={row.status} colors={['#0d9488', '#f59e0b', '#0ea5e9', '#a3a3a3']}>
        //     {{ default: () => row.statusStr }}
        //   </ColoredStatus>
        // );
        return (
          <ColoredStatus icon-class="mr-1" status={row.status}>
            {{ default: () => row.statusStr }}
          </ColoredStatus>
        );
      }
    },
    { title: '备注', key: 'remark' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            { label: '删除', show: pers.dele, type: 'error', act: AC_DELETE, icon: 'mi:delete' },
            { label: '取消', show: pers.cancel, disabled: true, act: AC_CANCEL, icon: 'carbon:close' }
          ]
        );

        return renderActions();
      }
    }
  ];
};
