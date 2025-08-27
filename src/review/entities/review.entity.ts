import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number; // 1.0 - 5.0

  @Column('text')
  comment: string;

  @ManyToOne(() => Service, (service) => service.reviews)
  service: Service;
}
