import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatus } from '../enums/user-status';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Exclude()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.UnVerified,
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  googleId?: string;
}
