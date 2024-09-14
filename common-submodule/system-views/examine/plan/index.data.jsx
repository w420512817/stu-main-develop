import { toRaw, nextTick } from 'vue';
import { NEl, NProgress, NPopover, NSpace, NInputNumber } from 'naive-ui'; // NProgres
import { Icon } from '@iconify/vue';
import { AC_DETAILS, AC_DELETE, AC_EDIT, AC_EXPORT } from '@common/enum/pageEnum';

import { usePermission } from '@common/hooks/business/usePermission';
import useTableActios from '@common/hooks/business/useTableActions';
import { useUserStore } from '@/store';
import ColoredStatus from '@common/components/custom/ColoredStatus.vue';
import { chooseModeEnum } from '@common/enum/pageEnum';

const userStore = useUserStore();
const { hasPermission } = usePermission();

export const createColumns = ({ orgType, handleTableClick }) => {
  const orgId = userStore.userInfo.orgId;
  const govLevel = userStore.userInfo.govLevel;
  // 权限控制
  const pers = {
    detail: 1 || hasPermission([9007, 9055, 9103, 9151]),
    edit: 1 || hasPermission([9008, 9056, 9104, 9152]),
    permission: 1 || hasPermission([9010, 9058, 9106, 9154]),
    sumedit: 1 || hasPermission([9013, 9061, 9109, 9157]),
    completePlan: 1 || hasPermission([9012, 9060, 9108, 9156]),
    delete: 1 || hasPermission([9014, 9062, 9110, 9158])
  };
  return [
    { title: '年份', key: 'planYear', align: 'center' },
    { title: '名称', key: 'planName', align: 'center', ellipsis: { tooltip: true } },
    {
      title: '筛查模式',
      key: 'planMode',
      align: 'center',
      ellipsis: { tooltip: true },
      render (row) {
        return <span>{chooseModeEnum[row.planMode]}</span>;
      }
    },
    // { title: '计划类型', key: 'planTypeLaber', align: 'center', ellipsis: { tooltip: true } },
    { title: '计划范围', key: 'planRange', align: 'center', ellipsis: { tooltip: true } },
    {
      title: '开始日期-结束日期',
      key: 'startTime',
      align: 'center',
      render (row) {
        return row.startTime + ' ~ ' + row.endTime;
      }
    },
    {
      title () {
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
              <NEl>待开始：表示计划未到开始日期</NEl>
              <NEl>进行中：表示计划已开始</NEl>
              <NEl>已超时：表示计划已超过结束日期但未完成</NEl>
              <NEl>已完成：表示计划已完成</NEl>
            </NSpace>
          </NPopover>
        );
      },
      key: 'planStatus',
      align: 'center',
      render (row) {
        return (
          <ColoredStatus
            icon-class="mr-1"
            status={row.planStatus}
            colors={['#0d9488', '#f5222d', '#52c41a', '#faad14']}
          >
            {row.planStatusLaber}
          </ColoredStatus>
        );
      }
    },
    {
      title: '进度',
      key: 'rate',
      align: 'center',
      render (row) {
        return row.rate + '%';
      },
      hidden: orgType !== 'GOVERMENT'
    },
    {
      title: '创建机构',
      key: 'creatorOrgName',
      align: 'center',
      ellipsis: { tooltip: true },
      hidden: orgType === 'GOVERMENT'
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render (row) {
        const planName = row.planMode == 2 ? '任务' : '计划';
        // 区的任务模式非当前机构判断条件
        const isEditProvinceOrCityTask = row.planMode == 2 && govLevel == 3 && orgId != row.creatorOrg;
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [
            { label: '查看', show: pers.detail, act: AC_DETAILS },
            // { label: '查看', show: true, act: AC_DETAILS },
            {
              label: `导出数据`,
              show: pers.edit && (orgId == row.creatorOrg || isEditProvinceOrCityTask),
              act: AC_EXPORT
            },
            // 第一个是普通情况下的修改任务
            {
              label: `修改${planName}`,
              show: pers.edit && row.planStatus != 1 && orgId == row.creatorOrg,
              act: AC_EDIT
            },
            // 第二个是区去编辑省市下发的任务,页面差距过大，跳转到另外一个地方进行编辑
            {
              label: `修改${planName}`,
              show: pers.edit && row.planStatus != 1 && isEditProvinceOrCityTask,
              act: 'AC_EDIT_PROVINCEORCITY'
            },
            // 有权限 未完成 本机构创建的 是计划模式 才会显示
            {
              label: '权限设置',
              show: pers.permission && row.planStatus != 1 && orgId == row.creatorOrg && row.planMode == 1,
              act: 'permission'
            },
            // 有权限 未完成 本机构创建的 是计划模式 才会显示
            {
              label: '数据设置',
              show: pers.sumedit && row.planStatus != 1 && orgId == row.creatorOrg && row.planMode == 1,
              act: 'sumedit'
            },
            {
              label: `完成${planName}`,
              show: pers.completePlan && row.planStatus != 1 && orgId == row.creatorOrg,
              act: 'completePlan'
            },
            {
              label: `删除${planName}`,
              show: pers.delete && row.planStatus != 1 && orgId == row.creatorOrg,
              act: AC_DELETE
            }
          ]
        );
        return renderActions();
      }
    }
  ];
};

