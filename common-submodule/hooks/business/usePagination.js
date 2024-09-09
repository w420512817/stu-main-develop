import { toRefs, reactive, h } from 'vue';
import { isFunction } from '@common/utils/common/is';
import { useBreakpoint } from '@common/hooks/useBreakpoint';

export default function usePagination(callback, opts = {}) {
  if (!callback || !isFunction(callback)) {
    throw new Error('usePagination() 必须接收一个callback用以刷新数据！');
  }

  // 需要在小屏上做调整
  const { isLaptop } = useBreakpoint();

  const pagination = reactive({
    page: 1,
    pageSize: 15,
    itemCount: 1,
    showSizePicker: true,
    pageSizes: [15, 25, 50, 100],
    onChange: changePage,
    onPageSizeChange: changePageSize,
    prefix({ itemCount }) {
      if (isLaptop.value) {
        return undefined;
      }
      return h('span', null, { default: () => `总数：${itemCount}` });
    },
    ...opts
  });

  const { page, pageSize, itemCount } = toRefs(pagination);

  function changePage(p) {
    page.value = p;
    callback({ page: p });
  }

  function changePageSize(pz) {
    page.value = 1;
    pageSize.value = pz;
    callback({ pageSize: pz });
  }

  return {
    itemCount,
    pagination,
    setPage: p => (page.value = p),
    setCount: t => (itemCount.value = t)
  };
}
