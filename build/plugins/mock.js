import { viteMockServe } from 'vite-plugin-mock';

export default isBuild => {
  return viteMockServe({
    mockPath: 'mock/modules',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock';
      setupProdMockServer();
      `
  });
};
