import { isObject } from './is';

export default (arr, params) => {
  if (!isObject(params)) {
    throw new Error('第二个参数参数应该是一个对象');
  }
  return arr.map(item => {
    return {
      label: item[params.label],
      value: item[params.value]?.toString()
    };
  });
};
