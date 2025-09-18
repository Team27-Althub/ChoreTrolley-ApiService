import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderBaseProvider } from './order-base-provider';
import { Order, OrderStatus, PaymentMethod } from '../entities/order.entity';
import { User } from '../../users/providers/user.entity';

export class CancelOrderDto {
  id: number;
  userId: number;
}

@Injectable()
export class OrderCancelProvider extends OrderBaseProvider {
  /**
   *
   * @param dto
   * @param callback
   */
  async cancelOrder(dto: CancelOrderDto, callback?: (order: Order) => void) {
    return this.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const orderRepository = manager.getRepository(Order);

      const user = await userRepository.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException('User not found');

      const order = await orderRepository.findOne({
        where: { id: dto.id, user: { id: dto.userId } },
        relations: ['user'],
      });

      if (!order) throw new NotFoundException('Order not found');

      if (order.status === OrderStatus.CANCELED) {
        throw new BadRequestException('Order is already canceled');
      }
      order.status = OrderStatus.CANCELED;
      await orderRepository.save(order);

      switch (order.paymentMethod) {
        case PaymentMethod.TRANSFER:
        case PaymentMethod.CREDIT_CARD:
          //Do other stuffs here
          if (callback) callback(order);
          break;
        default:
          console.log('Order Cancelled');
      }
      return order;
    });
  }
}
