import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './providers/dashboard.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/interceptors/pagination/dtos/pagination-query.dto';

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly _dashboardService: DashboardService) {}

  @Get('/services')
  @ApiOkResponse({
    description: 'Populate services on dashboard',
    type: PaginationQueryDto,
  })
  async getServicesForDashboard() {
    return this._dashboardService.findServicesByLimit(6);
  }

  @Get('/categories')
  @ApiOkResponse({
    description: 'Populate categories on dashboard',
  })
  async getCategoriesForDashboard() {
    return this._dashboardService.findCategoriesByLimit(6);
  }

  /*@Get('/ordering')
  async getOrderingForDashboard() {
    return this._dashboardService.findServicesByLimit();
  }*/
}
