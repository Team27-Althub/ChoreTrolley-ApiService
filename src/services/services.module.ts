import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './provider/services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/entities/review.entity';
import { ServicesProvider } from './provider/services-provider';
import { CategoryModule } from '../category/category.module';
import { Service } from './entities/service.entity';
import { PaginationModule } from '../common/pagination/pagination.module';
import { ServiceProvider } from './entities/service-provider.entity';
import { Booking } from "./entities/Booking";
import { BookingProvider } from "./provider/booking-provider";
import { User } from "../users/providers/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Service, ServiceProvider, Booking, User]),
    forwardRef(() => CategoryModule),
    PaginationModule,
  ],
  providers: [ServicesService, ServicesProvider, BookingProvider],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
