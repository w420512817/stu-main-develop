import { toRaw } from 'vue';
import { AC_PASS, AC_REJECT, AC_DETAILS } from '@common/enum/pageEnum';
import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

export const changeTypes = [
  { label: '更改姓名', value: 1 },
  { label: '更改身份证', value: 2 }
];

export const auditStatus = [
  { label: '已通过', value: 1 },
  { label: '待审核', value: 2 },
  { label: '已驳回', value: 3 }
];
export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    pass: hasPermission(9394),
    reject: hasPermission(9395),
    detail: hasPermission(9396)
  };
  return [
    {
      title: '申请类型',
      key: 'changeTypeName',
      align: 'center'
    },
    {
      title: '申请内容',
      key: 'content',
      width: 500,
      align: 'center',
      render: row => {
        return (
          <p>
            {row.applicationContent}
            <span color-red-6>{row.originalField}</span> 更改为 <span color-red-6>{row.currentField}</span>
          </p>
        );
      }
    },
    { title: '申请人', key: 'proposerName', align: 'center' },
    {
      title: '状态',
      key: 'approvalStatusName',
      align: 'center'
    },
    { title: '提交时间', key: 'createTime', align: 'center' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '通过', show: pers.pass && row.approvalStatus == 2, act: AC_PASS },
            { label: '驳回', show: pers.reject && row.approvalStatus == 2, act: AC_REJECT },
            { label: '查看', show: pers.detail && row.approvalStatus != 2, act: AC_DETAILS }
          ]
        );
        return renderActions(false);
      }
    }
  ];
};
