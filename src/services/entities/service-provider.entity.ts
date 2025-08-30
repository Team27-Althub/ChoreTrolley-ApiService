import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/providers/user.entity';
import { Service } from './service.entity';
import { Grocery } from '../../groceries/entities/Grocery';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  service_provider_id: number;

  // Linked user account
  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column('simple-array', { nullable: true })
  skills: string[]; // e.g. ["plumbing", "electrical", "cleaning"]

  @Column('simple-array', { nullable: true })
  certifications: string[]; // e.g. ["ISO-9001", "NEBOSH"]

  /**
   * Example:
   * {
   *   "monday": ["09:00-12:00", "14:00-18:00"],
   *   "tuesday": ["10:00-15:00"]
   * }
   */
  @Column('jsonb', { nullable: true })
  available_hours: Record<string, string[]>;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', unique: true })
  id: number;

  // Relations
  @OneToMany(() => Service, (service) => service.serviceProvider)
  services: Service[];

  @OneToMany(() => Grocery, (grocery) => grocery.serviceProvider)
  groceries: Grocery[];
}
