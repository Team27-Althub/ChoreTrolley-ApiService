import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service.entity";
import { ServiceProvider } from "./service-provider.entity";
import { User } from "src/users/providers/user.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @ManyToOne(() => User, (user) => user.bookings, { lazy: false, nullable: true })
    @JoinColumn({ name: 'customerId' })
    customer: User;

    @Column()
    date: string; // e.g., '2025-10-01'

    @Column()
    timeSlot: string; // e.g., '10:30 AM'

    @ManyToOne(() => Service, service => service.bookings)
    service: Service;

    @ManyToOne(() => ServiceProvider, (provider) => provider.bookings, {
        lazy: true,
    })
    @JoinColumn({ name: 'provider_id' })
    serviceProvider: ServiceProvider;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}