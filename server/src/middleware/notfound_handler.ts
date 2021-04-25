import { Provide } from '@midwayjs/decorator';

@Provide('notFoundHandler')
export class NotFoundHandlerMiddleware {
  resolve() {
    return async function notFoundHandler(ctx, next) {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.body = { success: 'false', errorMessage: 'Not Found' };
      }
    };
  }
}
