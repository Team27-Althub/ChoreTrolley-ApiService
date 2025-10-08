import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Grocery } from "../../groceries/entities/Grocery";

@Entity()
export class GroceryCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Grocery, (grocery) => grocery.category)
  grocery: Grocery[];

  @Column({ nullable: true })
  imageUrl: string;
}
