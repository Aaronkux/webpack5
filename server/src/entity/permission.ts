import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Role } from './role';

@EntityModel()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionName: string;

  @ManyToMany(type => Role, user => user.permissions)
  roles: Role[];
}
