import { defineConfig } from 'umi';
import { routes } from './config/route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: true,
  },
  mock: false,
  // remove selectlang warning bug
  locale: { default: 'en-US' },
  // request: {
  //   dataField: 'data',
  // },
  routes: routes,
  // theme: {
  //   // 'layout-sider-background': '#fff',
  //   'primary-color': '#7366ff',
  // },
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      hack: `true; @import "~@/themes/default.less";`,
    },
  },

  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:9000/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
});
