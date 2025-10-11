import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['prefix', 'period'])
export class OrderSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prefix: string; // CTS, CTG

  @Column()
  period: string; // e.g."2025-09" (monthly)

  @Column({ default: 0 })
  lastNumber: number;
}
