import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderCreateProvider } from './providers/order-create-provider';
import { OrderService } from './providers/order.service';
import { OrderCancelProvider } from './providers/order-cancel-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/providers/user.entity';
import { Order } from './entities/order.entity';
import { Address } from './entities/address.entity';
import { Grocery } from '../groceries/entities/Grocery';
import { Service } from '../services/entities/service.entity';
import { PaginationModule } from '../common/pagination/pagination.module';
import { OrderGetListProvider } from './providers/order-getlist-provider';
import { OrderSequence } from './entities/order-sequence.entity';

@Module({
  controllers: [OrderController],
  providers: [
    OrderCreateProvider,
    OrderService,
    OrderCancelProvider,
    OrderGetListProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      Address,
      Grocery,
      Service,
      OrderSequence,
    ]),
    PaginationModule,
  ],
})
export class OrderModule {}
