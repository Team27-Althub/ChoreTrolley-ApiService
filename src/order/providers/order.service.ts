import { Injectable } from '@nestjs/common';
import { OrderCreateProvider } from './order-create-provider';
import { CancelOrderDto, OrderCancelProvider } from './order-cancel-provider';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { OrderGetListProvider } from './order-getlist-provider';
import { OrderFilterQueryDto } from '../dtos/OrderPaginationQuery';
import { Order } from '../entities/order.entity';
import { OrderStatusProvider } from './order-status.provider';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderCreateProvider: OrderCreateProvider,
    private readonly orderCancelProvider: OrderCancelProvider,
    private readonly orderGetListProvider: OrderGetListProvider,
    protected readonly orderStatusProvider: OrderStatusProvider,
  ) {}

  async create(dto: CreateOrderDto) {
    return this.orderCreateProvider.createOrderRequest(dto);
  }

  async verify(ref: string) {
    return this.orderCreateProvider.getPaystackService().verifyPayment(ref);
  }

  async findById(id: number) {
    return this.orderGetListProvider.findOrderById(id);
  }

  async findAll(filterQuery: OrderFilterQueryDto, userId: number) {
    return this.orderGetListProvider.getOrderListPaginated(filterQuery, userId);
  }

  async findByLimit(limit: number, userId: number) {
    return this.orderGetListProvider.getLimitedOrderList(limit, userId);
  }

  async cancel(dto: CancelOrderDto, callback?: (order: Order) => void) {
    return this.orderCancelProvider.cancelOrder(dto, callback);
  }

  async markAsPaid(reference: string) {
    return this.orderStatusProvider.markAsPaid(reference);
  }

  async markAsFailed(reference: string) {
    return this.orderStatusProvider.markAsFailed(reference);
  }

  async findByReference(reference: string) {
    return this.orderGetListProvider.findOrderByReference(reference);
  }

  async cleanUpOldSequences(days: number) {
    return this.orderCreateProvider.cleanOldSequences(days)
  }
}
