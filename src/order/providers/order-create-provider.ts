import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { Grocery } from '../../groceries/entities/Grocery';
import { Service } from '../../services/entities/service.entity';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { OrderBaseProvider } from './order-base-provider';
import { OrderSequence } from '../entities/order-sequence.entity';

@Injectable()
export class OrderCreateProvider extends OrderBaseProvider {
  /**
   *
   * @param dto
   */
  async createOrderRequest(dto: CreateOrderDto) {
    let groceries: Grocery[] = [];
    let services: Service[] = [];

    const user = await this._userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    // find groceries
    if (dto.groceries?.length) {
      groceries = await this._groceryRepository.find({
        where: { id: In(dto.groceries) },
      });
    }

    // find services
    if (dto.services?.length) {
      services = await this._serviceRepository.find({
        where: { id: In(dto.services) },
      });
    }

    const prefix = groceries.length ? 'CTGx' : 'CTSx';
    const code = await this.createOrderDataByCode(prefix);

    /**
     * Initialize paystack
     */
    const callbackUrl = `${process.env.BASE_URL}/order/verify`;
    const init = await this.paystackService.initPayment(
      user.email,
      dto.total,
      callbackUrl,
    );

    const orderRequest = this._orderRepository.create({
      user,
      services: services,
      groceries: groceries,
      shippingMethod: dto.shippingMethod,
      contractType: dto.contractType,
      paymentMethod: dto.paymentMethod,
      subtotal: dto.subtotal,
      shipping: dto.shipping,
      total: dto.total,
      tax: dto.tax,
      code: code,
      reference: init.data.reference,
    });
    await this._orderRepository.save(orderRequest);
    return { order: orderRequest, paymentUrl: init.data.authorization_url };
  }

  private async createOrderDataByCode(prefix: string): Promise<string> {
    const now = new Date();
    const period = now.toISOString().slice(0, 7);

    return await this.transaction(async (manager) => {
      let seq = await manager.findOne(OrderSequence, {
        where: { prefix, period },
      });

      if (!seq) {
        seq = manager.create(OrderSequence, { prefix, period, lastNumber: 0 });
      }
      seq.lastNumber += 1;
      await manager.save(seq);
      const datePart = now.toISOString().slice(0, 7).replace(/-/g, '');
      return `${prefix}${datePart}${seq.lastNumber.toString().padStart(4, '0')}`;
    });
  }

  getPaystackService() {
    return this.paystackService;
  }
}
