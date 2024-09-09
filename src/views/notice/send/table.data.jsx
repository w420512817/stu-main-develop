import { toRaw } from 'vue';
import ColoredStatus from '@common/components/custom/ColoredStatus.vue';

import { AC_DETAILS, AC_EDIT, AC_DELETE } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

const { hasPermission } = usePermission();

export const noticeType = [
  { label: '系统通知', value: 0 },
  { label: '学校通知', value: 1 }
];

export const noticeSendStatues = [
  { label: '待发送', value: 0 },
  { label: '已发送', value: 1 },
  { label: '发送失败', value: 2 }
];

export const noticeTimeType = [
  { label: '立即通知', value: 0 },
  { label: '定时通知', value: 1 }
];

export const sendColumns = handleTableClick => {
  const pers = {
    detail: hasPermission(9374),
    send: hasPermission(9375),
    edit: hasPermission(9376),
    delete: hasPermission(9377)
  };

  return [
    {
      key: 'noticeTitle',
      title: '通知标题',
      align: 'center',
      maxWidth: 230,
      ellipsis: {
        tooltip: {
          width: 300
        }
      }
    },
    {
      key: 'notifiedOrg',
      title: '通知机构',
      align: 'center',
      minWidth: 80
    },
    {
      key: 'notifiedRoleName',
      align: 'center',
      title: '通知角色',
      minWidth: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'notifiedPerson',
      align: 'center',
      title: '通知对象',
      minWidth: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'noticeSendStatus',
      align: 'center',
      title: '发送状态',
      minWidth: 80,
      render({ noticeSendStatus }) {
        return (
          <ColoredStatus icon-class="mr-1" status={noticeSendStatus}>
            {noticeSendStatues[noticeSendStatus].label}
          </ColoredStatus>
        );
      }
    },
    {
      key: 'noticeTime',
      align: 'center',
      title: '发送时间',
      minWidth: 80
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail && row.noticeSendStatus === 1, act: AC_DETAILS },
            { label: '立即发送', show: pers.send && row.noticeSendStatus !== 1, act: 'AC_SEND' },
            {
              label: '编辑',
              show: pers.edit && row.noticeSendStatus !== 1,
              act: AC_EDIT,
              icon: 'ion:settings-outline'
            },
            { label: '删除', show: pers.delete && row.noticeSendStatus !== 1, act: AC_DELETE, icon: 'mi:delete' }
          ]
        );
        return renderActions();
      }
    }
  ];
};

const rbc = { required: true, trigger: ['blur', 'change'] };
export const rules = {
  noticeTitle: { ...rbc, message: '请输入通知标题' },
  noticeType: { type: 'number', ...rbc, message: '请输入通知类型' },
  notifiedOrgId: { ...rbc, message: '请选择通知学校' },
  // notifiedPersonId: { type: 'array', ...rbc, message: '请选择通知对象' },
  notifiedRoleId: { ...rbc, message: '请选择通知角色' },
  noticeContent: { ...rbc, message: '请输入通知内容' },
  noticeTime: { ...rbc, message: '请选择通知时间' },
  noticeTimeType: { type: 'number', ...rbc, message: '请选择通知方式' }
};
