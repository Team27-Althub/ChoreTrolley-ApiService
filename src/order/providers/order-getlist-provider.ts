import { OrderBaseProvider } from "./order-base-provider";
import { OrderFilterQueryDto } from "../dtos/OrderPaginationQuery";

export class OrderGetListProvider extends OrderBaseProvider {
	async getOrderListPaginated(filterQuery: OrderFilterQueryDto, userId: number) {
		return this._paginationProvider.paginateQuery(
				{
					limit: filterQuery.limit,
					page: filterQuery.page,
					userId: userId
				},
				this._orderRepository
		);
	}

	async getLimitedOrderList(limit: number, userId: number) {
		return this._orderRepository.find({
			where: { user: { id: userId } },
			take: limit
		});
	}

	async findOrderById(id: number) {
		return this._orderRepository.findOneBy({ id });
	}

	async findOrderByReference(reference: string) {
		return this._orderRepository.findOneBy({ reference: reference });
	}
}
