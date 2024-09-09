import { h } from 'vue';
import { NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';
import SvgIcon from '@common/components/custom/SvgIcon.vue';

/**
 * 动态渲染iconify
 * @param icon - 图标名称
 * @param opt - 图标可选属性 https://github.com/iconify/iconify/tree/master/packages/vue
 */
export function iconifyRender(icon, opt = {}) {
  const options = {
    icon,
    inline: true,
    ...opt
  };
  return () => h(NIcon, { size: opt.size }, { default: () => h(Icon, options) });
}

/**
 * 动态渲染自定义图标
 * @param icon - 图标名称
 */
export function customIconRender(icon, prefix = 'icon-custom', style) {
  return () => h(NIcon, null, { default: () => h(SvgIcon, { icon, prefix, style }) });
}
