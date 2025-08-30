import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProvider } from '../../services/entities/service-provider.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('groceries')
export class Grocery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. Fresh Tomatoes

  @Column({ nullable: true })
  category: string; // e.g., Fresh Produce

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // e.g. 200

  @Column({ default: false })
  sponsored: boolean; // e.g. "Sponsored" badge

  @Column({ default: true })
  is_available: boolean;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number; // e.g. 5.0

  @Column({ nullable: true })
  currency: string; // e.g. "₦"

  @Column({ nullable: true })
  unit: string; // e.g. "(e.g., kg, pack, litre)"

  @Column({ nullable: true })
  imageUrl: string; // product image

  @Column({ nullable: true })
  groceryType: string;

  /**
   * Foreign key column for provider
   */
  @Column({ name: 'provider_id', nullable: true })
  providerId: number;

  /**
   * Many services linked to one serviceProvider
   */
  @ManyToOne(() => ServiceProvider, (provider) => provider.groceries, {
    eager: true,
  })
  @JoinColumn({ name: 'provider_id' })
  serviceProvider: ServiceProvider;

  /**
   * One grocery can have much Review
   */
  @OneToMany(() => Review, (review) => review.grocery)
  reviews: Review[];
}
