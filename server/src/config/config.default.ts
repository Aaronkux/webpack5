import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as typegoose from '@midwayjs/typegoose';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export const mongoose: typegoose.DefaultConfig = {
  uri: '',
  options: {},
};

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1618386847240_9317';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  return config;
};
