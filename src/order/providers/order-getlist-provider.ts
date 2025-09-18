import { OrderBaseProvider } from './order-base-provider';
import { OrderFilterQueryDto } from '../dtos/OrderPaginationQuery';

export class OrderGetListProvider extends OrderBaseProvider {
  async getOrderListPaginated(filterQuery: OrderFilterQueryDto) {
    return this._paginationProvider.paginateQuery(
      {
        limit: filterQuery.limit,
        page: filterQuery.page,
      },
      this._orderRepository,
    );
  }

  async getLimitedOrderList(limit: number) {
    return this._orderRepository.find({
      take: limit,
    });
  }

  async findOrderById(id: number) {
    return this._orderRepository.findOneBy({ id });
  }
}
