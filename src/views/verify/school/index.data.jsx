import useTableActios from '@common/hooks/business/useTableActions';
import { AC_DELETE, AC_DETAILS, AC_PASS } from '@common/enum/pageEnum';
import { transferReasonOptions } from '@/views/information/common.data';
import { verifyEnum } from '../gov/index.data';
import { NTooltip } from 'naive-ui';
import { h } from 'vue';

export const sexOpt = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
];

export const transferColumns = handleClick => {
  return [
    { key: 'studentName', title: '姓名', minWidth: 80 },
    { key: 'sexName', title: '性别', minWidth: 50 },
    { key: 'originalSchoolTypesName', title: '学段', minWidth: 50 },
    { key: 'studyYear', title: '学年', minWidth: 80 },
    { key: 'originalGradeName', title: '年级', minWidth: 80 },
    { key: 'originalClassName', title: '班级', minWidth: 80 },
    { key: 'registerNumber', title: '学籍号码', width: 185 },
    { key: 'switchSchoolName', title: '转入学校', width: 200 },
    { key: 'createTime', title: '转出时间', width: 170 },
    { key: 'firstApprovalStatusName', title: '审核状态', minWidth: 80 },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '撤回', show: row.approvalStatus == 0 || row.approvalStatus == 1, act: AC_DELETE }
            // { label: '重新提交', show: row.approvalStatus == 3, act: AC_REJECT }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const transferInColumns = handleClick => {
  return [
    { key: 'studentName', title: '姓名', minWidth: 80 },
    { key: 'sexName', title: '性别', minWidth: 80 },
    { key: 'originalSchoolName', title: '原学校名称', minWidth: 80 },
    { key: 'originalSchoolTypesName', title: '原学段', minWidth: 80 },
    { key: 'originalGradeName', title: '原年级', minWidth: 80 },
    { key: 'originalClassName', title: '原班级', minWidth: 80 },
    { key: 'switchSchoolTypesName', title: '转入学段', minWidth: 80 },
    { key: 'switchGradeName', title: '转入年级', minWidth: 80 },
    { key: 'switchClassName', title: '转入班级', minWidth: 80 },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '通过', show: row.approvalStatus == 0 || row.approvalStatus == 1, act: AC_PASS }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const studentApproveColumns = handleClick => {
  return [
    { key: 'studentName', title: '姓名', minWidth: 80 },
    { key: 'applicantName', title: '提交审核人', minWidth: 80 },
    { key: 'remark', title: '提交审核原因', minWidth: 80 },
    { key: 'createTime', title: '提交审核时间', minWidth: 80 },
    { key: 'approvalStatusName', title: '审核状态', minWidth: 80 },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '撤销', show: row.approvalStatus == 0 || row.approvalStatus == 1, act: AC_DELETE }
            // { label: '重新提交', show: row.approvalStatus == 3, act: AC_RESET }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const AppNameEnum = {
  1: '视力',
  2: '龋齿',
  3: '体检',
  4: '体测',
  5: '正脊'
};

export const appNameOpt = (function () {
  let keys = Object.keys(AppNameEnum);
  return keys.map(key => ({ label: AppNameEnum[key], value: key }));
})();

export const taskOpenColumns = handleClick => {
  return [
    { title: '任务名称', key: 'taskName' },
    {
      title: '筛查类型',
      key: 'taskName',
      render(row) {
        return AppNameEnum[row.appType] || '/';
      }
    },
    { title: '提交审核人', key: 'applicantName' },
    { title: '提交审核原因', key: 'applyReason' },
    { title: '提交审核时间', key: 'applyTime' },
    { title: '审核状态', key: 'approvalStatusName' },
    { title: '备注', key: 'remark' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '撤销', show: row.approvalStatus == 0 || row.approvalStatus == 1, act: AC_DELETE }
            // { label: '重新提交', show: row.approvalStatus == 3, act: AC_RESET }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const stuDataColumns = handleClick => {
  return [
    { title: '任务名称', key: 'taskName' },
    {
      title: '筛查类型',
      key: 'taskName',
      render(row) {
        return AppNameEnum[row.appType] || '/';
      }
    },
    { title: '提交审核人', key: 'applicantName' },
    { title: '提交审核原因', key: 'applyReason' },
    { title: '提交审核时间', key: 'applyTime' },
    { title: '审核状态', key: 'approvalStatusName' },
    { title: '备注', key: 'remark' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleClick(act, row);
          },
          [
            { label: '查看', act: AC_DETAILS },
            { label: '撤销', show: row.approvalStatus == 0 || row.approvalStatus == 1, act: AC_DELETE }
            // { label: '重新提交', show: row.approvalStatus == 3, act: AC_RESET }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

export const rules = {
  studentName: { message: '请输入', required: true, trigger: ['blur', 'input'] },
  idCardType: { message: '请选择', required: true, trigger: ['blur', 'input'], type: 'number' },
  idCard: { message: '请输入', required: true, trigger: ['blur', 'input'] }
};

export const idCardTypeOptions = [
  { label: '身份证', value: 1 },
  { label: '护照号', value: 2 },
  { label: '无证件号', value: 0 }
];

export const taskTypeOpt = [
  { label: '任务撤回', value: 1, taskStatus: 2 },
  { label: '学生数据修改', value: 2, taskStatus: 1 }
];

export function selectToolTip({ node, option }) {
  return h(
    NTooltip,
    { to: '#app' },
    {
      trigger: () => node,
      default: () => option.taskName
    }
  );
}

export { transferReasonOptions, verifyEnum };
