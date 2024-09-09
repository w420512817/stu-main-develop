import { resultPageSuccess } from '../utils';

const devicesList = (() => {
  const result = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      equipmentType: '电脑验光仪',
      equipmentVendor: '天乐',
      equipmentModel: '@cword(5,10)',
      equipmentSerial: '电脑验光仪',
      screenCategory: '@cword(10,20)',
      'connectWaySt|1': ['蓝牙链接', '扫码链接']
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/devicesList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, devicesList);
    }
  }
];
