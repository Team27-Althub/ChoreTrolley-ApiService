import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column()
    date: string; // e.g., '2025-10-01'

    @Column()
    timeSlot: string; // e.g., '10:30 AM'

    @ManyToOne(() => Service, service => service.bookings)
    service: Service;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}