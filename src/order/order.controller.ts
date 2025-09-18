import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import { CreateOrderDto } from './dtos/CreateOrderDto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderFilterQueryDto } from './dtos/OrderPaginationQuery';
import { SkipResponseWrapper } from '../common/decorators/skip-response.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CancelOrderDto } from './providers/order-cancel-provider';
import {
  ContractType,
  PaymentMethod,
  ShippingMethod,
} from './entities/order.entity';

@Controller('order')
@ApiTags('Order Module')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create Order for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order successfully created',
  })
  @ApiBody({
    description: 'create order request body. pass the id(s) of items. ',
    type: CreateOrderDto,
    examples: {
      example1: {
        summary: 'Create Order for groceries ',
        value: {
          addressId: 45,
          address: '123 Palm Street, Lagos',
          groceries: [20],
          services: null,
          shippingMethod: ShippingMethod,
          paymentMethod: PaymentMethod,
          subtotal: 5000,
          tax: 250,
          shipping: 1000,
          total: 6250,
        },
      },
      example2: {
        summary: 'Create Order for services.',
        value: {
          addressId: 45,
          address: '123 Palm Street, Lagos',
          groceries: [20],
          services: null,
          shippingMethod: ShippingMethod,
          paymentMethod: PaymentMethod,
          contractType: ContractType,
          subtotal: 5000,
          tax: 250,
          shipping: 1000,
          total: 6250,
        },
      },
    },
  })
  async create(
    @CurrentUser('sub') userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    Object.assign(createOrderDto, { userId });
    return await this._orderService.create(createOrderDto);
  }

  @Get('limit/:limit')
  @ApiOperation({ summary: 'Get orders with limit' })
  @ApiResponse({ status: HttpStatus.OK })
  async getOrderByLimit(@Param('limit') limit: number) {
    return await this._orderService.findByLimit(limit);
  }

  @Get()
  @SkipResponseWrapper()
  @ApiOperation({ summary: 'Get orders with pagination' })
  @ApiResponse({ status: HttpStatus.OK })
  async getOrderListPaginated(@Body() filterQuery: OrderFilterQueryDto) {
    return await this._orderService.findAll(filterQuery);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Get orders with limit' })
  @ApiBody({
    type: CancelOrderDto,
    description: 'Cancel order by passing order id',
    examples: {
      example1: {
        summary: 'Cancel Order',
        value: {
          id: 1,
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED })
  async cancel(@CurrentUser('sub') userId: number, @Body('id') id: number) {
    const dto = { id, userId };
    return await this._orderService.cancel(dto, (result) => {
      console.log('OrderCanceled: ', result);
    });
  }
}
