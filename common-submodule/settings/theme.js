import { reactive } from 'vue';
import { kebabCase } from 'lodash-es';
import { getColorPalette, addColorAlpha } from '@common/utils/common/color';
import { deepMerge } from '@common/utils/common';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1921,
  mxxl: 5500
};

const themeColorList = [
  '#1890ff',
  '#1F6CFF', // 新的主题色
  '#409EFF',
  '#2d8cf0',
  '#007AFF',
  '#5ac8fa',
  '#5856D6',
  '#536dfe',
  '#9c27b0',
  '#AF52DE',
  '#0096c7',
  '#00C1D4',
  '#34C759',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#78DEC7',
  '#e53935',
  '#d81b60',
  '#f4511e',
  '#fb8c00',
  '#ffb300',
  '#fdd835',
  '#6d4c41',
  '#546e7a'
];

const defaultThemeSetting = {
  layout: {
    minWidth: 900,
    mode: 'vertical'
  },
  themeColor: themeColorList[1],
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  fixedHeaderAndTab: true,
  header: {
    inverted: true,
    height: 56,
    crumb: {
      visible: true,
      showIcon: true
    }
  },
  tab: {
    visible: true,
    showReload: true,
    height: 40,
    isCache: true
  },
  sider: {
    inverted: true,
    width: 220,
    collapsedWidth: 64
  },
  menu: {
    accordion: true // 菜单自动收起
  },
  footer: {
    visible: false,
    fixed: false,
    height: 48
  },
  page: {
    animate: true,
    animateMode: 'fade-slide'
  }
};

export let theme = reactive({ ...defaultThemeSetting });

/** 获取主题颜色的各种场景对应的颜色 */
function getThemeColors(colors) {
  const colorActions = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => getColorPalette(color, 5) },
    { scene: 'Pressed', handler: color => getColorPalette(color, 7) },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
  ];

  const themeColor = {};

  colors.forEach(color => {
    colorActions.forEach(action => {
      const [colorType, colorValue] = color;
      const colorKey = `${colorType}Color${action.scene}`;
      themeColor[colorKey] = action.handler(colorValue);
    });
  });

  return themeColor;
}

/** 获取naive的主题颜色 */
export function getNaiveThemeOverrides() {
  const primary = theme.themeColor;
  const { success, warning, error } = theme.otherColor;

  const info = getColorPalette(primary, 7);

  const themeColors = getThemeColors([
    ['primary', primary],
    ['info', info],
    ['success', success],
    ['warning', warning],
    ['error', error]
  ]);

  const colorLoading = primary;

  addThemeCssVarsToHtml(themeColors);

  return {
    common: {
      ...themeColors
    },
    LoadingBar: {
      colorLoading
    },
    Breadcrumb: {
      itemTextColor: 'white',
      itemTextColorHover: 'white',
      itemTextColorActive: 'white',
      separatorColor: 'white'
    }
  };
}

/** 添加css vars至html */
function addThemeCssVarsToHtml(themeVars) {
  const keys = Object.keys(themeVars);
  const style = [];
  keys.forEach(key => {
    style.push(`--${kebabCase(key)}: ${themeVars[key]}`);
  });
  const styleStr = style.join(';');
  document.documentElement.style.cssText += styleStr;
}

/* 更改主题配置 */
export function changeThemeSetting(obj) {
  theme = deepMerge(theme, obj);
}
