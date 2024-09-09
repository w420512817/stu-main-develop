import { VAxios } from './Axios';
import { getAppEnv } from '../common/env';
import { deepMerge } from '../common';
import { ContentTypeEnum } from '@common/enum/httpEnum';
import { transform } from './axiosTransform';

const { VITE_API_URL } = getAppEnv();

function createAxios(opt = {}) {
  return new VAxios(
    deepMerge(
      {
        timeout: 15 * 1000,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 基础接口地址
        baseURL: VITE_API_URL,
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: opt.isReturnNativeResponse || false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // 请求重试机制
          retryRequest: {
            isOpenRetry: false,
            count: 5,
            waitTime: 100
          }
        }
      },
      opt
    )
  );
}

export const defHttp = createAxios();
