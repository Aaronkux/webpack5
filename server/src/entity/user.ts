import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role';

@EntityModel()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @ManyToMany(type => Role, role => role.users)
  @JoinTable()
  roles: Role[];

  async getFullName() {
    return `${this.firstname} ${this.lastname}`;
  }
  getPermissions() {
    return Array.from(
      new Set(
        this.roles.reduce((acc, cur) => acc.concat(cur.getPermission()), [])
      )
    );
  }
  // orderView
  // clientView
  // role
}
