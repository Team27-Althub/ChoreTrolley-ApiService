import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Review } from '../../review/entities/review.entity';

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
}
