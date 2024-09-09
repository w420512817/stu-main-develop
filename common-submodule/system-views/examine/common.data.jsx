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
  { value: 102, label: '抽查' },
  { value: 103, label: '复查' },
  { value: 104, label: '自查' }
];
const getImg = url => {
  return new URL(`../../assets/image/${url}`, import.meta.url).href;
};
export const appList = [
  { label: '视力筛查计划', value: 1, img: getImg('funbg1.png') },
  { label: '龋齿筛查计划', value: 2, img: getImg('funbg2.png') },
  { label: '体检筛查计划', value: 3, img: getImg('funbg3.png') },
  { label: '体质监测计划', value: 4, img: getImg('funbg4.png') }
];
export const appList_task = [
  { label: '视力筛查任务', value: 1, img: getImg('funbg1.png') },
  { label: '龋齿筛查任务', value: 2, img: getImg('funbg2.png') },
  { label: '体检筛查任务', value: 3, img: getImg('funbg3.png') },
  { label: '体质监测任务', value: 4, img: getImg('funbg4.png') }
];

export const dataGroupCheckbox = {
  studentInfo: [
    { label: '学校名称', value: 1, id: 1 },
    { label: '学段', value: 2, id: 10 },
    { label: '学年', value: 3, id: 20 },
    { label: '年级编号', value: 4, id: 25 },
    { label: '年级', value: 5, id: 30 },
    { label: '班级', value: 6, id: 35 },
    { label: '班级编号', value: 7, id: 40 },
    { label: '姓名', value: 8, id: 50 },
    { label: '性别', value: 9, id: 60 },
    { label: '出生日期', value: 10, id: 70 },
    { label: '身份证号', value: 11, id: 80 },
    { label: '家长姓名', value: 12, id: 90 },
    { label: '家长手机', value: 13, id: 100 },
    { label: '籍贯', value: 14, id: 110 },
    { label: '民族', value: 15, id: 120 },
    { label: '学籍', value: 16, id: 130 }
  ],
  slScreening: [
    { label: '戴镜类型', value: 1, id: 500 },
    { label: '戴镜视力', value: 2, id: 510 },
    { label: '裸眼视力', value: 3, id: 520 },
    { label: 'ok镜', value: 4, id: 530 },
    { label: '视力筛查时间', value: 5, id: 540 },
    { label: '视力备注', value: 6, id: 541 }
  ],
  qgScreening: [
    { label: '球镜', value: 1, id: 1000 },
    { label: '柱镜', value: 2, id: 1010 },
    { label: '轴位', value: 3, id: 1020 },
    { label: 'R1角膜曲率半径', value: 4, id: 1030 },
    { label: 'R1角膜屈光率', value: 5, id: 1040 },
    { label: 'R2角膜曲率半径', value: 6, id: 1050 },
    { label: 'R2角膜屈光率', value: 7, id: 1060 },
    { label: '角膜轴位', value: 8, id: 1070 },
    { label: '屈光筛查时间', value: 9, id: 1075 },
    { label: '屈光备注', value: 10, id: 1076 },
    { label: '屈光不正', value: 11, id: 1080 },
    { label: '串镜', value: 12, id: 1090 },
    { label: '初检结果', value: 13, id: 1100 }
  ],
  screeningInfo: [
    { label: '筛查情况', value: 1, id: 1101 },
    { label: '是否有效筛查', value: 2, id: 1102 }
  ],
  slInfo: [
    { label: '是否视力正常', value: 1, id: 1106 },
    { label: '是否近视', value: 2, id: 1107 },
    { label: '近视程度', value: 3, id: 1108 },
    { label: '近视矫正情况', value: 4, id: 1109 },
    { label: '是否远视', value: 5, id: 1110 },
    { label: '远视储备情况', value: 6, id: 1111 },
    { label: '是否散光', value: 7, id: 1112 },
    { label: '是否视力不良', value: 8, id: 1113 },
    { label: '视力不良程度', value: 9, id: 1114 }
  ],
  otherScreening: []
};

export function showScreenNumWraning(overstep, callback, diaOpt = { title: '是否确定提交', positiveText: '确定' }) {
  window.$preDialog({
    title: diaOpt.title,
    positiveText: diaOpt.positiveText,
    content: () => (
      <>
        <div className="max-h-160px overflow-auto">
          {overstep.map(item => (
            <div className="flex mt-2">
              <div className="text-[14px] font-bold w-140px">{item.regionName}</div>
              <div className="ml-5">
                <div flex>
                  <span className="w-150px"> 最多可筛查学生人数为 </span>
                  <span className="text-[14px] font-bold">{item.gradeNum || 0}</span>
                </div>
                <div flex>
                  <span className="w-150px"> 设置的目标数为 </span>
                  <span className="text-[14px] font-bold">{item.screeningNum || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
    onPositiveClick() {
      callback && callback();
    }
  });
}
