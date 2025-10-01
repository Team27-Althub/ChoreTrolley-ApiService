import { Injectable } from '@nestjs/common';
import { OrderBaseProvider } from './order-base-provider';
import { PaymentStatus } from '../entities/order.entity';

@Injectable()
export class OrderStatusProvider extends OrderBaseProvider {
  async markAsPaid(reference: string) {
    const order = await this._orderRepository.findOne({ where: { reference } });
    if (!order) throw new Error('Order not found');
    order.paymentStatus = PaymentStatus.PAID;
    return this._orderRepository.save(order);
  }

  async markAsFailed(reference: string) {
    const order = await this._orderRepository.findOne({ where: { reference } });
    if (!order) throw new Error('Order not found');
    order.paymentStatus = PaymentStatus.FAILED;
    return this._orderRepository.save(order);
  }
}
