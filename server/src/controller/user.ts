import {
  Controller,
  Get,
  Post,
  Param,
  Provide,
  Inject,
  Query,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { CreateApiDoc } from '@midwayjs/swagger';
import { UserService } from '../service/user';
import { MyError } from '../errors';
import { parseIntOrThrowValidationError } from '../utils';

@Provide()
@Controller('/api/user', { tagName: '用户管理' })
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @(CreateApiDoc()
    .summary('查询用户List')
    .respond(200, 'Success', 'json', {
      example: {
        success: true,
        data: [
          {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            isActive: true,
            permissions: ['readDoc'],
          },
        ],
      },
    })
    .respond(400, 'ValidationError', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'Invalid user id',
      },
    })
    .respond(404, 'NotFoundError', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'User id=1 not found',
      },
    })
    .build())
  @Get('/')
  async getUserList(@Query() current: string, @Query() pageSize: string) {
    const validCurrent = parseIntOrThrowValidationError(
      current,
      'Invalid current'
    );
    const validPageSize = parseIntOrThrowValidationError(
      pageSize,
      'Invalid pageSize'
    );
    const res = await this.userService.getUserList(validCurrent, validPageSize);
    // if (!res) throw new NotFoundError(`Record not found`);
    return { success: true, data: res };
  }

  @(CreateApiDoc()
    .summary('查询单个用户')
    .respond(200, 'Success', 'json', {
      example: {
        success: true,
        data: {
          id: 1,
          firstname: 'test',
          lastname: 'test',
          email: 'test',
          isActive: true,
        },
      },
    })
    .respond(400, 'ValidationError', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'Invalid user id',
      },
    })
    .respond(404, 'NotFoundError', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'User id=1 not found',
      },
    })
    .build())
  @Get('/:id')
  async getUser(@Param() id: string) {
    const validId = parseIntOrThrowValidationError(id, 'Invalid user id');
    const res = await this.userService.getUser(validId);
    if (!res) throw new MyError(`User id=${id} not found`, 'NotFoundError');
    return { success: true, data: res };
  }

  @Post('/test')
  async testUser() {
    const res = await this.userService.test();
    return { success: true, data: res };
  }
}
