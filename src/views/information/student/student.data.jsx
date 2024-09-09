import { toRaw } from 'vue';
import { NTooltip } from 'naive-ui';
import { AC_DELETE, AC_DETAILS, AC_TRUN_OUT, AC_REPORT, AC_PASS, AC_REJECT } from '@common/enum/pageEnum';
import { ClearButton } from '@common/components/naive-ui';
import { isIdcardRule } from '@common/utils/form/rule';
import { REGEXP_PHONE } from '@common/utils/form/regxp';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = (onClickBtn, isLoginOrgan) => {
  // 权限控制
  const pers = {
    detail: hasPermission(9346),
    report: hasPermission(9347),
    turnout: hasPermission(9350),
    delete: hasPermission(9349)
  };
  return [
    {
      type: 'selection'
    },
    {
      title: '姓名',
      key: 'studentName'
    },
    {
      title: '性别',
      key: 'sexName'
    },
    {
      title: '学段',
      key: 'schoolTypesName'
    },
    {
      key: 'studyYear',
      title() {
        return (
          <>
            <NTooltip placement="top" trigger="hover">
              {{
                trigger() {
                  return (
                    <ClearButton
                      text
                      color="#444"
                      icon-placement="right"
                      label="学年"
                      icon="ant-design:question-circle-outlined"
                    />
                  );
                },
                default: () => '学年为学生入学年份'
              }}
            </NTooltip>
          </>
        );
      }
    },
    {
      title: '年级',
      key: 'gradeName'
    },
    {
      title: '班级',
      key: 'className'
    },
    {
      title: '学籍号码',
      key: 'registerNumber'
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
            { label: '学生档案', show: pers.detail, act: AC_DETAILS },
            { label: '健康报告', show: pers.report, act: AC_REPORT },
            { label: '转出', show: pers.turnout && isLoginOrgan.value, act: AC_TRUN_OUT },
            { label: '删除', show: pers.delete && isLoginOrgan.value, act: AC_DELETE }
          ]
        );

        return renderActions();
      }
    }
  ];
};
export const createTransferInColumns = onClickBtn => {
  // 权限控制
  const pers = {
    pass: hasPermission(9352),
    reject: hasPermission(9353)
  };
  return [
    {
      title: '姓名',
      key: 'studentName'
    },
    {
      title: '性别',
      key: 'sexName'
    },
    {
      title: '原学校名称',
      key: 'originalSchoolName'
    },
    {
      title: '原学段',
      key: 'originalSchoolTypesName'
    },
    {
      title: '原年级',
      key: 'originalGradeName'
    },
    {
      title: '原班级',
      key: 'originalClassName'
    },
    {
      title: '转入学段',
      key: 'switchSchoolTypesName'
    },
    {
      title: '转入年级',
      key: 'switchGradeName'
    },
    {
      title: '转入班级',
      key: 'switchClassName'
    },
    // {
    //   title: '筛查状态',
    //   key: 'screeningStatusName'
    // },
    {
      title: '审核状态',
      key: 'approvalStatusName'
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
          [
            { label: '通过', show: pers.pass && row.approvalStatus == 2, act: AC_PASS },
            { label: '驳回', show: pers.reject && row.approvalStatus == 2, act: AC_REJECT }
          ]
        );

        return renderActions();
      }
    }
  ];
};
export const createTransferOutColumns = () => {
  return [
    {
      title: '姓名',
      key: 'studentName'
    },
    {
      title: '性别',
      key: 'sexName'
    },
    {
      title: '转出学校名称',
      key: 'switchSchoolName'
    },
    {
      title: '当前学段',
      key: 'originalSchoolTypesName'
    },
    {
      title: '当前年级',
      key: 'originalGradeName'
    },
    {
      title: '当前班级',
      key: 'originalClassName'
    },
    {
      title: '转出学段',
      key: 'switchSchoolTypesName'
    },
    {
      title: '转出年级',
      key: 'switchGradeName'
    },
    {
      title: '转出班级',
      key: 'switchClassName'
    },
    {
      title: '转出原因',
      key: 'reasonName'
    },
    // {
    //   title: '筛查状态',
    //   key: 'screeningStatusName'
    // },
    {
      title: '审核状态',
      key: 'approvalStatusName'
    }
  ];
};

const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
export const addStudentRules = form => ({
  studentName: { ...rbi, message: '请输入学生姓名' },
  birth: { ...rbc, message: '请选择出生日期' },
  sex: { ...rbc, message: '请选择性别', pattern: /[0-9]/ },
  registerNumber: {
    ...rbi,
    required: false,
    message: '请输入首位大写字母的19位学籍号码',
    // pattern: /^[A-Z]([1-9X]{18})$/,
    validator(_r, value) {
      const reg = /^[A-Z]/;
      if (!value) {
        return true;
      } else if (value.trim().length !== 19 || !reg.test(value.trim())) {
        return new Error('请输入首位大写字母的19位学籍号码');
      } else {
        return true;
      }
    }
  },
  belongArea: { ...rbc, message: '请选择区域', pattern: /[0-9]/ },
  schoolTypes: { ...rbc, message: '请选择学段', pattern: /[0-9]/ },
  orgName: { ...rbi, message: '请输入学校信息' },
  schoolRoll: { ...rbc, message: '请选择学段', type: 'number' },
  studyStatus: { ...rbc, message: '请选择就读状态', type: 'number' },
  // studyYear: { ...rbc, message: '请选择学年' },
  gradeId: { ...rbc, message: '请选择年级' },
  classId: { ...rbc, message: '请选择班级' },
  idcardType: {
    trigger: ['blur', 'change'],
    validator(_r, value) {
      if (form.belongArea == 2) {
        return true;
      } else {
        if (form.belongArea == 1 && value == null) {
          return new Error('请选择证件类型');
        } else return true;
      }
    }
  },
  idcard: {
    trigger: ['blur', 'input'],
    key: 'idcard',
    validator(_r, value, callBack) {
      if (form.belongArea == 1) {
        // 内地
        if (form.idcardType == 1) {
          // 身份证号
          let isIdCard = isIdcardRule(value);
          isIdCard ? callBack() : callBack(new Error('请输入正确的身份证号'));
        } else callBack();
      } else {
        // 非内地 护照号
        if (!value) {
          callBack(new Error('请输入证件号'));
        } else callBack();
      }
    }
  },
  parentPhone: { pattern: REGEXP_PHONE, message: '请输入手机号', trigger: ['blur', 'input'] }
});

export const physicalMap = {
  tc_fhl: 'vc',
  tc_1000mp: 'thousand',
  tc_50mwfp: 'fiftyEight',
  tc_ytxs: 'pullUp',
  tc_zwtqq: 'stf',
  tc_50mp: 'fifty',
  tc_ldty: 'jump',
  tc_1mints: 'skipping',
  tc_800mp: 'eightHundred',
  tc_1minywqz: 'abdominal',
  tc_tzzs: 'bmi'
};
