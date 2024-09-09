import { ref } from 'vue';
import { useElementSize } from '@vueuse/core';

export default function useTableHeaderHeight() {
  const pageHeaderElRef = ref(null);
  const { height: headerHeight } = useElementSize(pageHeaderElRef);

  return {
    pageHeaderElRef,
    headerHeight
  };
}
