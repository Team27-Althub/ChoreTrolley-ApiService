import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/providers/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
