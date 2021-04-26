import {
  Controller,
  Post,
  Body,
  Provide,
  Inject,
  Validate,
  HttpCode,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { ALL } from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { UserService } from '../service/user';
import { UserCreateDTO } from '../dto/user';
import { LoginDTO } from '../dto/auth';
import { MyError } from '../errors';

@Provide()
@Controller('/api', { tagName: '登陆注册' })
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @(CreateApiDoc()
    .summary('登陆')
    .param('body', {
      required: true,
    })
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
    .respond(400, 'Bad Request', 'json', {
      example: {
        success: false,
        showType: 2,
        errorMessage: 'password is required',
      },
    })
    .build())
  @HttpCode(201)
  @Post('/login')
  @Validate()
  async authUser(@Body(ALL) user: LoginDTO) {
    const res = await this.userService.authUser(user);
    if (!res) throw new MyError('username or password error', 'NotFoundError');
    return { success: true, data: res };
  }

  @(CreateApiDoc()
    .summary('注册用户')
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
  @Post('/register')
  @Validate()
  async createUser(@Body(ALL) user: UserCreateDTO) {
    try {
      await this.userService.createUser(user);
    } catch (err) {
      throw new MyError('create failed', 'Create Error');
    }
    return { success: true, data: 'create success' };
  }
}
