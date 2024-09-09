/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import { usePermission } from '@common/hooks/business/usePermission';

function isAuth(el, value) {
  if (!value) {
    throw new Error(`need roles: like v-auth="'admin'", v-auth="['admin', 'test]"`);
  }

  const { hasPermission } = usePermission();

  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const authDirective = {
  mounted(el, binding) {
    isAuth(el, binding.value);
  },
  beforeUpdate(el, binding) {
    isAuth(el, binding.value);
  }
};

export function setupPermissionDirective(app) {
  app.directive('auth', authDirective);
}
