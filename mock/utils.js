// Interface data format used to return a unified format
export function resultSuccess(data, { message = 'ok' } = {}) {
  return {
    code: 200,
    data,
    message,
    success: true
  };
}

export function resultPageSuccess(page, pageSize, list, { message = 'ok' } = {}) {
  const pageData = pagination(page, pageSize, list);

  return {
    ...resultSuccess({
      list: pageData,
      total: list.length
    }),
    message
  };
}

export function resultError(message = 'Request failed', { code = -1, data = null } = {}) {
  return {
    code,
    data,
    message,
    type: 'error'
  };
}

export function pagination(pageNo, pageSize, array) {
  const offset = (pageNo - 1) * Number(pageSize);
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize));
  return ret;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }) {
  return headers?.authorization;
}
