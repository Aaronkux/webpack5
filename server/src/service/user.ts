import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/user';
import { Role } from '../entity/role';
import { Permission } from '../entity/permission';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../dto/user';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;
  @InjectEntityModel(Role)
  roleModel: Repository<Role>;
  @InjectEntityModel(Permission)
  permissionModel: Repository<Permission>;

  async getUser(id: number) {
    let res = await this.userModel.findOne({
      where: {
        id,
      },
      relations: ['roles', 'roles.permissions'],
    });
    const permissions = await res.getPermissions();
    const { roles, ...rest } = res;
    return { ...rest, permissions };
  }

  async getUserList(current: number, pageSize: number) {
    const [res, total] = await this.userModel.findAndCount({
      skip: current,
      take: pageSize,
    });
    // const res = await this.userModel.createQueryBuilder("user").skip(current).take(pageSize).getMany();
    return [res, total];
  }

  async test() {
    let user = await this.userModel.findOne({ id: 1 });

    let permission1 = new Permission();
    permission1.permissionName = 'readTest';
    await this.permissionModel.save(permission1);

    let permission2 = new Permission();
    permission2.permissionName = 'writeTest';
    await this.permissionModel.save(permission2);

    let role = new Role();
    role.roleName = 'readTest';
    role.permissions = [permission1, permission2];
    await this.roleModel.save(role);

    user.roles = [role];
    await this.userModel.save(user);

    return 'test';
  }

  async createUser(user: UserCreateDTO) {
    const res = await this.userModel.save(user);
    return res;
  }
}
