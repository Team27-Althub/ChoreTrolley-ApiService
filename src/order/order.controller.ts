import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Headers,
	HttpException,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Query,
	Req
} from "@nestjs/common";
import { OrderService } from "./providers/order.service";
import { CreateOrderDto } from "./dtos/CreateOrderDto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { OrderFilterQueryDto } from "./dtos/OrderPaginationQuery";
import { SkipResponseWrapper } from "../common/decorators/skip-response.decorator";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CancelOrderDto } from "./providers/order-cancel-provider";
import * as crypto from "crypto";
import {
	ContractType,
	PaymentMethod,
	ShippingMethod
} from "./entities/order.entity";

@Controller("order")
@ApiTags("Order Module")
export class OrderController {
	constructor(private readonly _orderService: OrderService) {
	}

	@Post()
	@ApiOperation({ summary: "Create Order for a user" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Order successfully created"
	})
	@ApiBody({
		description: "create order request body. pass the id(s) of items. ",
		type: CreateOrderDto,
		examples: {
			example1: {
				summary: "Create Order for groceries ",
				value: {
					addressId: 45,
					address: "123 Palm Street, Lagos",
					groceries: [20],
					services: null,
					shippingMethod: ShippingMethod,
					paymentMethod: PaymentMethod,
					subtotal: 5000,
					tax: 250,
					shipping: 1000,
					total: 6250
				}
			},
			example2: {
				summary: "Create Order for services.",
				value: {
					addressId: 45,
					address: "123 Palm Street, Lagos",
					groceries: null,
					services: [20],
					bookingId: 12,
					shippingMethod: ShippingMethod,
					paymentMethod: PaymentMethod,
					contractType: ContractType,
					subtotal: 5000,
					tax: 250,
					shipping: 1000,
					total: 6250
				}
			}
		}
	})
	async create(
			@CurrentUser("sub") userId: number,
			@Body() createOrderDto: CreateOrderDto
	) {
		Object.assign(createOrderDto, { userId });
		return await this._orderService.create(createOrderDto);
	}

	@Get("cleanup-sequences")
	@ApiOperation({ summary: "Clean up old order sequences manually" })
	@ApiQuery({
		name: "days",
		required: false,
		type: Number,
		description: "Delete sequences older than this number of days (default: 30)"
	})
	async cleanupSequences(@Query("days") days?: number) {
		const numDays = days ? Number(days) : 30;
		const { deletedCount } = await this._orderService.cleanUpOldSequences(numDays);
		return {
			message: `🧹 ${deletedCount} order sequences older than ${numDays} days have been deleted.`
		};
	}

	@Get("verify/:reference")
	async verifyReference(@Param("reference") reference: string) {
		try {
			const verified = await this._orderService.verify(reference);

			const data = verified;
			const status = data.status;
			const amount = data.amount / 100;
			const order = await this._orderService.findByReference(reference);

			if (!order) {
				throw new NotFoundException("Order not found");
			}

			if (Number(order.total) !== Number(amount)) {
				console.log("AmountMismatch::->", order.total, amount);
				console.log("Order::", order.id, order.total, order.total === amount);
				throw new BadRequestException("Amount mismatch");
			}

			if (status === "success") {
				await this._orderService.markAsPaid(reference);
			} else {
				await this._orderService.markAsFailed(reference);
			}

			return {
				message: "Payment verification completed successfully",
				status: status,
				amount: amount,
				reference: reference
			};
		} catch (error) {
			console.error("Error verifying payment:", error.message);
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
					"Payment verification failed",
					error.status || HttpStatus.BAD_REQUEST
			);
		}
	}

	@Get("limit/:limit")
	@ApiOperation({ summary: "Get orders with limit" })
	@ApiResponse({ status: HttpStatus.OK })
	async getOrderByLimit(
			@Param("limit") limit: number,
			@CurrentUser("sub") userId: number
	) {
		return await this._orderService.findByLimit(limit, userId);
	}

	@Get()
	@SkipResponseWrapper()
	@ApiOperation({ summary: "Get orders with pagination" })
	@ApiResponse({ status: HttpStatus.OK })
	async getOrderListPaginated(
			@Body() filterQuery: OrderFilterQueryDto,
			@CurrentUser("sub") userId: number
	) {
		return await this._orderService.findAll(filterQuery, userId);
	}

	@Post("cancel")
	@ApiOperation({ summary: "Get orders with limit" })
	@ApiBody({
		type: CancelOrderDto,
		description: "Cancel order by passing order id",
		examples: {
			example1: {
				summary: "Cancel Order",
				value: {
					id: 1
				}
			}
		}
	})
	@ApiResponse({ status: HttpStatus.CREATED })
	async cancel(@CurrentUser("sub") userId: number, @Body("id") id: number) {
		const dto = { id, userId };
		return await this._orderService.cancel(dto, (result) => {
			console.log("OrderCanceled: ", result);
		});
	}

	@Post("webhook")
	async webhook(
			@Req() req: any,
			@Headers("x-paystack-signature") signature: string
	) {
		try {
			const secret = process.env.PAYSTACK_SECRET_KEY;

			// Verify signature with raw body
			const hash = crypto
					.createHmac("sha512", secret)
					.update(req.rawBody)
					.digest("hex");

			if (hash !== signature) {
				throw new HttpException("Invalid signature", HttpStatus.FORBIDDEN);
			}

			const event = req.body;

			if (event.event === "charge.success") {
				const { reference } = event.data;
				await this._orderService.markAsPaid(reference);
			}

			if (event.event === "charge.failed") {
				const { reference } = event.data;
				await this._orderService.markAsFailed(reference);
			}

			return { status: HttpStatus.OK, message: "Webhook received" };
		} catch (error) {
			console.error("Webhook error:", error);
			throw new HttpException(
					"Webhook processing failed",
					HttpStatus.BAD_REQUEST
			);
		}
	}
}
