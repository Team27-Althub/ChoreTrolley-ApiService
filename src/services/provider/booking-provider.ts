import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "../entities/Booking";
import { Repository } from "typeorm";
import { Service } from "../entities/service.entity";
import { CreateBookingDto } from "../dtos/CreateBookingDto";
import { NotFoundException } from "@nestjs/common";

export class BookingProvider {
    constructor(
            @InjectRepository(Booking)
            private bookingRepository: Repository<Booking>,
            @InjectRepository(Service)
            private serviceRepository: Repository<Service>
    ) {
    }

    async createBooking(dto: CreateBookingDto) {
        const service = await this.serviceRepository.findOneBy({ id: dto.serviceId });
        if (!service) {
            throw new NotFoundException("Service not found");
        }
        const booking = this.bookingRepository.create({
            ...dto,
            service
        });
        return await this.bookingRepository.save(booking);
    }

    async findAll() {
        return this.bookingRepository.find({ relations: ["service"] });
    }

    async findOne(id: number) {
        return this.bookingRepository.findOne({ where: { id }, relations: ["service"] });
    }
}