import { User } from 'src/users/providers/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Grocery } from '../../groceries/entities/Grocery';
import { Service } from '../../services/entities/service.entity';
import { Booking } from 'src/services/entities/Booking';

export enum ShippingMethod {
  ECONOMY = 'Economy',
  STANDARD = 'Standard',
  EXPRESS = 'Express',
}

export enum ContractType {
  ONE_TIME = 'One-Time',
  RECURRING = 'Recurring',
}

export enum PaymentMethod {
  CREDIT_CARD = 'Card',
  TRANSFER = 'Transfer',
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  DELIVERED = 'Delivered',
  CANCELED = 'Canceled',
}

export enum PaymentStatus {
  PAID = 'paid',
  FAILED = 'failed',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { lazy: true })
  user: User;

  @Column({ unique: true, nullable: true })
  code: string;

  @ManyToOne(() => Address, { eager: true })
  deliveryAddress: Address;

  @ManyToMany(() => Grocery, { lazy: true })
  @JoinTable()
  groceries: Grocery[];

  @ManyToMany(() => Service, { lazy: true })
  @JoinTable()
  services: Service[];

  @OneToOne(() => Booking, { eager: true, nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'enum', enum: ShippingMethod })
  shippingMethod: ShippingMethod;

  @Column({ type: 'enum', enum: ContractType, nullable: true })
  contractType: ContractType;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shipping: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  reference: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    nullable: true,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
