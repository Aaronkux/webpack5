import { Provide } from '@midwayjs/decorator';

@Provide('errorHandler')
export class ErrorHandlerMiddleware {
  resolve() {
    return async function errorHandler(ctx, next) {
      try {
        await next();
      } catch (err) {
        ctx.logger.error(err);

        switch (err.name) {
          case 'ValidationError':
            ctx.response.status = 400;
            ctx.body = {
              success: 'false',
              showType: 2,
              errorMessage: err.message.replace(/\"/g, ''),
            };
            break;

          case 'NotFoundError':
            ctx.response.status = 404;
            ctx.body = {
              success: 'false',
              showType: 2,
              errorMessage: err.message,
            };
            break;

          default:
            ctx.response.status = 400;
            ctx.body = {
              success: 'false',
              showType: 2,
              errorMessage: err.message,
            };
        }
      }
    };
  }
}
