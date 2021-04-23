import { Controller, Get, Provide, Query } from '@midwayjs/decorator'
import { ALL } from '@midwayjs/decorator';
import { User } from '../interface';

@Provide()
@Controller('/api/user')
export class UserController {
  @Get('/')
  async getUser(@Query(ALL) queryObject: object): Promise<User> {
    console.log(queryObject)
    return {
      id: 1,
      name: 'aaron',
      age: 22
    }
  }
}