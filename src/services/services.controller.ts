import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './provider/services.service';
import { GetServiceFilterQueryDto } from './dtos/GetServicePaginationQueryDto';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { CreateServiceProviderDto } from './dtos/CreateServiceProviderDto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipResponseWrapper } from '../common/decorators/skip-response.decorator';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateServiceProviderDto } from './dtos/UpdateServiceProviderDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileToDto } from '../common/decorators/uploaded-file-to-dto';

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
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async createService(
    @UploadedFileToDto({ field: 'imageUrl', dto: CreateServiceDto })
    dto: CreateServiceDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this._services.createService(dto, userId);
  }

  @Post('/create-provider')
  @ApiOperation({ summary: 'Create a new service provider' })
  @ApiResponse({
    status: 201,
    description: 'Service provider created successfully',
  })
  async createServiceProvider(
    @Body() dto: CreateServiceProviderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this._services.createServiceProvider(dto, userId);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update existing service' })
  @ApiResponse({
    status: 200,
    description: 'Service successfully updated',
  })
  @ApiBody({
    description: 'Update service request body',
    type: UpdateServiceDto,
    examples: {
      example1: {
        summary: 'Update service example',
        value: {
          title: 'Plumber Painter',
          description: 'Fix leaking pipes and taps',
          imageUrl: 'https://image-url.com',
          price: 20000,
          priceUnit: 'hr',
          sponsored: true,
          categoryId: 1,
          providerId: 2,
          serviceType: 'on-demand',
        },
      },
    },
  })
  async updateService(
    @CurrentUser('sub') userId: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this._services.updateProvidedService(dto, userId);
  }

  @Put('/update-provider')
  @ApiOperation({ summary: 'Update existing service provider' })
  @ApiResponse({
    status: 200,
    description: 'Service Provider successfully updated',
  })
  @ApiBody({
    description: 'Update service provider request body',
    type: UpdateServiceDto,
    examples: {
      example1: {
        summary: 'Update service provider',
        value: {
          id: 2,
          bio: 'Dell Computer Engineer',
          skills: ['plumbing', 'electrical', 'cleaning'],
          certifications: ['ISO-9001', 'Certificate of Completion'],
          available_hours: {
            monday: ['09:00-12:00', '14:00-18:00'],
            tuesday: ['09:00-15:00'],
          },
        },
      },
    },
  })
  async updateServiceProvider(
    @CurrentUser('sub') id: number,
    @Body() dto: UpdateServiceProviderDto,
  ) {
    return this._services.updateServiceProvider(dto, id);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete existing service' })
  @ApiResponse({
    status: 200,
    description: 'Service successfully deleted',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  async deleteService(
    @CurrentUser('sub') userId: number,
    @Param('id') serviceId: number,
  ) {
    return this._services.deleteProvidedService(userId, serviceId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service returned successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getSingleService(@Param('id') id: number) {
    return this._services.getSingleService(id);
  }
}
