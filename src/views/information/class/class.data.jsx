import { toRaw } from 'vue';
import { AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    edit: hasPermission([19330, 9330]),
    delete: hasPermission([19331, 9331])
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
      title: '学年',
      key: 'studyYear'
    },
    {
      title: '年级名称',
      key: 'gradeName'
    },
    {
      title: '班级名称',
      key: 'className'
    },
    {
      title: '班级人数',
      key: 'studentNumber'
    },
    {
      title: '班主任',
      key: 'teacherName'
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
          // [
          //   { label: '编辑', show: pers.edit && row.canEdit, act: AC_EDIT },
          //   { label: '删除', show: pers.delete && row.canEdit, act: AC_DELETE }
          // ]
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

export const addClassRule = {
  className: { required: true, trigger: ['blur', 'input'], message: '请输入班级名称' },
  schoolType: { required: true, trigger: ['blur', 'change'], message: '请选择学段', type: 'number' },
  gradeId: { required: true, trigger: ['blur', 'input'], message: '请选择学年' }
};
