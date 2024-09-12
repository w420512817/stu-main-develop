import { useUserStore } from '@/store';
import { RequestEnum } from '@common/enum/httpEnum';
import { checkStatus } from './checkStatus';
import { AxiosRetry } from './axiosRetry';
import { getToken } from '../auth';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res, options) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error('请求出错，请稍候重试');
    }

    if (data.success) {
      return data.data;
    }

    // 须重新登录
    if (['600', '601', '602', '603'].includes(data.code)) {
      const userStore = useUserStore();
      // setTimeout(() => {
      //   userStore.logout(true);
      // }, 1000);
    }

    if (options.errorMessageMode === 'modal') {
      window.$dialog?.error({ title: '错误提示', content: data.message, positiveText: '确认' });
    } else if (options.errorMessageMode === 'message') {
      window.$message?.error(data.message);
    }

    throw new Error(data.message);
  },

  // 请求之前处理config
  beforeRequestHook: config => {
    const params = config.params || {};
    const data = config.data || false;

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      config.params = params;
    } else {
      if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: config => {
    const token = getToken();
    if (token && config?.requestOptions?.withToken !== false) {
      config.headers.Authorization = token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: res => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance, error) => {
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg = response?.data?.error?.message ?? '';
    const err = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = '接口请求超时,请刷新页面重试!';
      }
      if (err?.includes('Network Error')) {
        errMessage = '网络异常，请检查您的网络连接是否正常!';
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          window.$dialog?.error({ title: '错误提示', content: errMessage, positiveText: '确认' });
        } else if (errorMessageMode === 'message') {
          window.$message?.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config?.requestOptions?.retryRequest ?? {};
    if (isOpenRetry && config.method?.toUpperCase() === RequestEnum.GET) {
      retryRequest.retry(axiosInstance, error);
    }

    return Promise.reject(error);
  }
};
