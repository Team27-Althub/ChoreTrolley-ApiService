import { User } from 'src/users/providers/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Grocery } from '../../groceries/entities/Grocery';
import { Service } from '../../services/entities/service.entity';

export enum ShippingMethod {
  ECONOMY = 'Economy',
  STANDARD = 'Standard',
  EXPRESS = 'Express',
}

export enum ContractType {
  ONE_TIME = 'One Time',
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

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { lazy: true })
  user: User;

  @ManyToOne(() => Address, { eager: true })
  deliveryAddress: Address;

  @ManyToMany(() => Grocery, { eager: true })
  @JoinTable()
  groceries: Grocery[];

  @ManyToMany(() => Service, { eager: true })
  @JoinTable()
  services: Service[];

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
