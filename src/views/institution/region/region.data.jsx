import { toRaw } from 'vue';

import { AC_DETAILS, AC_SCHOOL, AC_HOSPTIAL, AC_SOCIETY } from '@common/enum/pageEnum';
import { numToPercent } from '@common/utils/common';
import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createProvinceColumns = onClickBtn => {
  // 权限控制
  const pers = {
    city: hasPermission(3001)
  };
  return [
    {
      title: '市级名称',
      key: 'cityName',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '机构类型',
      key: 'orgAttributeName'
    },
    {
      title: '管理区域',
      key: 'manageArea'
    },
    {
      title: '学校数量',
      key: 'schoolCount',
      render({ schoolCount, schoolRate }) {
        return `${schoolCount}（${numToPercent(schoolRate)}%）`;
      }
    },
    {
      title: '医院数量',
      key: 'hospitalCount',
      render({ hospitalCount, hospitalRate }) {
        return `${hospitalCount}（${numToPercent(hospitalRate)}%）`;
      }
    },
    {
      title: '社会机构数量',
      key: 'socialCount',
      render({ socialCount, socialRate }) {
        return `${socialCount}（${numToPercent(socialRate)}%）`;
      }
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
          [{ text: '查看', show: pers.city, act: AC_DETAILS }]
        );

        return renderActions();
      }
    }
  ];
};
export const createCityColumns = onClickBtn => {
  // 权限控制
  const pers = {
    school: hasPermission(3002),
    hosiptal: hasPermission(3003),
    scoiety: hasPermission(3004)
  };

  return [
    {
      title: '区级名称',
      key: 'regionName',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '学校数量',
      key: 'schoolCount',
      render({ schoolCount, schoolRate }) {
        return `${schoolCount}（${numToPercent(schoolRate)}%）`;
      }
    },
    {
      title: '医院数量',
      key: 'hospitalCount',
      render({ hospitalCount, hospitalRate }) {
        return `${hospitalCount}（${numToPercent(hospitalRate)}%）`;
      }
    },
    {
      title: '社会机构数量',
      key: 'socialCount',
      render({ socialCount, socialRate }) {
        return `${socialCount}（${numToPercent(socialRate)}%）`;
      }
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { text: '查看学校', show: pers.school, act: AC_SCHOOL },
            { text: '查看医院', show: pers.hosiptal, act: AC_HOSPTIAL },
            { text: '查看社会机构', show: pers.scoiety, act: AC_SOCIETY }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};
