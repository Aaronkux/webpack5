import { Provide, Config, Plugin } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { JwtAuthMiddlewareConfig } from '../config/config.types';
import { User } from '../entity/user';
import { Role } from '../entity/role';
import { Permission } from '../entity/permission';
import { Repository } from 'typeorm';
import { UserCreateDTO } from '../dto/user';
import { LoginDTO } from '../dto/auth';

@Provide()
export class UserService {
  @Config('jwt')
  jwtConfig: JwtEggConfig;

  @Config('jwtAuth')
  jwtAuthConfig: JwtAuthMiddlewareConfig;

  @InjectEntityModel(User)
  userModel: Repository<User>;
  @InjectEntityModel(Role)
  roleModel: Repository<Role>;
  @InjectEntityModel(Permission)
  permissionModel: Repository<Permission>;

  @Plugin()
  jwt: Jwt;

  async authUser(user: LoginDTO) {
    const res = await this.userModel.findOne({
      where: {
        email: user.email,
        password: user.password,
      },
      relations: ['roles', 'roles.permissions'],
    });
    const permissions = await res.getPermissions();
    const { roles, ...rest } = res;
    const token: string = this.jwt.sign(
      { id: res.id },
      this.jwtConfig.client.secret,
      { expiresIn: this.jwtAuthConfig.accessTokenExpiresIn }
    );
    return { ...rest, permissions, token };
  }

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
      select: ['firstname', 'lastname', 'email', 'id', 'isActive'],
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    return { users: res, total };
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
    role.roleName = 'admin';
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
