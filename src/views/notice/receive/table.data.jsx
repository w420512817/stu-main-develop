import { toRaw } from 'vue';
import { AC_DETAILS } from '@common/enum/pageEnum';
import ColoredStatus from '@common/components/custom/ColoredStatus.vue';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

export const noticeStates = [
  { label: '未读', value: 0 },
  { label: '已读', value: 1 }
];

export const enumNoticeType = [
  { label: '学校通知', value: 0 },
  { label: '政府通知', value: 1 },
  { label: '医院通知', value: 2 },
  { label: '社会机构通知', value: 3 }
];

export const receiveColumns = (handleTableClick, orgType) => {
  const pers = {
    detail: hasPermission(9371)
  };

  let noticeType = {
    key: 'noticeType',
    align: 'center',
    title: '通知类型',
    minWidth: 80,
    render({ noticeType }) {
      return <div>{enumNoticeType[noticeType].label}</div>;
    }
  };
  let arr = [
    {
      type: 'selection'
    },
    {
      key: 'noticeTitle',
      align: 'center',
      title: '通知标题',
      maxWidth: 230,
      ellipsis: {
        tooltip: {
          width: 300
        }
      }
    },
    {
      key: 'noticeOrg',
      align: 'center',
      title: '通知机构',
      minWidth: 80
    },
    {
      key: 'notifier',
      align: 'center',
      title: '通知人',
      minWidth: 80
    },
    {
      key: 'noticeTime',
      align: 'center',
      title: '通知时间',
      minWidth: 80
    },
    {
      key: 'noticeState',
      title: '通知状态',
      minWidth: 80,
      render({ noticeState }) {
        return (
          <ColoredStatus icon-class="mr-1" status={noticeState}>
            {noticeStates[noticeState].label}
          </ColoredStatus>
        );
      }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [{ label: '查看', show: pers.detail, act: AC_DETAILS }]
        );
        return renderActions();
      }
    }
  ];
  if (orgType !== 'GOVERMENT') {
    // 政府账号下不需要通知类型
    arr.splice(2, 0, noticeType);
  }
  return arr;
};
