export class AxiosRetry {
  retry(AxiosInstance, error) {
    const { config } = error.response;
    const { waitTime, count } = config?.requestOptions?.retryRequest ?? {};
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    return this._delay(waitTime).then(() => AxiosInstance(config));
  }

  // 延迟
  _delay(waitTime) {
    return new Promise(resolve => setTimeout(resolve, waitTime));
  }
}
