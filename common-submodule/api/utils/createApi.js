// import { list } from './data';

const { list } = require('./data');

const basepath = '${appType}';

const api = list.reduce((pre, next) => {
  const arr = next.path.split('/');
  const name = arr.at(-1);
  if (!pre[name]) {
    pre[name] = `aaa${basepath}${next.path},aaa //${next.title}aaa`;
  }
  return pre;
}, {});

// console.log(api, 'api');

const str = JSON.stringify(api);
const res = str.replace(/"aaa/g, '`').replace(/,aaa/g, '`,').replace(/aaa",/g, '');
console.log(res);
// 'aaa    `
// ,aaa    ,`
// 'aaa    `
// aaa'    空
