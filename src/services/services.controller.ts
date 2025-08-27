import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ServicesService } from './provider/services.service';
import { GetServiceFilterQueryDto } from './dtos/GetServicePaginationQueryDto';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { CreateServiceProviderDto } from './dtos/CreateServiceProviderDto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipResponseWrapper } from '../common/decorators/skip-response.decorator';

@Controller('services')
@ApiTags('Service Module')
export class ServicesController {
  constructor(private readonly _services: ServicesService) {}

  @Get('/categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
  })
  async getCategories() {
    return this._services.getAllCategories();
  }

  @Get('/')
  @ApiOperation({ summary: 'Get paginated list of services' })
  @ApiResponse({
    status: 200,
    description: 'Paginated services list',
  })
  @SkipResponseWrapper()
  async getPaginatedServices(@Query() filterQuery: GetServiceFilterQueryDto) {
    return this._services.getPaginatedService(filterQuery);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async createService(@Body() createService: CreateServiceDto) {
    return this._services.createService(createService);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service returned successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getSingleService(id: number) {
    return this._services.getSingleService(id);
  }

  @Post('/create-provider')
  @ApiOperation({ summary: 'Create a new service provider' })
  @ApiResponse({
    status: 201,
    description: 'Service provider created successfully',
  })
  async createServiceProvider(dto: CreateServiceProviderDto) {
    return this._services.createServiceProvider(dto);
  }

  @Put('/update')
  async updateService() {
    return '';
  }
}
