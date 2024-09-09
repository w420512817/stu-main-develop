import { createHtmlPlugin } from 'vite-plugin-html';
import config from '../../package.json';
export default viteEnv => {
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        appName: viteEnv.VITE_APP_NAME,
        appTitle: viteEnv.VITE_APP_TITLE,
        package_time: 'version:' + config.version + '; time:' + new Date().toLocaleString()
      }
    }
  });
};
