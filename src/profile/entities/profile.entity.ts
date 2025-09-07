import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/providers/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  // @Column({ nullable: true })
  // role: string; // e.g., Home-owner

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ unique: true })
  userId: number;

  // Relationship with User
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
