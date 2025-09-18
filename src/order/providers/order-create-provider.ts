import { Injectable, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { Grocery } from '../../groceries/entities/Grocery';
import { Service } from '../../services/entities/service.entity';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { OrderBaseProvider } from './order-base-provider';

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
    });

    return this._orderRepository.save(orderRequest);
  }
}
