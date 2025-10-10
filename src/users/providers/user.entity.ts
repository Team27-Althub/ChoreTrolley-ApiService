import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatus } from '../enums/user-status';
import { Profile } from '../../profile/entities/profile.entity';
import { Order } from '../../order/entities/order.entity';
import { Booking } from 'src/services/entities/Booking';

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
    default: UserStatus.Verified,
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];
}
