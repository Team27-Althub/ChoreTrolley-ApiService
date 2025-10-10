import { Injectable } from "@nestjs/common";
import { ServicesProvider } from "./services-provider";
import { GetServiceFilterQueryDto } from "../dtos/GetServicePaginationQueryDto";
import { CreateServiceDto } from "../dtos/CreateServiceDto";
import { CreateServiceProviderDto } from "../dtos/CreateServiceProviderDto";
import { UpdateServiceDto } from "../dtos/UpdateServiceDto";
import { UpdateServiceProviderDto } from "../dtos/UpdateServiceProviderDto";
import { BookingProvider } from "./booking-provider";
import { CreateBookingDto } from "../dtos/CreateBookingDto";

@Injectable()
export class ServicesService {
    constructor(
            private readonly _serviceProvider: ServicesProvider,
            private readonly _bookingProvider: BookingProvider
    ) {
    }

    async getAllCategories() {
        return this._serviceProvider.findAllCategories();
    }

    async getPaginatedService(filterQuery: GetServiceFilterQueryDto) {
        return this._serviceProvider.getServicesByPagination(filterQuery);
    }

    async getSingleService(id: number) {
        return this._serviceProvider.getSingleService(id);
    }

    async createService(createService: CreateServiceDto, userId: number) {
        return this._serviceProvider.createService(createService, userId);
    }

    async createServiceProvider(dto: CreateServiceProviderDto, userId: number) {
        return this._serviceProvider.createServiceProvider(dto, userId);
    }

    async updateProvidedService(dto: UpdateServiceDto, userId: number) {
        return this._serviceProvider.updateProvidedService(dto, userId);
    }

    async updateServiceProvider(dto: UpdateServiceProviderDto, id: number) {
        return this._serviceProvider.updateServiceProvider(dto, id);
    }

    async deleteProvidedService(userId: number, serviceId: number) {
        return this._serviceProvider.deleteProvidedService(userId, serviceId);
    }

    async createBooking(dto: CreateBookingDto, userId: number) {
        return this._bookingProvider.createBooking(dto, userId);
    }

    async findAllBookings() {
        return this._bookingProvider.findAll();
    }

    async findOneBooking(id: number) {
        return this._bookingProvider.findOne(id);
    }

    async cancelBooking(id: number, userId: number) {
        return this._bookingProvider.cancelBooking(id, userId);
    }
}
