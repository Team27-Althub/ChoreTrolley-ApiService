import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "../entities/Booking";
import { Repository } from "typeorm";
import { Service } from "../entities/service.entity";
import { CreateBookingDto } from "../dtos/CreateBookingDto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "../../users/providers/user.entity";
import { MailService } from "../../mail/providers/mail.service";

export class BookingProvider {
    constructor(
            @InjectRepository(Booking)
            private bookingRepository: Repository<Booking>,
            @InjectRepository(Service)
            private serviceRepository: Repository<Service>,
            @InjectRepository(User)
            private userRepository: Repository<User>,
            private readonly _mailService: MailService
    ) {
    }

    async createBooking(dto: CreateBookingDto, userId: number) {
        const customer = await this.userRepository.findOneBy({ id: userId });
        if (!customer) {
            throw new NotFoundException("User not found");
        }

        const service = await this.serviceRepository.findOneBy({ id: dto.serviceId });
        if (!service) {
            throw new NotFoundException("Service not found");
        }
        Object.assign(dto, { serviceProvider: service.serviceProvider });


        /** check if booking already existing **/
        const existingBooking = await this.bookingRepository.findOne({
            where: {
                customerEmail: dto.customerEmail,
                serviceProvider: { id: service.serviceProvider.id },
                service: { id: service.id },
                status: BookingStatus.pending
            },
            relations: ["service"]
        });

        if (existingBooking) {
            throw new BadRequestException(`You already have ${existingBooking.service.title} booked`);
        }

        const booking = this.bookingRepository.create({ ...dto, customer, service });

        this._mailService.sendBookingNotification(
                customer,
                booking,
                BookingStatus.pending,
                "ChoreTrolly Booking Notification"
        );

        return await this.bookingRepository.save(booking);
    }

    async findAll() {
        return this.bookingRepository.find({ relations: ["service"] });
    }

    async findOne(id: number) {
        return this.bookingRepository.findOne({ where: { id }, relations: ["service"] });
    }

    async cancelBooking(id: number, userId: number) {
        const booking = await this.bookingRepository.findOne({
            where: {
                id,
                customer: { id: userId }
            }, relations: ["service"]
        });
        if (!booking) {
            throw new NotFoundException("Booking not found");
        }
        booking.status = BookingStatus.cancelled;
        return await this.bookingRepository.save(booking);
    }
}

export enum BookingStatus {
    pending = "pending",
    confirmed = "confirmed",
    cancelled = "cancelled"
}