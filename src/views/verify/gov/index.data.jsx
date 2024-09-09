import useTableActios from '@common/hooks/business/useTableActions';
import { AC_DETAILS, AC_PASS, AC_REJECT } from '@common/enum/pageEnum';
import { transferReasonOptions } from '../school/index.data';
import { taskTypeOpt } from '../school/index.data';

export const verifyEnum = [
  { label: '未审核', value: 0 },
  { label: '待审核', value: 1 },
  { label: '审核通过', value: 2 },
  { label: '审核未通过', value: 3 }
];

export const transferColumns = handleClick => {
  return [
    { key: 'approvedTypeName', title: '审核类型', render: () => '转学申请' },
    { key: 'auditorName', title: '审核人' },
    { key: 'submitReviewer', title: '提交审核人' },
    { key: 'reasonName', title: '审核原因' },
    { key: 'createTime', title: '提交时间' },
    { key: 'govApprovalStatusName', title: '审核状态' },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render(row) {
        let progessing = row.govApprovalStatus == 0 || row.govApprovalStatus == 1;
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '通过', show: progessing, act: AC_PASS },
            { label: '驳回', show: progessing, act: AC_REJECT }
            // { label: '撤销通过', show: row.govApprovalStatus == 2, act: AC_REJECT },
            // { label: '撤销驳回', show: row.govApprovalStatus == 5, act: AC_REJECT }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const transferInColumns = handleClick => {
  return [
    { key: 'approvedTypeName', title: '审核类型', render: () => '转入申请' },
    { key: 'auditorName', title: '审核人' },
    { key: 'submitReviewer', title: '提交审核人' },
    { key: 'studentName', title: '学生信息' },
    { key: 'idCard', title: '学生证件号', width: 180 },
    { key: 'reasonName', title: '审核原因' },
    { key: 'createTime', title: '提交时间', width: 170 },
    { key: 'firstApprovalStatusName', title: '审核状态' },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render(row) {
        const approvalStatusing = row.govApprovalStatus == 0 || row.govApprovalStatus == 1;
        const schoolApprovalStatusing = row.approvalStatus == 0 || row.approvalStatus == 1;
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', show: true, act: AC_DETAILS },
            { label: '转入学校', show: approvalStatusing || schoolApprovalStatusing, act: AC_PASS },
            { label: '驳回', show: approvalStatusing, act: AC_REJECT }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const studentApproveColumns = handleClick => {
  return [
    { key: 'type', title: '审核类型', render: () => '学生信息修改', minWidth: 80 },
    { key: 'studentName', title: '学生姓名', minWidth: 80 },
    { key: 'auditorName', title: '审核人', minWidth: 80 },
    { key: 'applicantName', title: '提交审核人', minWidth: 80 },
    { key: 'remark', title: '审核原因', minWidth: 80 },
    { key: 'createTime', title: '提交时间', width: 170 },
    { key: 'approvalStatusName', title: '审核状态', minWidth: 80 },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        let progessing = row.approvalStatus == 1 || row.approvalStatus == 0;
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '通过', show: progessing, act: AC_PASS },
            { label: '驳回', show: progessing, act: AC_REJECT },
            { label: '撤销通过', show: row.approvalStatus == 2, act: 'CANCEL_PASS' },
            { label: '撤销驳回', show: row.approvalStatus == 3, act: 'CANCEL_REJECT' }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const taskOpenColumns = handleClick => {
  return [
    {
      key: 'type',
      title: '审核类型',
      render(row) {
        let opt = taskTypeOpt.find(item => item.value == row.approvedType);
        return opt?.label || '/';
      },
      minWidth: 80
    },
    { key: 'taskName', title: '名称', minWidth: 80 },
    { key: 'auditorName', title: '审核人', minWidth: 80 },
    { key: 'applicantName', title: '提交审核人', minWidth: 80 },
    { key: 'applyReason', title: '审核原因', minWidth: 80 },
    { key: 'applyTime', title: '提交时间', width: 170 },
    { key: 'approvalStatusName', title: '审核状态', minWidth: 80 },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        let progessing = row.approvalStatus == 1 || row.approvalStatus == 0;
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '通过', show: progessing, act: AC_PASS },
            { label: '驳回', show: progessing, act: AC_REJECT },
            { label: '撤销通过', show: row.approvalStatus == 2, act: 'CANCEL_PASS' },
            { label: '撤销驳回', show: row.approvalStatus == 3, act: 'CANCEL_REJECT' }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export { transferReasonOptions };
