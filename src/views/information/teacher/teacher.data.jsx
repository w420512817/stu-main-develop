import { toRaw } from 'vue';
import { AC_EDIT, AC_DELETE, AC_DETAILS } from '@common/enum/pageEnum';

import { REGEXP_PHONE } from '@common/utils/form/regxp';
import { isIdcardRule } from '@common/utils/form/rule';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
const { hasPermission } = usePermission();

export const createColumns = onClickBtn => {
  // 权限控制
  const pers = {
    detail: hasPermission(9336),
    edit: hasPermission(9337),
    delete: hasPermission(9338)
  };
  return [
    {
      title: '序号',
      key: 'key',
      align: 'center',
      render: (_, index) => {
        return `${index + 1}`;
      }
    },
    {
      title: '教师姓名',
      key: 'name'
    },
    {
      title: '教师编号',
      key: 'serialNumber'
    },
    {
      title: '性别',
      key: 'sexSt'
    },
    {
      title: '教师职位',
      key: 'positionSt'
    },
    {
      title: '学校名称',
      key: 'schoolName'
    },
    {
      title: '管理班级',
      key: 'manageClass',
      width: 240,
      ellipsis: {
        tooltip: {
          width: 300
        }
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: row => {
        const { renderActions } = useTableActios(
          act => {
            onClickBtn(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            { label: '编辑', show: pers.edit && row.canEdit, act: AC_EDIT },
            { label: '删除', show: pers.delete && row.canEdit, act: AC_DELETE }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};

const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
export const teacherRules = form => ({
  name: { ...rbi, message: '请输入教师姓名' },
  birth: { ...rbc, message: '请选择出生日期' },
  sex: { ...rbc, message: '请选择性别', pattern: /[0-9]/ },
  serialNumber: { ...rbi, pattern: /^\d{17}$/, message: '请输入17位数字教师编号' },
  tel: { ...rbi, pattern: REGEXP_PHONE, message: '请输入电话号码' },
  belongArea: { ...rbc, message: '请选择区域', pattern: /[0-9]/ },
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
  }
});
