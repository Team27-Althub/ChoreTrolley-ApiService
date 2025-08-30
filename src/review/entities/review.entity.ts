import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Grocery } from '../../groceries/entities/Grocery';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number; // 1.0 - 5.0

  @Column('text')
  comment: string;

  //Review linked to Services
  @ManyToOne(() => Service, (service) => service.reviews, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  service: Service;

  //Review linked to Groceries
  @ManyToOne(() => Grocery, (grocery) => grocery.reviews, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  grocery: Grocery;
}
