import { Injectable } from '@nestjs/common';
import { OrderCreateProvider } from './order-create-provider';
import { CancelOrderDto, OrderCancelProvider } from './order-cancel-provider';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { OrderGetListProvider } from './order-getlist-provider';
import { OrderFilterQueryDto } from '../dtos/OrderPaginationQuery';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderCreateProvider: OrderCreateProvider,
    private readonly orderCancelProvider: OrderCancelProvider,
    private readonly orderGetListProvider: OrderGetListProvider,
  ) {}

  async create(dto: CreateOrderDto) {
    return this.orderCreateProvider.createOrderRequest(dto);
  }

  async findById(id: number) {
    return this.orderGetListProvider.findOrderById(id);
  }

  async findAll(filterQuery: OrderFilterQueryDto) {
    return this.orderGetListProvider.getOrderListPaginated(filterQuery);
  }

  async findByLimit(limit: number) {
    return this.orderGetListProvider.getLimitedOrderList(limit);
  }

  async cancel(dto: CancelOrderDto, callback?: (order: Order) => void) {
    return this.orderCancelProvider.cancelOrder(dto, callback);
  }
}
