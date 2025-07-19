import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/providers/user.entity';
import { OtpType } from '../types/OtpType';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column()
  token: string;

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
