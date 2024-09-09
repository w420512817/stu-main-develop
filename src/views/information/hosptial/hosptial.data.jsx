import { toRaw } from 'vue';
import { AC_DETAILS, AC_ASSOCITED } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    detail: hasPermission(9358),
    associted: hasPermission(9356)
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
      title: '所属地区',
      key: 'areaName'
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
      width: 160,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { text: '关联学校', show: pers.associted && row.associateSchoolCount, act: AC_ASSOCITED },
            { text: '医院详情', show: pers.detail, act: AC_DETAILS }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};
