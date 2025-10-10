import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Review } from '../../review/entities/review.entity';
import { ServiceProvider } from './service-provider.entity';
import { Booking } from './Booking';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  price: number;

  @Column()
  priceUnit: string; // hr, item, visit, wash, meal, session, quote

  @Column({ default: false })
  sponsored: boolean;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @Column()
  serviceType: string; // Full-time, Part-time, On-Demand

  @Column('jsonb', { nullable: true })
  available_hours: Record<string, string[]>;

  @ManyToOne(() => ServiceProvider, (provider) => provider.services, {
    eager: true,
  })
  @JoinColumn({ name: 'provider_id' })
  serviceProvider: ServiceProvider;

  @OneToMany(() => Booking, booking => booking.service, { lazy: true, })
  bookings: Booking[];
}