export const planDetailColumns = () => {
  return [
    { title: '计划筛查学生名称', key: 'studentName', align: 'center' },
    { title: '学生性别', key: 'sex', align: 'center' },
    { title: '出生年月', key: 'birth', minWidth: 80, align: 'center' },
    { title: '年级', key: 'gradeName', minWidth: 80, align: 'center' },
    { title: '班级', key: 'className', align: 'center' },
    { title: '学年', key: 'classYear', align: 'center' },
    {
      title: '学生筛查进度',
      key: 'rate',
      width: 350,
      render (row) {
        return (
          <NProgress type="line" percentage={row.rate}>
            {row.rate || 0}%
          </NProgress>
        );
      }
    }
  ];
};

export const createPermissionColumns = ({ handleTableClick }) => {
  // 权限控制
  const pers = {
    changePermission: hasPermission([9011, 9059, 9107, 9155])
  };
  return [
    { type: 'selection' },
    { title: '统一信用代码', width: 200, key: 'socialCreditCode', align: 'center' },
    { title: '学校名称', key: 'orgName', align: 'center', ellipsis: { tooltip: true } },
    {
      title: '可筛查学段',
      key: 'validPrefix',
      align: 'center',
      render (row) {
        return prefixToStr(row.prefix);
      }
    },
    {
      title: '不可筛查学段',
      key: 'invalidPrefix',
      align: 'center',
      render (row) {
        return prefixToStr(row.invalidPrefix);
      }
    },
    { title: '所属地区', key: 'region', align: 'center' },
    { title: '已导入人数', key: 'number', align: 'center', ellipsis: { tooltip: true } },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render (row) {
        const { renderActions } = useTableActios(
          act => {
            handleTableClick(act, toRaw(row));
          },
          [{ label: '权限控制', show: pers.changePermission, act: 'permission' }]
        );
        return renderActions();
      }
    }
  ];
};

export const statusList = [
  { value: 1, label: '已完成' },
  { value: 2, label: '待开始' },
  { value: 3, label: '进行中' },
  { value: 4, label: '已超时' }
];
export const textFormat = _text => {
  if (!_text && _text !== 0) return '/';
  return _text;
};
export const yearList = () => {
  let list = [];
  const startYear = 2018;
  const nowYear = new Date().getFullYear();
  for (let i = 0; i <= nowYear - startYear; i++) {
    let year = startYear + i;
    list.unshift({ value: year, label: `${year}年` });
  }
  return list;
};
export const typeList = [
  { value: 101, label: '普查' },
  { value: 102, label: '抽查' }
  // { value: 103, label: '复查' },
  // { value: 104, label: '自查' }
];

export const prefixList = [
  { value: 1, label: '幼儿园' },
  { value: 2, label: '小学' },
  { value: 3, label: '初中' },
  { value: 4, label: '普高' },
  { value: 5, label: '职高' },
  { value: 6, label: '大专' },
  { value: 7, label: '本科' }
];

export const chooseModeList = [
  { value: 1, label: '计划模式' },
  { value: 2, label: '任务模式' }
];

function prefixToStr (prefix) {
  if (prefix) {
    let result = [];
    let arr = prefix.split(',');
    arr.forEach(v => {
      prefixList.forEach(vv => {
        if (v == vv.value) {
          result.push(vv.label);
        }
      });
    });
    return result.join(',');
  } else {
    return '/';
  }
}

export const areaCreateTable = (tableRef, state) => {
  return [
    { key: 'regionName', title: '任务范围' },
    { key: 'stuCount', title: '学生总数' },
    { key: 'gradeNum', title: '任务年级人数' },
    {
      key: 'screeningNum',
      title: '目标数设置',
      render (row) {
        if (row.level === 3) {
          return <div>{row.screeningNum}</div>;
        }

        return (
          <NInputNumber
            showButton={false}
            precision={0}
            min={0}
            value={row.screeningNum}
            disabled={state.custonDisable}
            onUpdateValue={v => {
              nextTick(() => {
                tableRef.value.handleSetScreeningNum();
              });
              row.screeningNum = v;
            }}
          ></NInputNumber>
        );
      }
    },
    { key: 'haveScreeningNum', title: '已筛人数' }
  ];
};
