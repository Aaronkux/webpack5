import { Controller, Get, Provide, Redirect } from '@midwayjs/decorator';

@Provide()
@Controller('/')
export class HomeController {
  @Get('/')
  async home() {
    return 'Hello Midwayjs!';
  }

  @Get('/update')
  @Redirect('/', 302)
  async updateData() {
    return 'This is a post method';
  }
}
