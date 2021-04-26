// import * as assert from 'assert';

import { IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';

// import MyError from '../util/my-error';

// jwt auth
export default () => {
  return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
    if (ctx.header.authorization) {
      // const [, token] = ctx.header.authorization.split(' ');
      // // 解密，获取payload
      // const { payload } = ctx.app.jwt.decode<{ id: number }>(token);

      // const { jwtAuth } = ctx.app.config;


      // // 验证是否为最新的token
      // assert(token === redisToken, new MyError('Authentication Failed', 401));

      // ctx.currentUser = JSON.parse(userinfo);
    }

    await next();
  };
};
