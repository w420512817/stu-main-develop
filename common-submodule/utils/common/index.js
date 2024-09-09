import { isObject } from './is';
import { merge } from 'lodash-es';

/**
 * @param {src} 原始对象
 * @param {target} 目标对象
 * @description 对目标对象进行深度合并
 */
export const deepMerge = merge;

/**
 * @param {src} 原始对象
 * @param {target} 目标对象
 * @description 当src是对象target是数组时直接合并
 */
export function deepMergeArr(src = {}, target = {}) {
  let key;
  for (key in target) {
    src[key] =
      isObject(src[key]) && isObject(target[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * @param {tree} 原始树
 * @param {func} 回调
 * @description 通过指定回调 递归遍历
 */
export function filter(tree, func) {
  function listFilter(list) {
    return list
      .map(node => ({ ...node }))
      .filter(node => {
        node.children = node.children && listFilter(node.children);
        return func(node) || (node.children && node.children.length);
      });
  }

  return listFilter(tree);
}

/**
 * @param {Array} list
 * @param {String} fieldName
 * @description 删除空的children字段
 */
export function removeEmptyChildrenField(tree, fieldName = 'children') {
  const treeFilter = list => {
    list?.forEach(i => {
      const hasChildren = i[fieldName] && i[fieldName].length;
      !hasChildren ? (i[fieldName] = undefined) : treeFilter(i[fieldName]);
    });
    return list;
  };

  return treeFilter(tree);
}

/**
 * @param {Number} num
 * @description 数字千位分隔
 */
export function toThousands(num) {
  if ((!num && num !== 0) || Number.isNaN(Number(num))) {
    return num;
  }
  return Number(num).toLocaleString();
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export function getQuery(url) {
  const [path, queryStr] = decodeURIComponent(url)?.split('?') ?? [];
  const query = {};

  queryStr?.split('&')?.forEach(item => {
    if (item) {
      const [key, val] = item.split('=');
      query[key] = val;
    }
  });
  return [query, path];
}

export function getRawRoute(route) {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined
  };
}

/**
 * @param {Number|String} num
 * @description 小数转换成百分比
 */
export function numToPercent(num) {
  if (!num || Number.isNaN(Number(num))) {
    return 0;
  }
  return num >= 1 ? 100 : Math.round(num * 10000) / 100;
}

export function floatToPercent(d) {
  if (d >= 1) {
    return '100%';
  } else if (!d) {
    return '0%';
  } else {
    return Math.round(d * 10000) / 100 + '%';
  }
}

/**
 * @param {String} value
 * @description 输入框禁止输入 \/:*?"<>|字符
 */

export function illegalCharacter(value) {
  let reg = /[/:*?"\\<>|]/;
  return !reg.test(value);
}
