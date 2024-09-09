import dayjs from 'dayjs';

import { NEl, NProgress, NPopover, NSpace, NInputNumber, NSwitch } from 'naive-ui'; // NProgres
import { Icon } from '@iconify/vue';
import ColoredStatus from '@common/components/custom/ColoredStatus.vue';
import ButtonCopy from '@common/components/custom/ButtonCopy';

import {
  AC_DETAILS,
  AC_DELETE,
  AC_EXPORT,
  AC_IMPORT,
  AC_COMPLETE,
  AC_PRINT,
  // AC_CLEAR,
  AC_RESET,
  AC_ADD,
  AC_OPEN,
  AC_EDIT
} from '@common/enum/pageEnum';

import { toRaw } from 'vue';
import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';

import { useUserStore } from '@/store';
const { hasPermission } = usePermission();

export const statusList = [
  { value: 0, label: '待开始' },
  { value: 1, label: '进行中' },
  { value: 2, label: '已完成' },
  { value: 3, label: '未开始' },
  { value: 4, label: '已超时' }
  // { value: 9, label: '已上报' }
];
export const selectionList = [
  { label: '必查', value: 1 },
  { label: '选查', value: 2 }
];

export const createColumns = ({ handleTableClick }) => {
  const {
    userOrgType,
    userInfo: { orgId, orgType }
  } = useUserStore();
  const pers = {
    detail: hasPermission([9022, 9016, 9064, 9070, 9112, 9118, 9160, 9166]),
    down: hasPermission([9017, 9065, 9113, 9161]),
    review: hasPermission([9018, 9066, 9114, 9162]),
    print: hasPermission([9021, 9069, 9117, 9165])
  };
  const btn = {
    finish: val => ['1', '4'].includes(val),
    upReport: val => ['2', '9'].includes(val),
    im: val => ['3', '1', '4'].includes(val),
    down: val => pers.down && ['1', '2', '4', '9'].includes(val),
    del: val => ['0', '1', '3', '4'].includes(val)
  };
  const isSchool = userOrgType === 'SCHOOL';
  const isHospital = userOrgType === 'HOSPITAL';
  return [
    { title: '年份', key: 'planYear', width: 70, align: 'center' },
    { title: '名称', key: 'taskName', align: 'center', ellipsis: { tooltip: true } },
    { title: '年级', key: 'gradeName', align: 'center', ellipsis: { tooltip: true } },
    { title: '所属计划', key: 'planName', align: 'center', ellipsis: { tooltip: true } },
    { title: '任务目标人数', key: 'screenNum', align: 'center', ellipsis: { tooltip: true } },
    { title: '已筛人数', key: 'screenCount', align: 'center', ellipsis: { tooltip: true } },
    {
      title: '筛查进度',
      key: 'rate',
      align: 'center',
      ellipsis: { tooltip: true },
      render(row) {
        return (row.rate || 0) + '%';
      }
    },
    {
      title: '学校',
      key: 'taskOrgName',
      align: 'center',
      ellipsis: { tooltip: true },
      hidden: isSchool
    },
    {
      title: '所属地区',
      key: 'range',
      width: 180,
      align: 'center',
      ellipsis: { tooltip: true },
      hidden: isSchool
    },
    {
      title() {
        return (
          <NPopover
            v-slots={{
              trigger: () => (
                <NSpace style={{ cursor: 'pointer' }} justify="center">
                  <NEl>状态</NEl>
                  <Icon icon="carbon:information" size="16" style={{ transform: 'translateY(3px)' }}></Icon>
                </NSpace>
              )
            }}
          >
            <NSpace vertical>
              <NEl>待开始：表示该任务未达到开始日期</NEl>
              <NEl>未开始：表示该任务已达到开始日期，但未开始筛查</NEl>
              <NEl>进行中：表示该任务已开始筛查</NEl>
              <NEl>已超时：表示该任务已超过结束日期但未完成</NEl>
              <NEl>已完成：表示该任务已完成</NEl>
            </NSpace>
          </NPopover>
        );
      },
      key: 'taskStatusLaber',
      width: 120,
      align: 'center',
      render(row) {
        // 0 待开始 1进行中 2已完成 3未开始 4已超时 9已上报
        return (
          <ColoredStatus
            icon-class="mr-1"
            status={row.taskStatus}
            colors={['#409EFF', '#faad14', '#f5222d', '#52c41a']}
          >
            {row.taskStatusLaber}
          </ColoredStatus>
        );
      }
    },
    // { title: '应用组名称', key: 'appGroupName', align: 'center', ellipsis: { tooltip: true } },
    // { title: '任务类型', key: 'taskTypeLaber', width: 80, align: 'center' },
    { title: '结束时间', key: 'endTime', minWidth: 120, align: 'center', hidden: isSchool },
    {
      title: '开始日期 - 结束日期',
      key: 'date',
      width: 330,
      align: 'center',
      hidden: userOrgType === 'HOSPITAL' || userOrgType === 'GOVERMENT' || isSchool,
      render(row) {
        return (
          <NEl tag="span">
            {row.startTime} - {row.endTime}
          </NEl>
        );
      }
    },
    {
      title: '告知书',
      key: 'consentSwitch',
      hidden: !isSchool,
      render(row) {
        return <NSwitch value={row.consentSwitch} onUpdateValue={() => handleTableClick('AC_CONSENTSWITCH', row)} />;
      }
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render(row) {
        let taskEnd = row.taskStatus == 2;
        let isSchool = orgType == 10;
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            // { label: '查看', show: true, act: AC_DETAILS },
            { label: '打印登记表', show: pers.print, act: AC_PRINT },
            { label: '提交任务', show: btn.finish(row.taskStatus), act: AC_COMPLETE },
            { label: '编辑任务', show: pers.detail && row.planMode == 2 && isSchool && !taskEnd, act: AC_EDIT },
            // { label: '上报', show: btn.upReport(row.taskStatus), act: AC_UP_REPORT },
            { label: '数据导入', show: btn.im(row.taskStatus) && (isSchool || isHospital), act: AC_IMPORT },
            { label: '数据导出', show: btn.down(row.taskStatus), act: AC_EXPORT },
            { label: '删除', show: btn.del(row.taskStatus) && row.planMode != 2, act: AC_DELETE },
            { label: '创建复查任务', show: orgId === row.planOrgId && pers.review && row.planMode != 2, act: AC_ADD },
            {
              label: '打开任务',
              show: orgId === row.planOrgId && row.taskStatus != 1 && row.planMode != 2,
              act: AC_OPEN
            }
          ]
        );
        return renderActions();
      }
    }
  ];
};
export const screenPersonColumns = () => {
  return [
    { title: '姓名', key: 'name', align: 'center' },
    { title: '角色', key: 'workerTypeLaber', align: 'center' },
    { title: '所属机构', key: 'userOrgName', minWidth: 80, align: 'center' },
    {
      title: '负责机构',
      key: 'responsibleOrgName',
      align: 'center'
    },
    {
      title: '负责筛查范围',
      key: 'taskClassName',
      align: 'center'
    }
  ];
};

