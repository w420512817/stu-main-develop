/*
 * @Author: wangjq wjq4416@163.com
 * @Date: 2024-09-09 13:00:59
 * @LastEditors: wangjq
 * @LastEditTime: 2024-10-15 16:56:20
 */
/**
 * Used to parse the .env.development proxy configuration
 */

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list = []) {
  const ret = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '/api'),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {})
    };
  }
  return ret;
}
