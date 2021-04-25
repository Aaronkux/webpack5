import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export const orm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'globalpay',
  synchronize: true,
  logging: false,
};

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1618386847240_9317';

  // add your config here
  config.middleware = ['errorHandler', 'notFoundHandler'];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.multipart = {
    mode: 'file',
  };

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  return config;
};
