import { toRaw } from 'vue';
import { AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    edit: hasPermission(9317),
    delete: hasPermission(9318)
  };
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
      title: '楼层名称',
      key: 'name'
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
      width: 140,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '编辑', show: pers.edit && row.canEdit, act: AC_EDIT },
            { label: '删除', show: pers.delete && row.canEdit, act: AC_DELETE }
          ]
        );

        return renderActions();
      }
    }
  ];
};
