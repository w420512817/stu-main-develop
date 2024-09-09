import { useBreakpoints } from '@vueuse/core';
import { breakpoints } from '@common/settings/theme';

export function useBreakpoint() {
  const breakpoint = useBreakpoints(breakpoints);

  // 手机
  const isMobile = breakpoint.smaller('sm');

  // 平板或笔记本
  const isLaptop = breakpoint.smaller('xl');

  return {
    breakpoint,

    isMobile,
    isLaptop
  };
}
