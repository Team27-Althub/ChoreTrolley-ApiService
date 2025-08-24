import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './provider/services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/entities/review.entity';
import { ServicesProvider } from './provider/services-provider';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => CategoryModule),
  ],
  providers: [ServicesService, ServicesProvider],
  controllers: [ServicesController],
})
export class ServicesModule {}
