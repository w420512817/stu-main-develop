import { ref } from 'vue';
import { isFunction } from '@common/utils/common/is';

export default function useApi(apiFn) {
  if (!apiFn || !isFunction(apiFn)) {
    throw new Error('useApi() 参数不能为空，且为function');
  }

  const loading = ref(false);
  const result = ref(null);
  const error = ref(null);

  const fetch = async params => {
    loading.value = true;
    return apiFn(params)
      .then(data => {
        result.value = data;
        return data;
      })
      .catch(e => {
        error.value = e;
        return Promise.reject(e);
      })
      .finally(() => {
        loading.value = false;
      });
  };
  return {
    loading,
    error,
    result,
    fetch
  };
}
