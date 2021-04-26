import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Permission } from './permission';

@EntityModel()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @ManyToMany(type => User, user => user.roles)
  users: User[];

  @ManyToMany(type => Permission, permission => permission.roles)
  @JoinTable()
  permissions: Permission[];

  getPermission() {
    return this.permissions.map(p => p.permissionName);
  }
}
