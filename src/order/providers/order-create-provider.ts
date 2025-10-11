import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { In, LessThan } from "typeorm";
import { Grocery } from "../../groceries/entities/Grocery";
import { Service } from "../../services/entities/service.entity";
import { CreateOrderDto } from "../dtos/CreateOrderDto";
import { OrderBaseProvider } from "./order-base-provider";
import { OrderSequence } from "../entities/order-sequence.entity";

@Injectable()
export class OrderCreateProvider extends OrderBaseProvider {
	private readonly logger = new Logger(OrderCreateProvider.name);

	/**
	 *
	 * @param dto
	 */
	async createOrderRequest(dto: CreateOrderDto) {
		let booking = null;
		let groceries: Grocery[] = [];
		let services: Service[] = [];

		const user = await this._userRepository.findOneBy({ id: dto.userId });
		if (!user) throw new NotFoundException("User not found");

		// find groceries
		if (dto.groceries?.length) {
			groceries = await this._groceryRepository.findBy({ id: In(dto.groceries) });
		}

		// find services
		if (dto.services?.length) {
			services = await this._serviceRepository.findBy({ id: In(dto.services) });
		}

		//confirm booking exists
		if (dto.bookingId) {
			booking = await this._bookingRepository.findOneBy({ id: dto.bookingId });
		}

		const prefix = groceries.length ? "CTGx" : "CTSx";
		const code = await this.createOrderDataByCode(prefix);

		/*** Initialize paystack */
		const callbackUrl = `${process.env.FRONTEND_BASE_URL}/payment/verify`;
		const init = await this.paystackService.initPayment(
				user.email,
				dto.total,
				callbackUrl
		);

		const orderRequest = this._orderRepository.create(
				{
					user: user,
					booking: booking,
					// groceries: dto.groceries?.map((id) => ({ id })) || [],
					// services: dto.services?.map((id) => ({ id })) || [],
					groceries: groceries, //managed by db insert
					services: services,
					shippingMethod: dto.shippingMethod,
					contractType: dto.contractType,
					paymentMethod: dto.paymentMethod,
					reference: init.data.reference,
					subtotal: dto.subtotal,
					shipping: dto.shipping,
					total: dto.total,
					tax: dto.tax,
					code: code
				}
		);
		await this._orderRepository.save(orderRequest);
		return { order: orderRequest, paymentUrl: init.data.authorization_url };
	}

	private async createOrderDataByCode(prefix: string): Promise<string> {
		const now = new Date();
		//const period = now.toISOString().slice(0, 7);
		//const period = now.toISOString().slice(0, 10).replace(/-/g, "");
		const rChars = Math.random().toString(36).substring(2, 5).toUpperCase();

		return await this.transaction(async (manager) => {
			const period = now.toISOString().slice(0, 7);

			let seq = await manager.findOne(OrderSequence, {
				where: { prefix, period },
				lock: { mode: "pessimistic_write" }
			});

			/*let seq = await manager
					.createQueryBuilder(OrderSequence, "seq")
					.setLock("pessimistic_write") // prevents concurrent updates
					.where("seq.prefix = :prefix", { prefix })
					.andWhere("seq.period = :period", { period })
					.getOne();*/

			if (!seq) {
				seq = manager.create(OrderSequence, { prefix, period, lastNumber: 0 });
				await manager.save(seq);
			}
			seq.lastNumber += 1;
			await manager.save(seq);
			const datePart = now.toISOString().slice(0, 7).replace(/-/g, "");
			return `${prefix}${rChars}${datePart}${seq.lastNumber.toString().padStart(4, "0")}`;
		});
	}

	/*private async createOrderDataByCode(prefix: string): Promise<string> {
		const now = new Date();
		const rChars = Math.random().toString(36).substring(2, 5).toUpperCase();
		const period = now.toISOString().slice(0, 7);
		const datePart = period.replace(/-/g, '');

		return await this._dataSource.transaction(async (manager) => {
			// Try to find and lock the row
			let seq = await manager.findOne(OrderSequence, {
				where: { prefix, period },
				lock: { mode: 'pessimistic_write' },
			});

			// If it doesn't exist, create it safely with upsert
			if (!seq) {
				// Prevent duplicate creation in concurrent transactions
				try {
					seq = manager.create(OrderSequence, { prefix, period, lastNumber: 1 });
					await manager.insert(OrderSequence, seq);
				} catch (err: any) {
					// Another transaction inserted it — refetch with lock
					seq = await manager.findOne(OrderSequence, {
						where: { prefix, period },
						lock: { mode: 'pessimistic_write' },
					});
					seq.lastNumber += 1;
					await manager.save(seq);
				}
			} else {
				// Normal case: increment existing record
				seq.lastNumber += 1;
				await manager.save(seq);
			}

			return `${prefix}${rChars}${datePart}${seq.lastNumber.toString().padStart(4, '0')}`;
		});
	}*/

	/** cleanOldSequences using cron job **/
	async cleanOldSequences(days = 30) {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		const oldSequences = await this._orderRepository.find({
			where: { createdAt: LessThan(cutoffDate) }
		});

		if (!oldSequences.length) {
			return { deletedCount: 0 };
		}

		//const cutoffKey = cutoffDate.toISOString().slice(0, 10).replace(/-/g, "");

		/*await this._dataSource
				.getRepository(OrderSequence)
				.createQueryBuilder()
				.delete()
				.where("period < :cutoffKey", { cutoffKey })
				.execute();*/


		this.logger.log(`🧹 Cleaned up order sequences older than ${days} days.`);
		await this._orderRepository.remove(oldSequences);
		return { deletedCount: oldSequences.length };
	}

	getPaystackService() {
		return this.paystackService;
	}
}
