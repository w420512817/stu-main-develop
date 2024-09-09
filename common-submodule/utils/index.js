import { unref } from 'vue';
import { isObject } from './common/is';
export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node) {
  return node?.parentNode ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge(src, target) {
  let key;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(url, opt) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps(props) {
  const ret = {};

  Object.keys(props).map(key => {
    ret[key] = unref(props[key]);
  });

  return ret;
}

/**
 * @description 按照一定路径规则批量导入文件
 * @param pathRule eg: pathRule =  './modules/*.js'
 */
export function getDynamicModules(modules) {
  const ret = {};

  Object.keys(modules).forEach(path => {
    // **/user.js --> user
    const fileName = path.replace(/(.*\/)*([^.]+).*/gi, '$2');
    ret[fileName] = modules[path]?.default ?? {};
  });

  return ret;
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

// 字典转换为适用options
export function dictToOptions(data, key = 'code', value = 'name') {
  if (!Array.isArray(data)) return [];

  let options = [];
  data.forEach(item => {
    options.push({
      label: item[value],
      value: item[key]
    });
  });
  return options;
}

// 根据表单动态计算出要渲染的columns

export function getColumns(arr) {
  return arr.filter(item => !item.hidden);
}
// 去掉对象中的null
export function removeNullProperties(tree) {
  let stack = [tree];
  let result = {};

  while (stack.length > 0) {
    let obj = stack.pop();

    for (let prop in obj) {
      let value = obj[prop];
      if (value !== null) {
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            obj[prop] = value.filter(v => v !== null);
          } else {
            obj[prop] = {};
            stack.push(value);
          }
        }
        result[prop] = obj[prop];
      }
    }
  }

  return result;
}

export function removeNullValues(obj) {
  if (Array.isArray(obj)) {
    // 处理数组类型的属性值
    return obj.filter((_, index) => index !== null).map(removeNullValues);
  } else if (typeof obj === 'object' && obj !== null) {
    // 处理对象类型的属性值
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== null) {
        result[key] = removeNullValues(value);
      }
    }
    return result;
  }
  return obj;
}

export function convertEmptyStringToNull(obj = {}) {
  for (let key in obj) {
    if (Reflect.has(obj, key)) {
      if (typeof obj[key] === 'string' && obj[key] === '') {
        obj[key] = null;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        convertEmptyStringToNull(obj[key]);
      }
    }
  }
}
