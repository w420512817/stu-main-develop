import { ls, ss } from '../cache';
import { TOKEN_KEY, KEEP_LOADING_KEY } from '@common/enum/cacheEnum';
// import cookie from '../cache/cookie';
import sessionStorageMock from '../cache/sessionStorageMock';
import { AppNameEnum } from '@common/enum/pageEnum';
const getIsLocal = () => localStorage.getItem(KEEP_LOADING_KEY) === 'true';

export const isLocal = getIsLocal();

/** 设置token */
export function setToken(token) {
  // getIsLocal() ? ls.set(TOKEN_KEY, token) : ss.set(TOKEN_KEY, token);//token修改为存储在cookie获得开发和线上环境开发的一致性
  getIsLocal() ? sessionStorageMock.setItem(TOKEN_KEY, token, 7) : sessionStorageMock.setItem(TOKEN_KEY, token);
}

/** 获取token */
export function getToken() {
  // return getIsLocal() ? ls.get(TOKEN_KEY) : ss.get(TOKEN_KEY);
  return sessionStorageMock.getItem(TOKEN_KEY);
}

/** 去除token */
export function removeToken() {
  getIsLocal() ? ls.remove(TOKEN_KEY) : ss.remove(TOKEN_KEY);
}

export function getAppName() {
  const { VITE_APP_KEY } = import.meta.env;
  const typeNum = AppNameEnum[VITE_APP_KEY] ?? '';
  return typeNum;
}