export const taskDetailColumns = ({ handleTableClick }) => {
  const pers = {
    input: hasPermission([9027, 9075, 9123, 9171]),
    view: hasPermission([9028, 9076, 9124, 9172]),
    delete: hasPermission([9402, 9403, 9404, 9405])
  };
  return [
    { type: 'selection' },
    {
      title: '姓名',
      key: 'studentName',
      align: 'center',
      minWidth: 120,
      render(row) {
        return <ButtonCopy name={row.studentName}></ButtonCopy>;
      }
    },
    { title: '性别', key: 'sex', align: 'center', minWidth: 90 },
    {
      title: '身份证号',
      key: 'idcard',
      minWidth: 200,
      align: 'center',
      render(row) {
        return <ButtonCopy name={row.idcard}></ButtonCopy>;
      }
    },
    { title: '必查项目数量', key: 'mustScreeningNum', minWidth: 120, align: 'center' },
    {
      title: '必查项目完成进度',
      key: 'mustScreeningRate',
      minWidth: 200,
      align: 'center',
      render(row) {
        return <NProgress type="line" percentage={row.mustScreeningRate} />;
      }
    },
    { title: '筛查项目数量', key: 'screeningNum', minWidth: 120, align: 'center' },
    {
      title: '筛查项目完成进度',
      key: 'screeningRate',
      minWidth: 200,
      align: 'center',
      render(row) {
        return <NProgress type="line" percentage={row.screeningRate} />;
      }
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 280,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '录入数据', show: pers.input, disabled: ![0].includes(row.taskStatus), act: AC_IMPORT },
            { label: '查看数据', show: pers.view, act: AC_DETAILS },
            // { label: '清除数据', show: pers.clear, disabled: ![0].includes(row.taskStatus), act: AC_CLEAR },
            {
              label: '移除',
              show: pers.delete,
              disabled: ![2, 0].includes(row.taskStatus),
              act: AC_DELETE
            }
          ]
        );

        return renderActions(false);
      }
    }
  ];
};
export const notStatusList = [
  { value: 1, label: '请假' },
  { value: 2, label: '放假' },
  { value: 3, label: '实习' },
  { value: 4, label: '休学' },
  { value: 5, label: '转学' },
  { value: 6, label: '出国' },
  { value: 7, label: '生病' },
  { value: 8, label: '退学' },
  { value: 9, label: '毕业' },
  { value: 10, label: '人在外地学籍在本地' },
  { value: 99, label: '其他' }
];

