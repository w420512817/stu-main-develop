import { getStorageShortName } from '@common/utils/common/env';
import { getAPPType } from '@common/utils/common/env';

const prefixKey = getStorageShortName();

// 用户token
export const TOKEN_KEY = 'TOKEN__';

// 用户信息
export const USER_INFO_KEY = 'USER_INFO__';

// 地区key
export const AREAS_KEY = 'AREAS_KEY__';

// 多页签
export const MULTI_TAB_KEY = `MULTI_TAB_KEY__${getAPPType()}`;

// 保持登录
export const KEEP_LOADING_KEY = `${prefixKey}KEEP_LOADING__`;

export const CUSTOMERID_KEY = 'CUSTOMERID_KEY__';
