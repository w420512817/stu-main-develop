import { defineConfig } from '@unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import transformerDirective from '@unocss/transformer-directives';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'build', 'mock', 'public', './stats.html'],
  presets: [presetUno({ dark: 'class' }), presetAttributify()],
  transformers: [transformerAttributifyJsx(), transformerDirective(), transformerVariantGroup()],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'flex-col': 'flex flex-col',
    'flex-col-stretch': 'flex-col items-stretch',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden overflow-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out'
  },
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1921px'
    },
    spacing: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '32px'
    },
    colors: {
      primary: 'var(--primary-color)',
      info: 'var(--info-color)',
      info_active: 'var(--info-color-active)',
      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      error: 'var(--error-color)',
      dark: '#18181c',
      secondary: '#8b949e'
    }
  }
});
