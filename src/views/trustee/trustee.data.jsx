import { toRaw } from 'vue';
import { AC_PASS, AC_REJECT } from '@common/enum/pageEnum';
import { formatToDate, formatToDateTime } from '@common/utils/common/date';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    pass: hasPermission(9365),
    reject: hasPermission(9366)
  };
  return [
    {
      title: '托管日期',
      key: 'startTime',
      render: row => (
        <span>
          {formatToDate(row.startTime)}~{formatToDate(row.endTime)}
        </span>
      )
    },
    {
      title: '托管权限',
      key: 'trusteeshipTypeName'
    },
    {
      title: '申请时间',
      key: 'createTime',
      render: row => <span>{row.createTime ? formatToDateTime(row.createTime) : '/'}</span>
    },
    {
      title: '申请人',
      key: 'creatorName'
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
            { label: '通过', show: pers.pass, act: AC_PASS },
            { label: '驳回', show: pers.reject, act: AC_REJECT }
          ]
        );

        return renderActions();
      }
    }
  ];
};
