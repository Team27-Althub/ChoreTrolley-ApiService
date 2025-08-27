import { forwardRef, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './providers/dashboard.service';
import { DashboardProvider } from './providers/DashboardProvider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { Service } from '../services/entities/service.entity';
import { ServiceProvider } from '../services/entities/service-provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceProvider]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardProvider],
})
export class DashboardModule {}
