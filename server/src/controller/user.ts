import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Provide,
  Inject,
  Validate,
  HttpCode,
  Query,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { ALL } from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { UserService } from '../service/user';
import { UserCreateDTO } from '../dto/user';
import { NotFoundError } from '../errors';
import { parseIntOrThrowValidationError } from '../utils';

@Provide()
@Controller('/api/users')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @(CreateApiDoc()
    .summary('查询用户')
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
    if (!res) throw new NotFoundError(`User id=${id} not found`);
    return { success: true, data: res };
  }

  @(CreateApiDoc()
    .summary('创建用户')
    .param('body', {
      required: true,
    })
    .respond(201, 'Success', 'json', {
      example: {
        success: true,
        message: 'create success',
      },
    })
    .respond(400, 'Bad Request', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'firstname is required',
      },
    })
    .build())
  @HttpCode(201)
  @Post('/')
  @Validate()
  async createUser(@Body(ALL) user: UserCreateDTO) {
    const res = await this.userService.createUser(user);
    return { success: true, data: res };
  }
}
