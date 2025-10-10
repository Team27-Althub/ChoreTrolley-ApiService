import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/providers/user.entity';
import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { Grocery } from '../../groceries/entities/Grocery';
import { Service } from '../../services/entities/service.entity';
import { Order } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { OrderSequence } from '../entities/order-sequence.entity';
import { PaystackService } from '../../paystack/paystack.service';
import { MailService } from "../../mail/providers/mail.service";

export abstract class BaseService<T> {
  protected readonly repository: Repository<T>;

  protected constructor(
    protected readonly dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  /**
   * Run a function inside a DB transaction.
   * Rolls back automatically if an error is thrown.
   */
  protected async transaction<R>(
    runInTransaction: (manager: EntityManager) => Promise<R>,
  ): Promise<R> {
    return this.dataSource.transaction(runInTransaction);
  }
}

@Injectable()
export abstract class OrderBaseProvider extends BaseService<Order> {
  constructor(
    @InjectRepository(User)
    readonly _userRepository: Repository<User>,
    @InjectRepository(Address)
    protected readonly _addressRepository: Repository<Address>,
    @InjectRepository(Grocery)
    protected readonly _groceryRepository: Repository<Grocery>,
    @InjectRepository(Service)
    protected readonly _serviceRepository: Repository<Service>,
    @InjectRepository(Order)
    protected readonly _orderRepository: Repository<Order>,
    @InjectRepository(OrderSequence)
    protected readonly _orderSequenceRepository: Repository<OrderSequence>,
    protected readonly _paginationProvider: PaginationProvider,
    protected readonly _dataSource: DataSource,
    protected readonly paystackService: PaystackService,
    protected readonly _mailService: MailService
  ) {
    super(_dataSource, Order);
  }
}
