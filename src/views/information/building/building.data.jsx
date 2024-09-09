import { toRaw } from 'vue';
import { AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    edit: hasPermission(9311),
    delete: hasPermission(9312)
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
      title: '教学楼名称',
      key: 'name'
    },
    {
      title: '教学楼层数',
      key: 'floorNumber'
    },
    {
      title: '教学楼教室数量',
      key: 'classroomNumber'
    },
    {
      title: '所属学校',
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
