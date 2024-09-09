import { numToPercent } from '@common/utils/common/index';
export const columns = [
  { key: 'regionName', title: '地区' },
  {
    key: 'typeName',
    title: '筛查类型',
    render(v) {
      let colorMap = {
        1: '#F3F7FF',
        2: '#F7F6FF',
        3: '#F0F8FF',
        4: '#F0FBF7'
      };
      return (
        <span style={`background: ${colorMap[v.typeId]}`} className="px-7px py-4px text-[#262626] whitespace-nowrap">
          {v.typeName ? v.typeName : '/'}
        </span>
      );
    }
  },
  {
    key: 'screenRate',
    title: '筛查率',
    render(row) {
      return (
        <span className="text-[#386FFF] font-bold" style="fontFamily: SourceHanSansCN-Bold,SourceHanSansCN">
          {numToPercent(row.screenRate)}%
        </span>
      );
    }
  },
  { key: 'stdCount', title: '筛查人数' }
];

export const types = [{ label: '视力', value: 1 }];