export const notScreenColumns = ({ handleTableClick }) => {
  // const pers = {
  //   clear: hasPermission([9029, 9077, 9125, 9173])
  // };
  return [
    {
      title: '姓名',
      key: 'studentName',
      align: 'center'
    },
    { title: '性别', key: 'sex', align: 'center' },
    { title: '学段', key: 'prefxName', align: 'center' },
    { title: '年级', key: 'gradeName', align: 'center' },
    { title: '班级', key: 'className', align: 'center' },
    {
      title: '已筛查类目',
      key: 'screenOptions',
      align: 'center',
      minWidth: 200,
      ellipsis: { tooltip: true },
      render(row) {
        return <NEl tag="span">{row.screenOptions ?? '/'}</NEl>;
      }
    },
    { title: '不可筛查原因', key: 'notStatusLaber', align: 'center', ellipsis: { tooltip: true }, minWidth: 120 },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render(row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '恢复数据', show: true, act: AC_RESET }
            // { label: '清除数据', show: pers.clear, act: AC_CLEAR }
          ]
        );

        return renderActions();
      }
    }
  ];
};

// 表单校验
const rbi = { required: true, trigger: ['blur', 'input'] };
const rbc = { required: true, trigger: ['blur', 'change'] };
export const taskRulesFn = (initDate, isProgress) => ({
  taskYear: { ...rbc, message: '请选择任务年份', type: 'number' },
  planId: { ...rbc, message: '请选择所属计划' },
  taskName: { ...rbi, message: '请输入任务名称' },
  screenNum: { ...rbi, message: '请正确输入应筛查学生数', pattern: /^([1-9]\d*|0)$/ },
  dateValue: {
    ...rbc,
    validator(_, value) {
      if (!value?.length) {
        return new Error('请选择任务日期');
      } else {
        if (isProgress.value) {
          return true;
        }
        if (initDate.value) {
          const [initStart] = initDate.value;
          const [start, end] = value;
          if (dayjs(end) < dayjs()) {
            return new Error('结束日期需不早于今日');
          }
          if (dayjs(start) < dayjs(initStart)) {
            return new Error('新的开始日期需晚于原开始日期');
          }
        }
      }
      return true;
    }
  },
  appGroupId: { ...rbc, message: '请选择应用组' }
  // screenNum: { ...rbi, message: '请输入' }
});

export const scaleList = (() => {
  let list = [];
  const starNum = 0;
  const endNum = 100;
  for (let i = 0; i <= (endNum - starNum) / 5; i++) {
    let num = starNum + i * 5;
    list.push({ value: num, label: `${num}%` });
  }
  return list;
})();

export const schoolEditTable = state => [
  { key: 'regionName', title: '任务范围' },
  { key: 'stuCount', title: '各年级学生数' },
  {
    key: 'screeningNum',
    title: '目标数设置',
    render(row) {
      return (
        <NInputNumber
          showButton={false}
          precision={0}
          min={0}
          value={row.screeningNum}
          disabled={state?.customDisable}
          onUpdateValue={v => {
            row.screeningNum = v;
          }}
        />
      );
    }
  },
  { key: 'haveScreeningNum', title: '已筛人数' }
];
