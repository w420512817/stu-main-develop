import 'uno.css';
import '@common/design/index.css';
import '@common/design/naive-ui/index.less';
import 'virtual:svg-icons-register';

import App from './App.vue';
import { createApp } from 'vue';

import { setupStore } from '@/store';
import { setupGlobDirectives } from '@common/directives';
import { setupRouter } from '@/router';

async function setupApp() {
  const app = createApp(App);

  // Configure store
  setupStore(app);

  // Register global directive
  setupGlobDirectives(app);

  // Configure routing
  await setupRouter(app);

  app.mount('#app');
}

setupApp();
