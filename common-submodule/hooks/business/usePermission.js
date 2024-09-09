import { useUserStore } from '@/store';
import { isArray } from '@common/utils/common/is';

/** 权限判断 */
export function usePermission() {
  const userStore = useUserStore();

  function hasPermission(value, def = true) {
    // Visible by default
    if (!value) {
      return def;
    }

    if (!isArray(value)) {
      return userStore.permissions.includes(value);
    }

    return value.some(item => userStore.permissions.includes(item));
    // return true;
  }

  return {
    hasPermission
  };
}
