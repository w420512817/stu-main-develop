import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoutes } from './routes';
import { setupRouterGuard } from './guard';

// app router
export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// reset router
export function resetRouter() {
  const routes = router.getRoutes();
  const constantRouteNames = constantRoutes.map(i => i.name);

  routes.forEach(route => {
    const name = route.name;

    if (name && !constantRouteNames.includes(name)) {
      router.removeRoute(name);
    }
  });
}

// config router
export async function setupRouter(app) {
  app.use(router);
  setupRouterGuard(router);
  await router.isReady();
}
