import { tryOnUnmounted, useDebounceFn, useEventListener } from '@vueuse/core';
import { unref, nextTick, ref } from 'vue';

import echarts from '@common/utils/lib/echarts';

// 自定义主题
import bigScreen from '@common/hooks/themes/bigScreen.json';
// 注册主题
echarts.registerTheme('bigScreen', bigScreen);

export function useECharts(elRef, theme) {
  let chartInstance = null;
  let resizeFn = resize;
  const cacheOptions = ref({});

  resizeFn = useDebounceFn(resize, 200);

  function initCharts() {
    const el = unref(elRef);
    if (theme) {
      chartInstance = echarts.init(el, theme);
    } else {
      chartInstance = echarts.init(el);
    }
    useEventListener(window, 'resize', resizeFn);
  }

  function setOptions(options) {
    cacheOptions.value = options;
    nextTick(() => {
      initCharts();
      chartInstance?.clear();
      chartInstance?.setOption(
        unref({
          backgroundColor: 'transparent',
          ...cacheOptions.value
        })
      );
    });
  }

  function resize() {
    chartInstance?.resize();
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance() {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance
  };
}
