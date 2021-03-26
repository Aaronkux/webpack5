import { defineConfig } from 'umi';
import { routes } from './route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: true,
  },
  // remove selectlang warning bug
  locale: {},
  request: {
    dataField: 'data',
  },
  routes: routes,
  theme: {
    // 'layout-sider-background': '#fff',
    'primary-color': '#7366ff'
  }
});
