import { toRaw } from 'vue';

import { AC_DETAILS } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    detail: hasPermission(3005)
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
      title: '举办者类型',
      key: 'officeCategory',
      render({ officeCategory }) {
        let offEnum = {
          0: '私立',
          1: '公办'
        };
        return offEnum[officeCategory] || '/';
      }
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
      title: '学生数量（人）',
      key: 'studentNumber'
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
          [{ text: '查看学校', show: pers.detail, act: AC_DETAILS }]
        );

        return renderActions();
      }
    }
  ];
};
