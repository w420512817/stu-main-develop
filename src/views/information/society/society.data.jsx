import { toRaw } from 'vue';
import { AC_DETAILS, AC_ASSOCITED } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    detail: hasPermission(9362),
    associted: hasPermission(9360)
  };

  return [
    {
      title: '社会机构名称',
      key: 'name',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '社会机构属性',
      key: 'orgPropertySt'
    },
    {
      title: '所属地区',
      key: 'areaName'
    },
    {
      title: '关联学校（所）',
      key: 'associateSchoolCount'
    },
    {
      title: '可筛查学生（人）',
      key: 'screenNum'
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { text: '关联学校', show: pers.associted && row.associateSchoolCount, act: AC_ASSOCITED },
            { text: '社会机构详情', show: pers.detail, act: AC_DETAILS }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};
