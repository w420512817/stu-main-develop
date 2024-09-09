import { loadEnv } from 'vite';
import { resolve } from 'path';
import { createVitePlugins } from './build/plugins';
import { createProxy } from './build/proxy';
import { getRootPath, getSrcPath, getCommonPath, wrapperEnv } from './build/utils';

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  // 数据类型转换 比如：'true' -> true
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '~': getRootPath(),
        '@': getSrcPath(),
        '@common': getCommonPath()
      }
    },
    server: {
      host: true,
      port: 3301,
      proxy: createProxy(VITE_PROXY)
    },
    build: {
      // sourcemap: true,
      outDir: viteEnv.VITE_OUT_DIR,
      target: 'es2015',
      reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
      chunkSizeWarningLimit: 1024 // chunk 大小警告的限制（单位kb）
    },
    define: {},
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${resolve(__dirname, 'common-submodule/design/var.less')}";`
        }
      }
    },

    plugins: createVitePlugins(viteEnv, isBuild)
  };
};
