import { AC_DETAILS } from '@common/enum/pageEnum';
import { ClearButton } from '@common/components/naive-ui';

export const createColumns = onClickBtn => {
  return [
    {
      title: '学校名称',
      key: 'schoolName',
      minWidth: 200
    },
    {
      title: '学校属性',
      key: 'orgPropertySt'
    },
    {
      title: '学段',
      key: 'schoolTypesSt'
    },
    {
      title: '所属地区',
      key: 'schoolArea',
      width: 180
    },
    {
      title: '学校类型',
      key: 'schoolTypeSt'
    },
    {
      title: '学校级别',
      key: 'schoolLevelSt'
    },
    {
      title: '学制',
      key: 'educationalSystem'
    },
    {
      title: '学生数量',
      key: 'studentNumber',
      render: row => row.studentNumber || '0'
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: row => (
        <ClearButton
          text
          type="primary"
          v-auth="[9357,9361]"
          onClick={() => onClickBtn(AC_DETAILS, row)}
          label="详情"
        />
      )
    }
  ];
};
