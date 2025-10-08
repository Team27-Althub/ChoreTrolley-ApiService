import { Module } from '@nestjs/common';
import { GroceriesController } from './groceries.controller';
import { GroceriesService } from './providers/groceries.service';
import { GroceriesProvider } from './providers/groceries-provider';
import { Grocery } from './entities/Grocery';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '../common/pagination/pagination.module';
import { ServiceProvider } from '../services/entities/service-provider.entity';
import { GroceryCategory } from "../category/entities/grocery.category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Grocery, ServiceProvider, GroceryCategory]),
    PaginationModule,
  ],
  controllers: [GroceriesController],
  providers: [GroceriesService, GroceriesProvider],
})
export class GroceriesModule {}
