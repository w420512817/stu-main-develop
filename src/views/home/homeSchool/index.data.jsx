import { numToPercent } from '@common/utils/common';
import rankImg1 from '@/assets/image/dashbord/rank-1.png';
import rankImg2 from '@/assets/image/dashbord/rank-2.png';
import rankImg3 from '@/assets/image/dashbord/rank-3.png';
let rankArr = [rankImg1, rankImg2, rankImg3];
export const columns = [
  {
    key: 'city',
    title: '排名',
    align: 'center',
    width: 60,
    render(_row, index) {
      if (rankArr[index]) {
        return <img src={rankArr[index]} className="w-28px h-28px" />;
      }
      return <div className="w-28px h-28px">{index + 1}</div>;
    }
  },
  {
    key: 'name',
    title: '年级',
    align: 'center'
  },
  {
    key: 'validCount',
    title: '有效筛查人数',
    align: 'center',
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'validRate',
    title: '有效筛查率',
    render: v => <span className="text-[#386FFF] font-bold">{numToPercent(v.validRate) + '%'}</span>,
    align: 'center',
    ellipsis: {
      tooltip: true
    }
  }
];
