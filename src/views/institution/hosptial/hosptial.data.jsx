import { toRaw } from 'vue';
import { AC_DETAILS } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    detail: hasPermission(3006)
  };
  return [
    {
      title: '医院名称',
      key: 'name',
      width: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '医院属性',
      key: 'orgPropertySt'
    },
    {
      title: '医院类型',
      key: 'hospTypeSt'
    },
    {
      title: '医院级别',
      key: 'hospLevelSt'
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
      width: 120,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [{ text: '查看医院', show: pers.detail, act: AC_DETAILS }]
        );

        return renderActions();
      }
    }
  ];
};
