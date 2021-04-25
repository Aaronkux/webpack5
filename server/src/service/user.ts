import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../dto/user';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async getUser(id: number) {
    const res = await this.userModel.findOne({ id });
    return res;
  }

  async getUserList(current: number, pageSize: number) {
    const [res, count] = await this.userModel.findAndCount({
      where: {
        email: 'test@test.com',
      },
      skip: current,
      take: pageSize,
    });
    // const res = await this.userModel.createQueryBuilder("user").skip(current).take(pageSize).getMany();
    console.log(res, count);
    // return [res, total];
  }

  async createUser(user: UserCreateDTO) {
    const res = await this.userModel.save(user);
    return res;
  }
}
